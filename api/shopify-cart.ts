import type { VercelRequest, VercelResponse } from '@vercel/node';

// Shopify Storefront API GraphQL mutation to create cart and obtain checkoutUrl
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
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                }
              }
            }
          }
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

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const domain = (process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN || 'f0jzb7-r0.myshopify.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  const token = (process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '').trim();
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-07';
  const defaultVariantId = process.env.SHOPIFY_VARIANT_ID || process.env.VITE_SHOPIFY_VARIANT_ID || '51592955855122';

  // GET: Health check & configuration status
  if (req.method === 'GET') {
    res.status(200).json({
      storeDomain: domain,
      variantId: defaultVariantId,
      isConfigured: Boolean(token),
      hasToken: Boolean(token),
      apiVersion
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { items, email, shippingAddress } = body;

    // If token is not yet configured, provide seamless direct checkout URL so checkout never fails
    if (!token) {
      const itemsString = (Array.isArray(items) && items.length > 0 ? items : [{ variantId: defaultVariantId, quantity: 1 }])
        .map((item: any) => `${String(item.variantId || defaultVariantId).replace('gid://shopify/ProductVariant/', '')}:${Math.max(1, parseInt(String(item.quantity || 1), 10))}`)
        .join(',');

      const fallbackUrl = new URL(`https://${domain}/cart/${itemsString}`);
      if (email) fallbackUrl.searchParams.set('checkout[email]', email.trim());
      if (shippingAddress) {
        if (shippingAddress.firstName) fallbackUrl.searchParams.set('checkout[shipping_address][first_name]', shippingAddress.firstName);
        if (shippingAddress.lastName) fallbackUrl.searchParams.set('checkout[shipping_address][last_name]', shippingAddress.lastName);
        if (shippingAddress.address1) fallbackUrl.searchParams.set('checkout[shipping_address][address1]', shippingAddress.address1);
        if (shippingAddress.address2) fallbackUrl.searchParams.set('checkout[shipping_address][address2]', shippingAddress.address2);
        if (shippingAddress.city) fallbackUrl.searchParams.set('checkout[shipping_address][city]', shippingAddress.city);
        if (shippingAddress.province) fallbackUrl.searchParams.set('checkout[shipping_address][province]', shippingAddress.province);
        if (shippingAddress.country) fallbackUrl.searchParams.set('checkout[shipping_address][country]', shippingAddress.country);
        if (shippingAddress.zip) fallbackUrl.searchParams.set('checkout[shipping_address][zip]', shippingAddress.zip);
        if (shippingAddress.phone) fallbackUrl.searchParams.set('checkout[shipping_address][phone]', shippingAddress.phone);
      }

      res.status(200).json({
        success: true,
        checkoutUrl: fallbackUrl.toString(),
        isDirectCart: true
      });
      return;
    }

    // Format items into Shopify lines
    const lineItems = (Array.isArray(items) && items.length > 0 ? items : [{ variantId: defaultVariantId, quantity: 1 }])
      .map((item: any) => {
        const rawId = String(item.variantId || defaultVariantId).trim();
        const merchandiseId = rawId.startsWith('gid://')
          ? rawId
          : `gid://shopify/ProductVariant/${rawId}`;
        return {
          merchandiseId,
          quantity: Math.max(1, parseInt(String(item.quantity || 1), 10))
        };
      });

    // Build CartInput
    const cartInput: any = {
      lines: lineItems
    };

    if (email && typeof email === 'string' && email.includes('@')) {
      cartInput.buyerIdentity = {
        email: email.trim()
      };
    }

    // Execute Storefront GraphQL mutation
    const graphqlUrl = `https://${domain}/api/${apiVersion}/graphql.json`;
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token
      },
      body: JSON.stringify({
        query: CART_CREATE_MUTATION,
        variables: { input: cartInput }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(500).json({
        success: false,
        error: `Shopify Storefront API error (${response.status}): ${errText || response.statusText}`
      });
      return;
    }

    const result = await response.json();

    if (result.errors && result.errors.length > 0) {
      res.status(400).json({
        success: false,
        error: result.errors[0]?.message || 'Shopify GraphQL error',
        errors: result.errors
      });
      return;
    }

    const cartData = result.data?.cartCreate;
    const userErrors = cartData?.userErrors || [];

    if (userErrors.length > 0) {
      res.status(400).json({
        success: false,
        error: userErrors[0]?.message || 'Failed to create Shopify cart',
        userErrors
      });
      return;
    }

    let checkoutUrl = cartData?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      res.status(500).json({
        success: false,
        error: 'Shopify did not return a valid checkout URL for this cart.'
      });
      return;
    }

    // Safely append customer address prefill params if provided
    try {
      const parsedUrl = new URL(checkoutUrl);
      if (email) {
        parsedUrl.searchParams.set('checkout[email]', email.trim());
      }
      if (shippingAddress) {
        if (shippingAddress.firstName) parsedUrl.searchParams.set('checkout[shipping_address][first_name]', shippingAddress.firstName);
        if (shippingAddress.lastName) parsedUrl.searchParams.set('checkout[shipping_address][last_name]', shippingAddress.lastName);
        if (shippingAddress.address1) parsedUrl.searchParams.set('checkout[shipping_address][address1]', shippingAddress.address1);
        if (shippingAddress.address2) parsedUrl.searchParams.set('checkout[shipping_address][address2]', shippingAddress.address2);
        if (shippingAddress.city) parsedUrl.searchParams.set('checkout[shipping_address][city]', shippingAddress.city);
        if (shippingAddress.province) parsedUrl.searchParams.set('checkout[shipping_address][province]', shippingAddress.province);
        if (shippingAddress.country) parsedUrl.searchParams.set('checkout[shipping_address][country]', shippingAddress.country);
        if (shippingAddress.zip) parsedUrl.searchParams.set('checkout[shipping_address][zip]', shippingAddress.zip);
        if (shippingAddress.phone) parsedUrl.searchParams.set('checkout[shipping_address][phone]', shippingAddress.phone);
      }
      checkoutUrl = parsedUrl.toString();
    } catch {
      // Keep original checkoutUrl if URL parsing fails
    }

    res.status(200).json({
      success: true,
      checkoutUrl,
      cartId: cartData?.cart?.id,
      cost: cartData?.cart?.cost,
      lines: cartData?.cart?.lines?.edges?.map((e: any) => e.node)
    });
  } catch (error: any) {
    console.error('[SHOPIFY CART API ERROR]:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error while creating Shopify cart'
    });
  }
}
