/// <reference types="vite/client" />
import { getShopifyConfig } from './shopifyConfig';

export interface ShopifyLineItem {
  variantId: string;
  quantity: number;
}

export interface CustomerShippingAddress {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
}

export interface CreateCheckoutParams {
  items: ShopifyLineItem[];
  email?: string;
  shippingAddress?: CustomerShippingAddress;
}

export interface CheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  cartId?: string;
  error?: string;
  setupRequired?: boolean;
}

const API_VERSION =
  (import.meta as any).env?.VITE_SHOPIFY_API_VERSION || '2024-07';

const CART_CREATE_MUTATION = `
mutation cartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
    userErrors {
      code
      field
      message
    }
  }
}
`;

/**
 * Creates a real Shopify cart session and retrieves the official checkoutUrl
 * via Storefront API (tries serverless /api/shopify-cart first, then client GraphQL).
 */
export async function createShopifyCheckoutSession(
  params: CreateCheckoutParams
): Promise<CheckoutResult> {
  const activeConfig = getShopifyConfig();
  const domain = (activeConfig.storeDomain || 'f0jzb7-r0.myshopify.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
  const defaultVariantId = activeConfig.variantId || '51592955855122';
  const token = (
    activeConfig.storefrontAccessToken ||
    (import.meta as any).env?.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    ''
  ).trim();

  const effectiveItems =
    params.items && params.items.length > 0
      ? params.items
      : [{ variantId: defaultVariantId, quantity: 1 }];

  // 1. First attempt: call secure Vercel serverless function /api/shopify-cart
  try {
    const res = await fetch('/api/shopify-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: effectiveItems,
        email: params.email,
        shippingAddress: params.shippingAddress,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.checkoutUrl) {
        return {
          success: true,
          checkoutUrl: data.checkoutUrl,
          cartId: data.cartId,
        };
      }
      if (data.error) {
        return {
          success: false,
          error: data.error,
          setupRequired: data.setupRequired,
        };
      }
    }
  } catch (err) {
    console.warn('[SHOPIFY CHECKOUT] Serverless /api/shopify-cart not reachable, checking client fallback...', err);
  }

  // 2. Client-side Storefront API fallback if public token is available
  if (token) {
    try {
      const lineItems = effectiveItems.map((item) => {
        const rawId = String(item.variantId || defaultVariantId).trim();
        const merchandiseId = rawId.startsWith('gid://')
          ? rawId
          : `gid://shopify/ProductVariant/${rawId}`;
        return {
          merchandiseId,
          quantity: Math.max(1, item.quantity),
        };
      });

      const cartInput: any = { lines: lineItems };
      if (params.email && params.email.includes('@')) {
        cartInput.buyerIdentity = { email: params.email.trim() };
      }

      const gqlRes = await fetch(
        `https://${domain}/api/${API_VERSION}/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token,
          },
          body: JSON.stringify({
            query: CART_CREATE_MUTATION,
            variables: { input: cartInput },
          }),
        }
      );

      if (gqlRes.ok) {
        const gqlData = await gqlRes.json();
        const cartData = gqlData.data?.cartCreate;
        const userErrors = cartData?.userErrors || [];

        if (userErrors.length > 0) {
          return {
            success: false,
            error: userErrors[0].message || 'Shopify cart creation error',
          };
        }

        if (cartData?.cart?.checkoutUrl) {
          let checkoutUrl = cartData.cart.checkoutUrl;
          // Append address prefill parameters safely
          try {
            const urlObj = new URL(checkoutUrl);
            if (params.email) urlObj.searchParams.set('checkout[email]', params.email);
            if (params.shippingAddress) {
              const a = params.shippingAddress;
              if (a.firstName) urlObj.searchParams.set('checkout[shipping_address][first_name]', a.firstName);
              if (a.lastName) urlObj.searchParams.set('checkout[shipping_address][last_name]', a.lastName);
              if (a.address1) urlObj.searchParams.set('checkout[shipping_address][address1]', a.address1);
              if (a.address2) urlObj.searchParams.set('checkout[shipping_address][address2]', a.address2);
              if (a.city) urlObj.searchParams.set('checkout[shipping_address][city]', a.city);
              if (a.province) urlObj.searchParams.set('checkout[shipping_address][province]', a.province);
              if (a.country) urlObj.searchParams.set('checkout[shipping_address][country]', a.country);
              if (a.zip) urlObj.searchParams.set('checkout[shipping_address][zip]', a.zip);
              if (a.phone) urlObj.searchParams.set('checkout[shipping_address][phone]', a.phone);
            }
            checkoutUrl = urlObj.toString();
          } catch {
            // keep original checkoutUrl
          }

          return {
            success: true,
            checkoutUrl,
            cartId: cartData.cart.id,
          };
        }
      }
    } catch (gqlErr: any) {
      console.error('[SHOPIFY GQL ERROR]', gqlErr);
    }
  }

  // 3. Fallback: if credentials are missing, provide an actionable and clear message
  return {
    success: false,
    setupRequired: true,
    error:
      'Shopify Storefront API credentials are required to create real checkout sessions. Please configure SHOPIFY_STOREFRONT_ACCESS_TOKEN in Vercel environment variables.',
  };
}

/**
 * Safely navigates the customer's browser to the Shopify checkout URL.
 * Guarantees a normal, top-level full-page navigation in the same tab,
 * breaking out of any iframes, embedded boxes, or webview frames to prevent
 * "refused to connect" X-Frame-Options blocking.
 */
export function navigateToShopifyCheckout(checkoutUrl: string): void {
  if (!checkoutUrl) {
    console.error('Cannot navigate: checkoutUrl is empty');
    return;
  }

  // Ensure top-level navigation to break out of any iframe or embedded frame
  try {
    if (window.top && window.top !== window) {
      window.top.location.href = checkoutUrl;
      return;
    }
  } catch (frameErr) {
    console.warn('[NAVIGATE TOP] Cross-origin frame detected, using fallback window.open(_top)', frameErr);
    try {
      window.open(checkoutUrl, '_top');
      return;
    } catch {
      // ignore
    }
  }

  // Standard top-level navigation in current tab
  window.location.assign(checkoutUrl);
}
