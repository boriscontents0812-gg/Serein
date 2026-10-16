import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, Lock, ShieldCheck, AlertCircle, Loader2, Info } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    totalCount,
    subtotal,
    isCartOpen,
    closeCart,
    checkoutNotice,
    setCheckoutNotice,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSetupHelpOpen, setIsSetupHelpOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Clear transient error when drawer is closed or items change
  useEffect(() => {
    if (!isCartOpen) {
      setCheckoutError(null);
      setIsSetupHelpOpen(false);
    }
  }, [isCartOpen]);

  // Real Checkout Handler
  const handleProceedToCheckout = async () => {
    if (items.length === 0 || isCheckingOut) return;

    setIsCheckingOut(true);
    setCheckoutError(null);
    setIsSetupHelpOpen(false);

    try {
      // 1. Prepare secure payload containing only product IDs and requested quantities
      const payload = {
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        customerEmail: undefined,
      };

      // 2. Request real Stripe Checkout Session from backend
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.message || 'Unable to initialize checkout. Please try again.';
        setCheckoutError(errorMsg);
        if (data.isConfigError || data.missingKey) {
          setIsSetupHelpOpen(true);
        }
        setIsCheckingOut(false);
        return;
      }

      // 3. Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Checkout URL was not returned by server.');
      }
    } catch (err: any) {
      console.error('[CHECKOUT INITIATION FAILED]', err);
      setCheckoutError(
        err.message || 'A network error occurred while connecting to the checkout service. Please try again.'
      );
      setIsCheckingOut(false);
    }
  };

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Prevent background scrolling when cart drawer is active
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      {/* Slide-out Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-md bg-white dark:bg-[#141A1E] border-l border-border-light dark:border-border-dark h-full flex flex-col justify-between shadow-drawer z-10 animate-drawer-in text-ink-light dark:text-ink-dark transition-colors duration-300"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-teal/10 dark:bg-teal/20 text-teal flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
            </div>
            <h2 className="font-sans text-lg uppercase tracking-wider text-ink-light dark:text-ink-dark font-medium">Your Bag</h2>
            <span className="text-xs text-ink-lightMuted dark:text-ink-darkMuted font-mono">({totalCount})</span>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 rounded-full text-ink-lightMuted dark:text-ink-darkMuted hover:text-ink-light dark:hover:text-ink-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Checkout Return Notice */}
          {checkoutNotice && (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3.5 rounded-2xl flex items-start justify-between text-xs text-amber-900 dark:text-amber-200 animate-fade-in">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="font-light leading-relaxed">{checkoutNotice}</span>
              </div>
              <button
                onClick={() => setCheckoutNotice(null)}
                className="text-amber-700 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-100 p-0.5 ml-2 cursor-pointer"
                aria-label="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {items.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-canvas-light dark:bg-[#1A2227] border border-border-light dark:border-border-dark flex items-center justify-center text-ink-lightSubtle dark:text-ink-darkSubtle shadow-clay-sm">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-base uppercase tracking-wider text-ink-light dark:text-ink-dark font-medium">Your bag is currently empty</h3>
                <p className="text-xs text-ink-lightMuted dark:text-ink-darkMuted font-light max-w-xs leading-relaxed">
                  Bring the quiet luxury of heatless waves to your daily beauty routine.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-4 btn-clay-teal text-xs px-6 py-3 rounded-full"
              >
                Discover The Set
              </button>
            </div>
          ) : (
            /* Populated Cart Items */
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-canvas-light/70 dark:bg-[#182126] border border-border-light dark:border-border-dark p-4 flex space-x-4 relative shadow-sm"
                >
                  <div className="w-20 h-20 overflow-hidden rounded-xl bg-white dark:bg-[#141A1E] shrink-0 border border-border-light dark:border-border-dark">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-sans text-xs uppercase tracking-wider text-ink-light dark:text-ink-dark font-medium leading-tight pr-4">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-ink-lightSubtle dark:text-ink-darkSubtle hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                          title="Remove item"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                        </button>
                      </div>
                      <p className="text-[11px] text-ink-lightMuted dark:text-ink-darkMuted mt-0.5 font-light">
                        {item.color} · {item.length}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border-light/60 dark:border-border-dark/60">
                      {/* Quantity Stepper (Pill) */}
                      <div className="flex items-center rounded-full border border-border-light dark:border-border-dark bg-white dark:bg-[#141A1E] px-2 py-0.5 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-ink-lightMuted dark:text-ink-darkMuted hover:text-ink-light dark:hover:text-ink-dark transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-ink-light dark:text-ink-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-ink-lightMuted dark:text-ink-darkMuted hover:text-ink-light dark:hover:text-ink-dark transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-sans text-sm text-ink-light dark:text-ink-dark font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border-light dark:border-border-dark bg-canvas-light/80 dark:bg-[#0E1316] space-y-4">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-ink-lightMuted dark:text-ink-darkMuted font-light">
                <span className="uppercase tracking-wider">Subtotal</span>
                <span className="text-ink-light dark:text-ink-dark font-sans text-xl font-medium tracking-price">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-ink-lightSubtle dark:text-ink-darkSubtle text-[11px]">
                <span>Complimentary Shipping</span>
                <span className="text-teal font-medium">Included</span>
              </div>
            </div>

            {/* Error Banner */}
            {checkoutError && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-3.5 rounded-2xl text-xs text-red-800 dark:text-red-300 space-y-2 animate-fade-in shadow-sm">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="font-light leading-relaxed">{checkoutError}</p>
                </div>
                {isSetupHelpOpen && (
                  <div className="pt-2 border-t border-red-200/60 dark:border-red-800/60 text-[11px] text-red-700 dark:text-red-300">
                    <p className="font-medium uppercase tracking-wider mb-0.5">Store Setup Action:</p>
                    <p className="font-light">
                      Add a valid <code className="bg-white/80 dark:bg-black/40 px-1 py-0.5 rounded border border-red-200 dark:border-red-800 font-mono">STRIPE_SECRET_KEY</code> to your project's <code className="font-mono">.env</code> file.
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleProceedToCheckout}
              disabled={isCheckingOut || items.length === 0}
              className={`w-full py-3.5 font-medium text-xs tracking-[0.2em] uppercase rounded-full flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                isCheckingOut || items.length === 0
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'btn-clay-teal text-white shadow-clay-btn'
              }`}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  <span>Securing Session...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center space-x-3 text-[10px] text-ink-lightSubtle dark:text-ink-darkSubtle pt-1">
              <span className="flex items-center space-x-1">
                <Lock className="w-3 h-3 text-teal stroke-[1.8]" />
                <span>Encrypted 256-bit checkout</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-teal stroke-[1.8]" />
                <span>Satisfaction Guarantee</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
