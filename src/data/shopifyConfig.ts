/// <reference types="vite/client" />

export interface ShopifyConfig {
  storeDomain: string;
  variantId: string;
}

const STORAGE_KEY = 'serein_shopify_config';

// Default configuration with fallbacks
export const DEFAULT_SHOPIFY_CONFIG: ShopifyConfig = {
  storeDomain: ((import.meta as any).env?.VITE_SHOPIFY_STORE_DOMAIN || 'f0jzb7-r0.myshopify.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, ''),
  variantId: (import.meta as any).env?.VITE_SHOPIFY_VARIANT_ID || '51592955855122',
};

export function getShopifyConfig(): ShopifyConfig {
  if (typeof window === 'undefined') return DEFAULT_SHOPIFY_CONFIG;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        storeDomain: (parsed.storeDomain || DEFAULT_SHOPIFY_CONFIG.storeDomain)
          .replace(/^https?:\/\//, '')
          .replace(/\/$/, ''),
        variantId: parsed.variantId || DEFAULT_SHOPIFY_CONFIG.variantId,
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SHOPIFY_CONFIG;
}

export function saveShopifyConfig(config: ShopifyConfig): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = {
      storeDomain: config.storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      variantId: config.variantId.trim(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch (e) {
    console.error('Failed to save shopify config to localStorage:', e);
  }
}

export function buildShopifyCheckoutUrl(params: {
  storeDomain: string;
  items: Array<{ variantId?: string; quantity: number }>;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  apartment?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
}): string {
  const domain = (params.storeDomain || DEFAULT_SHOPIFY_CONFIG.storeDomain)
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  const itemsString = params.items
    .map((item) => `${item.variantId || DEFAULT_SHOPIFY_CONFIG.variantId}:${item.quantity}`)
    .join(',');

  const checkoutUrl = new URL(`https://${domain}/cart/${itemsString}`);

  // Prefill customer email
  if (params.email) {
    checkoutUrl.searchParams.set('checkout[email]', params.email);
  }

  // Prefill customer shipping address
  if (params.firstName) {
    checkoutUrl.searchParams.set('checkout[shipping_address][first_name]', params.firstName);
  }
  if (params.lastName) {
    checkoutUrl.searchParams.set('checkout[shipping_address][last_name]', params.lastName);
  }
  if (params.address) {
    checkoutUrl.searchParams.set('checkout[shipping_address][address1]', params.address);
  }
  if (params.apartment) {
    checkoutUrl.searchParams.set('checkout[shipping_address][address2]', params.apartment);
  }
  if (params.city) {
    checkoutUrl.searchParams.set('checkout[shipping_address][city]', params.city);
  }
  if (params.province) {
    checkoutUrl.searchParams.set('checkout[shipping_address][province]', params.province);
  }
  if (params.country) {
    checkoutUrl.searchParams.set('checkout[shipping_address][country]', params.country);
  }
  if (params.postalCode) {
    checkoutUrl.searchParams.set('checkout[shipping_address][zip]', params.postalCode);
  }
  if (params.phone) {
    checkoutUrl.searchParams.set('checkout[shipping_address][phone]', params.phone);
  }

  return checkoutUrl.toString();
}
