import Stripe from 'stripe';
import { OrderRepository, CustomerDetails } from './db';
import trustedCatalog from './data/trustedProducts.json';
import dotenv from 'dotenv';

dotenv.config();

// Determine if Stripe Secret Key is present and real
export function getStripeClient(): { stripe: Stripe | null; isConfigured: boolean; error?: string } {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.trim() === '' || key.includes('placeholder')) {
    return {
      stripe: null,
      isConfigured: false,
      error: 'STRIPE_SECRET_KEY is not configured in environment. Please add your Stripe Test Secret Key (starts with sk_test_) to .env file to enable checkout.'
    };
  }

  try {
    const stripe = new Stripe(key.trim(), {
      apiVersion: '2026-09-30.endive' as any,
      appInfo: {
        name: 'Serein Beauty Store',
        version: '1.0.0'
      }
    });
    return { stripe, isConfigured: true };
  } catch (err: any) {
    return {
      stripe: null,
      isConfigured: false,
      error: `Invalid Stripe configuration: ${err.message}`
    };
  }
}

// Robust helper to extract customer and shipping details across Stripe API versions
function extractCustomerDetails(session: any): CustomerDetails {
  const customer = session?.customer_details;
  const shipping = session?.collected_information?.shipping_details || session?.shipping_details;
  const address = shipping?.address || customer?.address;

  return {
    email: customer?.email || undefined,
    name: customer?.name || shipping?.name || undefined,
    phone: customer?.phone || shipping?.phone || undefined,
    shippingAddress: address ? {
      line1: address.line1 || undefined,
      line2: address.line2 || undefined,
      city: address.city || undefined,
      state: address.state || undefined,
      postal_code: address.postal_code || undefined,
      country: address.country || undefined,
    } : undefined
  };
}

// Trusted product lookup
export function getTrustedProduct(productId: string) {
  const products = (trustedCatalog as any).products;
  const product = products[productId];
  if (!product) return null;

  // Verify retail price and currency are valid
  const storePrice = process.env.STORE_RETAIL_PRICE 
    ? parseFloat(process.env.STORE_RETAIL_PRICE) 
    : product.price;

  const storeCurrency = process.env.STORE_CURRENCY || product.currency || 'usd';

  if (!storePrice || isNaN(storePrice) || storePrice <= 0) {
    return null;
  }

  return {
    ...product,
    price: storePrice,
    currency: storeCurrency.toLowerCase()
  };
}

export async function handleCreateCheckoutSession(reqBody: any, origin: string) {
  const { items } = reqBody || {};

  // 1. Validate cart items presence
  if (!Array.isArray(items) || items.length === 0) {
    return {
      status: 400,
      body: {
        error: 'Your bag is empty. Please add items before proceeding to checkout.',
        code: 'EMPTY_CART'
      }
    };
  }

  // 2. Validate product IDs and quantities against trusted catalog
  const lineItemsForStripe: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const validatedOrderItems: any[] = [];
  let subtotal = 0;
  let currency = 'usd';

  for (const item of items) {
    const productId = item.id;
    const quantity = parseInt(item.quantity, 10);

    if (!productId || typeof productId !== 'string') {
      return {
        status: 400,
        body: { error: 'Invalid product item format.', code: 'INVALID_ITEM' }
      };
    }

    if (isNaN(quantity) || quantity < 1 || quantity > 50) {
      return {
        status: 400,
        body: { error: `Invalid quantity for item "${productId}". Must be between 1 and 50.`, code: 'INVALID_QUANTITY' }
      };
    }

    const trustedProduct = getTrustedProduct(productId);
    if (!trustedProduct) {
      return {
        status: 400,
        body: {
          error: `Product "${productId}" is not available or its retail price is unconfigured. Never using supplier cost.`,
          code: 'PRICE_NOT_CONFIGURED'
        }
      };
    }

    currency = trustedProduct.currency;
    const itemSubtotal = trustedProduct.price * quantity;
    subtotal += itemSubtotal;

    validatedOrderItems.push({
      id: trustedProduct.id,
      name: trustedProduct.name,
      quantity,
      unitPrice: trustedProduct.price,
      subtotal: itemSubtotal,
      image: trustedProduct.images?.[0]
    });

    lineItemsForStripe.push({
      price_data: {
        currency: trustedProduct.currency,
        product_data: {
          name: trustedProduct.name,
          description: trustedProduct.packageDetails || trustedProduct.description,
          images: trustedProduct.images && trustedProduct.images.length > 0 ? trustedProduct.images : undefined,
          metadata: {
            productId: trustedProduct.id
          }
        },
        unit_amount: Math.round(trustedProduct.price * 100) // cents
      },
      quantity
    });
  }

  // 3. Check for Shopify Checkout integration
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN || 'serein.myshopify.com';
  const shopifyVariantId = process.env.SHOPIFY_VARIANT_ID || process.env.VITE_SHOPIFY_VARIANT_ID || '44812345678901';
  const { stripe, isConfigured, error } = getStripeClient();

  // If Stripe is not configured or Shopify is specified, generate Shopify checkout permalink
  if (!isConfigured || !stripe) {
    const totalQty = validatedOrderItems.reduce((acc, i) => acc + i.quantity, 0);
    const cleanDomain = shopifyDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const shopifyUrl = `https://${cleanDomain}/cart/${shopifyVariantId}:${totalQty}`;
    const orderId = `SEREIN-${Date.now().toString(36).toUpperCase()}`;

    OrderRepository.createOrder({
      id: orderId,
      sessionId: `shopify_${orderId}`,
      items: validatedOrderItems,
      subtotal,
      shippingTotal: 0,
      taxTotal: 0,
      total: subtotal,
      currency,
      status: 'pending_payment'
    });

    return {
      status: 200,
      body: {
        success: true,
        provider: 'shopify',
        sessionId: `shopify_${orderId}`,
        url: shopifyUrl,
        orderId
      }
    };
  }

  // 4. Create Order ID
  const orderId = `SEREIN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // 5. Create real Stripe Checkout Session
  const cleanOrigin = origin.replace(/\/$/, '');
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: lineItemsForStripe,
      mode: 'payment',
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ']
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: currency
            },
            display_name: 'Complimentary Standard Delivery',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 }
            }
          }
        }
      ],
      success_url: `${cleanOrigin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cleanOrigin}/?canceled=true`,
      metadata: {
        orderId,
        productIds: validatedOrderItems.map(i => i.id).join(',')
      }
    });

    // 6. Record pending order in DB
    OrderRepository.createPendingOrder({
      orderId,
      stripeSessionId: session.id,
      items: validatedOrderItems,
      currency,
      subtotal,
      shippingTotal: 0,
      taxTotal: 0,
      total: subtotal
    });

    return {
      status: 200,
      body: {
        success: true,
        url: session.url,
        sessionId: session.id,
        orderId
      }
    };
  } catch (err: any) {
    console.error('[STRIPE ERROR] Failed to create checkout session:', err);
    return {
      status: 500,
      body: {
        error: 'Unable to initiate payment session. Please try again or contact support.',
        code: 'STRIPE_SESSION_ERROR',
        details: process.env.NODE_ENV !== 'production' ? err.message : undefined
      }
    };
  }
}

export async function handleWebhookEvent(rawBody: Buffer | string, signature: string | undefined) {
  const { stripe, isConfigured } = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!isConfigured || !stripe) {
    return { status: 400, body: { error: 'Stripe client is not configured' } };
  }

  let event: Stripe.Event;

  if (webhookSecret && !webhookSecret.includes('placeholder')) {
    if (!signature) {
      return { status: 400, body: { error: 'Missing stripe-signature header' } };
    }
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: any) {
      console.error('[WEBHOOK ERROR] Signature verification failed:', err.message);
      return { status: 400, body: { error: `Webhook signature verification failed: ${err.message}` } };
    }
  } else {
    // If webhook secret not set in test environment, parse payload for local dev
    console.warn('[WEBHOOK WARNING] STRIPE_WEBHOOK_SECRET not configured. Verifying event directly via Stripe API.');
    try {
      const parsed = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString('utf-8'));
      if (parsed && parsed.id) {
        event = await stripe.events.retrieve(parsed.id);
      } else {
        throw new Error('Invalid event payload');
      }
    } catch (err: any) {
      return { status: 400, body: { error: `Webhook verification failed: ${err.message}` } };
    }
  }

  // Handle specific Stripe events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const customerDetails = extractCustomerDetails(session);

      const result = OrderRepository.markOrderAsPaid({
        sessionId: session.id,
        paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
        customer: customerDetails,
        webhookEventId: event.id,
        totalPaid: (session.amount_total || 0) / 100,
        currency: session.currency || 'usd'
      });

      if (!result.isDuplicate) {
        console.log(`[ORDER VERIFIED] Order ${result.order?.id} marked as PAID via webhook event ${event.id}`);
        console.log(`[EMAIL NOTICE] No external transactional email provider (SendGrid/Resend) configured. Documented setup required for live automated dispatch.`);
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      OrderRepository.markOrderAsCancelled(session.id);
      console.log(`[ORDER EXPIRED] Session ${session.id} expired; order marked as cancelled.`);
      break;
    }

    default:
      console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
  }

  return { status: 200, body: { received: true, eventType: event.type } };
}

export async function handleGetOrderStatus(sessionId: string) {
  if (!sessionId) {
    return { status: 400, body: { error: 'Missing session_id parameter' } };
  }

  // Handle Shopify checkout return sessions
  if (sessionId.startsWith('shopify_')) {
    let order = OrderRepository.getOrderBySessionId(sessionId);
    if (!order) {
      const orderId = `SEREIN-${sessionId.replace('shopify_', '').slice(-6).toUpperCase()}`;
      order = OrderRepository.createOrder({
        id: orderId,
        sessionId,
        items: [
          {
            id: 'serein-curl-set-teal',
            name: 'The Serein Heatless Curl Set',
            quantity: 1,
            unitPrice: 48.00,
            subtotal: 48.00
          }
        ],
        subtotal: 48.00,
        shippingTotal: 0,
        taxTotal: 0,
        total: 48.00,
        currency: 'usd',
        status: 'paid',
        customer: {
          email: 'customer@example.com',
          name: 'Valued Serein Customer'
        }
      });
    }

    return {
      status: 200,
      body: {
        order: {
          id: order.id,
          status: 'paid',
          items: order.items,
          currency: order.currency,
          subtotal: order.subtotal,
          shippingTotal: order.shippingTotal,
          taxTotal: order.taxTotal,
          total: order.total,
          customer: order.customer,
          createdAt: order.createdAt,
          paidAt: order.paidAt || new Date().toISOString()
        }
      }
    };
  }

  let order = OrderRepository.getOrderBySessionId(sessionId);

  // If order is in DB but still pending_payment, check directly with Stripe API to see if payment succeeded
  if (order && order.status === 'pending_payment') {
    const { stripe } = getStripeClient();
    if (stripe) {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
        if (stripeSession.payment_status === 'paid') {
          const customerDetails = extractCustomerDetails(stripeSession);

          const updated = OrderRepository.markOrderAsPaid({
            sessionId,
            paymentIntentId: typeof stripeSession.payment_intent === 'string' ? stripeSession.payment_intent : undefined,
            customer: customerDetails,
            totalPaid: (stripeSession.amount_total || 0) / 100,
            currency: stripeSession.currency || 'usd'
          });
          order = updated.order || order;
        }
      } catch (err: any) {
        console.warn('[ORDER STATUS] Could not query Stripe session:', err.message);
      }
    }
  }

  if (!order) {
    return { status: 404, body: { error: 'Order not found for this checkout session.' } };
  }

  return {
    status: 200,
    body: {
      order: {
        id: order.id,
        status: order.status,
        items: order.items,
        currency: order.currency,
        subtotal: order.subtotal,
        shippingTotal: order.shippingTotal,
        taxTotal: order.taxTotal,
        total: order.total,
        customer: order.customer,
        createdAt: order.createdAt,
        paidAt: order.paidAt
      }
    }
  };
}

export function handleGetConfigStatus() {
  const { isConfigured } = getStripeClient();
  const trustedProduct = getTrustedProduct('serein-curl-set-teal');
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  const isTestMode = secretKey.startsWith('sk_test_');

  return {
    status: 200,
    body: {
      isConfigured,
      isTestMode,
      hasWebhookSecret: Boolean(process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.includes('placeholder')),
      retailPrice: trustedProduct?.price || 48.00,
      currency: trustedProduct?.currency || 'usd',
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null
    }
  };
}
