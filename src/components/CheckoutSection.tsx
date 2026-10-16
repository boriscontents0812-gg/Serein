import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { productData } from '../data/product';
import { ArrowLeft, Lock, ShieldCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface CheckoutSectionProps {
  onSuccessOrder?: (sessionId: string) => void;
}

export const CheckoutSection: React.FC<CheckoutSectionProps> = ({ onSuccessOrder }) => {
  const { items, subtotal, retailPrice, addItem, closeCheckout, clearCart } = useCart();

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
  const [isSetupHelpOpen, setIsSetupHelpOpen] = useState(false);

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
    setIsSetupHelpOpen(false);

    try {
      // If cart was empty, add the default item first
      if (items.length === 0) {
        addItem(1);
      }

      const payload = {
        items: effectiveItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        customerEmail: email,
        customerName: `${firstName} ${lastName}`.trim(),
        shippingAddress: {
          line1: address,
          line2: apartment || undefined,
          city,
          state,
          postal_code: postalCode,
          country,
        },
      };

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch {
          data = null;
        }
      }

      if (!data) {
        if (response.status === 404) {
          setErrorMessage(
            'The checkout endpoint (/api/create-checkout-session) could not be reached. Ensure backend or serverless functions are deployed.'
          );
        } else {
          setErrorMessage('Unable to connect to the checkout service. Please try again.');
        }
        setIsSetupHelpOpen(true);
        setIsProcessing(false);
        return;
      }

      if (!response.ok || data.error || !data.url) {
        const err = data.error || data.message || 'Unable to initialize checkout. Please check configuration.';
        setErrorMessage(err);

        if (
          data.isSetupRequired ||
          data.code === 'STRIPE_NOT_CONFIGURED' ||
          data.code === 'PRICE_NOT_CONFIGURED'
        ) {
          setIsSetupHelpOpen(true);
        }
        setIsProcessing(false);
        return;
      }

      // Redirect to real Stripe Checkout Session
      window.location.href = data.url;
    } catch (err: any) {
      console.error('[CHECKOUT FORM ERROR]', err);
      setErrorMessage('A network error occurred while connecting to the payment service.');
      setIsSetupHelpOpen(true);
      setIsProcessing(false);
    }
  };

  // Test simulation completion when Stripe secret key has not been added
  const handleSimulateTestOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      const mockSessionId = `test_sess_${Date.now()}`;
      if (onSuccessOrder) {
        onSuccessOrder(mockSessionId);
      } else {
        window.location.href = `/?success=true&session_id=${mockSessionId}`;
      }
    }, 800);
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

          <span className="font-sans font-bold text-base sm:text-lg tracking-[0.25em] uppercase text-white">
            SEREIN
          </span>
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
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Secure checkout powered by Stripe. Charged directly in USD.
              </p>
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

              {/* Error & Store Setup Alert */}
              {errorMessage && (
                <div className="bg-red-950/40 border border-red-900/60 p-4 rounded-2xl text-xs text-red-300 space-y-3 animate-fade-in shadow-sm">
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="font-light leading-relaxed">{errorMessage}</p>
                  </div>

                  {isSetupHelpOpen && (
                    <div className="pt-3 border-t border-red-900/40 space-y-3">
                      <div>
                        <p className="font-semibold uppercase tracking-wider text-[11px] mb-1">
                          Live Stripe Setup:
                        </p>
                        <p className="font-light text-[11px] leading-relaxed">
                          Add your valid <code className="bg-black/50 px-1 py-0.5 rounded border border-red-800 font-mono">STRIPE_SECRET_KEY</code> to your environment or Vercel dashboard.
                        </p>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={handleSimulateTestOrder}
                          className="w-full py-2.5 px-4 bg-emerald-950/60 border border-emerald-700/60 hover:bg-emerald-900/60 text-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Simulate Test Order Success (Demo Mode)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Pay Button matching video */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-full btn-amber text-black font-bold text-xs sm:text-sm tracking-[0.2em] uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                    <span>Connecting to Stripe...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-black stroke-[2.2]" />
                    <span>Pay ${effectiveTotal.toFixed(2)}</span>
                  </>
                )}
              </button>

              {/* Trust assurances */}
              <div className="flex items-center justify-center space-x-4 text-[11px] text-neutral-500 pt-1">
                <span className="flex items-center space-x-1.5">
                  <Lock className="w-3 h-3 text-[#EAA858]" />
                  <span>256-Bit Encrypted</span>
                </span>
                <span>·</span>
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3 h-3 text-[#25B6A7]" />
                  <span>30-Day Guarantee</span>
                </span>
                <span>·</span>
                <span>Complimentary Delivery</span>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary Card (matching getbreeze.live 1:1) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-[#121518] border border-[#1E2529] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              <h2 className="font-sans text-base sm:text-lg font-bold text-white tracking-wide">
                Order summary
              </h2>

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
                Prices are in USD and your card is charged in USD — no currency conversion is applied by us.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
