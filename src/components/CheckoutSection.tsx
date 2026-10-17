import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { productData } from '../data/product';
import { getShopifyConfig, saveShopifyConfig, ShopifyConfig } from '../data/shopifyConfig';
import { createShopifyCheckoutSession, navigateToShopifyCheckout } from '../data/shopifyStorefront';
import { ArrowLeft, Lock, ShieldCheck, CheckCircle2, Settings2, X, Store, AlertCircle } from 'lucide-react';

interface CheckoutSectionProps {
  onSuccessOrder?: (sessionId: string) => void;
}

export const CheckoutSection: React.FC<CheckoutSectionProps> = ({ onSuccessOrder }) => {
  const { items, subtotal, retailPrice, addItem, closeCheckout, clearCart } = useCart();

  // Shopify store configuration state
  const [shopifyConfig, setShopifyConfigState] = useState<ShopifyConfig>(getShopifyConfig);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [tempDomain, setTempDomain] = useState(shopifyConfig.storeDomain);
  const [tempVariantId, setTempVariantId] = useState(shopifyConfig.variantId);
  const [tempToken, setTempToken] = useState(shopifyConfig.storefrontAccessToken || '');
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  // Form states matching video
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('United States');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If cart is empty, use 1 default product item for display & purchase
  const effectiveItems = items.length > 0 ? items : [
    {
      id: 'serein-curl-set-teal',
      title: productData.name,
      subtitle: productData.lengthSpecification,
      color: productData.availableColor.name,
      length: '60-inch',
      price: retailPrice,
      quantity: 1,
      image: productData.images[0].src
    }
  ];

  const effectiveTotal = items.length > 0 ? subtotal : retailPrice;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: ShopifyConfig = {
      storeDomain: tempDomain.trim().replace(/^https?:\/\//, '').replace(/\/$/, ''),
      variantId: tempVariantId.trim(),
      storefrontAccessToken: tempToken.trim(),
    };
    saveShopifyConfig(newConfig);
    setShopifyConfigState(newConfig);
    setConfigSavedNotice(true);
    setTimeout(() => {
      setConfigSavedNotice(false);
      setIsConfigModalOpen(false);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!firstName || !lastName || !address || !city || !postalCode) {
      setErrorMessage('Please complete all required shipping address fields.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (items.length === 0) {
        addItem(1);
      }

      // Create official Shopify cart via Storefront API to get real checkoutUrl
      const result = await createShopifyCheckoutSession({
        items: effectiveItems.map((item) => ({
          variantId: shopifyConfig.variantId || '51592955855122',
          quantity: item.quantity,
        })),
        email,
        shippingAddress: {
          firstName,
          lastName,
          address1: address,
          address2: apartment,
          city,
          province: state,
          country,
          zip: postalCode,
          phone,
        },
      });

      if (result.success && result.checkoutUrl) {
        // Clear local cart now that the official checkout session is created
        clearCart();

        // Perform full-page top-level navigation in the same tab,
        // breaking out of any iframes or embedded boxes
        navigateToShopifyCheckout(result.checkoutUrl);
        return;
      }

      // If Shopify Storefront API returned an error or configuration requirement:
      setErrorMessage(
        result.error ||
          'Failed to create Shopify checkout session. Please check your Shopify Storefront API configuration in Vercel.'
      );
      setIsProcessing(false);
    } catch (err: any) {
      console.error('[SHOPIFY CHECKOUT ERROR]', err);
      setErrorMessage(err.message || 'An unexpected error occurred while connecting to Shopify checkout.');
      setIsProcessing(false);
    }
  };

  // Test simulation completion for local testing without redirecting
  const handleSimulateTestOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      const mockSessionId = `shopify_ord_${Date.now()}`;
      if (onSuccessOrder) {
        onSuccessOrder(mockSessionId);
      } else {
        window.location.href = `/?success=true&session_id=${mockSessionId}`;
      }
    }, 600);
  };

  return (
    <div id="checkout" className="min-h-screen bg-[#0A0B0E] text-white flex flex-col font-sans transition-colors duration-300">
      {/* Top Header Bar matching video: "← Back to store" on left, "SEREIN" logo on right */}
      <header className="w-full border-b border-white/5 bg-[#0E1114]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <button
            onClick={closeCheckout}
            type="button"
            className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to store</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsConfigModalOpen(true)}
              type="button"
              className="flex items-center space-x-1.5 text-[11px] text-neutral-400 hover:text-[#25B6A7] transition-colors px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#25B6A7]/40 cursor-pointer"
              title="Configure Shopify store domain & product variant ID"
            >
              <Store className="w-3.5 h-3.5 text-[#25B6A7]" />
              <span className="hidden sm:inline font-mono text-[10px]">
                {shopifyConfig.storeDomain}
              </span>
              <Settings2 className="w-3 h-3 text-neutral-400" />
            </button>

            <span className="font-sans font-bold text-base sm:text-lg tracking-[0.25em] uppercase text-white">
              SEREIN
            </span>
          </div>
        </div>
      </header>

      {/* Main Two-Column Checkout Layout */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-5 sm:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Checkout Form (matching getbreeze.live 1:1) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight mb-2">
                Checkout
              </h1>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-neutral-400">
                <span>Direct Shopify Checkout. Charged in USD.</span>
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(true)}
                  className="text-[#25B6A7] hover:underline flex items-center space-x-1 cursor-pointer font-medium"
                >
                  <span>Edit Shopify Store</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Section */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Contact
                </h2>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-normal">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#121518] border border-[#1E2529] focus:border-[#EAA858] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Shipping address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5 font-normal">
                      First name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#121518] border border-[#1E2529] focus:border-[#EAA858] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5 font-normal">
                      Last name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#121518] border border-[#1E2529] focus:border-[#EAA858] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-normal">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#121518] border border-[#1E2529] focus:border-[#EAA858] rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors cursor-pointer appearance-none"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-normal">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#121518] border border-[#1E2529] focus:border-[#EAA858] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-normal">
                    Apartment, suite (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, unit (optional)"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full bg-[#121518] border border-[#1E2529] focus:border-[#EAA858] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5 font-normal">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#121518] border border-[#1E2529] focus:border-[#EAA858] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5 font-normal">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="State or Province"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#121518] border border-[#1E2529] focus:border-[#EAA858] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-normal">
                    Postal code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ZIP / Postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#121518] border border-[#1E2529] focus:border-[#EAA858] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-normal">
                    Phone
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-[#1E2529] focus-within:border-[#EAA858] transition-colors bg-[#121518]">
                    <span className="px-4 py-3 bg-[#181D21] text-xs text-neutral-400 border-r border-[#1E2529] flex items-center font-mono">
                      +1
                    </span>
                    <input
                      type="tel"
                      placeholder="931234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-red-950/50 border border-red-800/80 p-4 rounded-2xl text-xs text-red-200 space-y-2 animate-fade-in shadow-md">
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-white">Checkout Notice</p>
                      <p className="font-light leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Pay Button with Shopify */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-full btn-amber text-black font-bold text-xs sm:text-sm tracking-[0.2em] uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>CREATING SHOPIFY CHECKOUT...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-black stroke-[2.2]" />
                    <span>Pay ${effectiveTotal.toFixed(2)} with Shopify</span>
                  </>
                )}
              </button>

              {/* Demo Mode trigger */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSimulateTestOrder}
                  className="text-[11px] text-neutral-400 hover:text-white transition-colors underline cursor-pointer"
                >
                  Preview Order Confirmation Screen (Demo)
                </button>
              </div>

              {/* Trust assurances */}
              <div className="flex items-center justify-center space-x-4 text-[11px] text-neutral-500 pt-1">
                <span className="flex items-center space-x-1.5">
                  <Lock className="w-3 h-3 text-[#EAA858]" />
                  <span>Shopify Secure Checkout</span>
                </span>
                <span>·</span>
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#25B6A7]" />
                  <span>Shop Pay & Cards</span>
                </span>
                <span>·</span>
                <span>Complimentary Delivery</span>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary Card (matching getbreeze.live 1:1) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-[#121518] border border-[#1E2529] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-sans text-base sm:text-lg font-bold text-white tracking-wide">
                  Order summary
                </h2>
                <span className="text-[11px] font-mono text-[#25B6A7] bg-[#25B6A7]/10 px-2 py-0.5 rounded-full border border-[#25B6A7]/20">
                  Shopify Checkout
                </span>
              </div>

              {/* Product item display */}
              <div className="space-y-4">
                {effectiveItems.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[#181D21] border border-[#252E34] shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EAA858] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-white truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-400 font-normal mt-0.5">
                        {item.color} / {item.length} · Qty {item.quantity}
                      </p>
                    </div>

                    <div className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotals */}
              <div className="border-t border-white/5 pt-4 space-y-2.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${effectiveTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#25B6A7] font-semibold">Free</span>
                </div>
              </div>

              {/* Total Display matching video */}
              <div className="border-t border-white/5 pt-4 flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Total
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-medium text-white">
                  ${effectiveTotal.toFixed(2)}
                </span>
              </div>

              {/* Microcopy disclaimer */}
              <p className="text-[11px] text-neutral-500 font-light leading-relaxed pt-2 border-t border-white/5">
                Prices are in USD and your order is processed securely through Shopify Checkout.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Shopify Connection Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-[#121518] border border-[#1E2529] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white relative">
            <button
              onClick={() => setIsConfigModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-[#25B6A7] text-xs font-semibold uppercase tracking-wider">
                <Store className="w-4 h-4" />
                <span>Shopify Integration</span>
              </div>
              <h3 className="font-sans text-xl font-bold text-white">
                Connect Your Shopify Store
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Enter your Shopify store domain and product variant ID to route checkouts directly to your Shopify checkout.
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-300 font-semibold mb-1">
                  Shopify Store Domain
                </label>
                <input
                  type="text"
                  required
                  placeholder="your-store.myshopify.com (or custom domain)"
                  value={tempDomain}
                  onChange={(e) => setTempDomain(e.target.value)}
                  className="w-full bg-[#181D21] border border-[#252E34] focus:border-[#25B6A7] rounded-xl px-4 py-3 text-xs text-white outline-none font-mono"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Example: <code className="text-neutral-400">serein.myshopify.com</code> or your live shop domain.
                </p>
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-semibold mb-1">
                  Product Variant ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 44812345678901"
                  value={tempVariantId}
                  onChange={(e) => setTempVariantId(e.target.value)}
                  className="w-full bg-[#181D21] border border-[#252E34] focus:border-[#25B6A7] rounded-xl px-4 py-3 text-xs text-white outline-none font-mono"
                />
                <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-neutral-400 space-y-1">
                  <p className="font-semibold text-neutral-300">How to find your Variant ID in Shopify:</p>
                  <p>1. Open your <strong>Shopify Admin</strong> → <strong>Products</strong>.</p>
                  <p>2. Click on <strong>The Serein Heatless Curl Set</strong>.</p>
                  <p>3. In the URL bar or variant list, copy the 14-digit number at the end.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-semibold mb-1">
                  Storefront API Access Token (Public)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 32-character public Storefront Access Token"
                  value={tempToken}
                  onChange={(e) => setTempToken(e.target.value)}
                  className="w-full bg-[#181D21] border border-[#252E34] focus:border-[#25B6A7] rounded-xl px-4 py-3 text-xs text-white outline-none font-mono"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Optional in browser if already set as <code className="text-neutral-400">SHOPIFY_STOREFRONT_ACCESS_TOKEN</code> in Vercel.
                </p>
              </div>

              {configSavedNotice && (
                <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Shopify store settings saved successfully!</span>
                </div>
              )}

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#25B6A7] hover:bg-[#39CBBB] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Save Connection
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-5 py-3 bg-[#181D21] hover:bg-[#20272B] text-neutral-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
