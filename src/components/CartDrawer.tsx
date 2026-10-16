import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, Lock, ShieldCheck, AlertCircle, Info } from 'lucide-react';

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
    openCheckout,
  } = useCart();

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

  // Transition to dedicated Checkout Section
  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    closeCart();
    openCheckout();
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
        className="relative w-full max-w-md bg-[#101316] border-l border-[#1E2529] h-full flex flex-col justify-between shadow-2xl z-10 animate-drawer-in text-white transition-colors duration-300"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#1E2529] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#181D21] text-[#EAA858] flex items-center justify-center border border-[#252E34]">
              <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
            </div>
            <h2 className="font-sans text-lg uppercase tracking-wider text-white font-bold">Your Bag</h2>
            <span className="text-xs text-neutral-400 font-mono">({totalCount})</span>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Checkout Return Notice */}
          {checkoutNotice && (
            <div className="bg-[#181D21] border border-[#EAA858]/40 p-3.5 rounded-2xl flex items-start justify-between text-xs text-neutral-200 animate-fade-in">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-[#EAA858] shrink-0 mt-0.5" />
                <span className="font-normal leading-relaxed">{checkoutNotice}</span>
              </div>
              <button
                onClick={() => setCheckoutNotice(null)}
                className="text-neutral-400 hover:text-white p-0.5 ml-2 cursor-pointer"
                aria-label="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {items.length === 0 ? (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#181D21] border border-[#252E34] flex items-center justify-center text-neutral-500 shadow-lg">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-base uppercase tracking-wider text-white font-bold">Your bag is empty</h3>
                <p className="text-xs text-neutral-400 font-normal max-w-xs leading-relaxed">
                  Bring the quiet luxury of heatless waves to your daily beauty routine.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-4 btn-amber text-xs px-6 py-3 rounded-full font-bold uppercase tracking-wider"
              >
                Explore The Set
              </button>
            </div>
          ) : (
            /* Populated Cart Items */
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#14181B] border border-[#1E2529] p-4 flex space-x-4 relative shadow-sm"
                >
                  <div className="w-20 h-20 overflow-hidden rounded-xl bg-[#0E1114] shrink-0 border border-white/5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-sans text-xs uppercase tracking-wider text-white font-bold leading-tight pr-4">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-500 hover:text-red-400 p-0.5 transition-colors cursor-pointer"
                          title="Remove item"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 font-normal">
                        {item.color} · {item.length}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                      {/* Quantity Stepper (Pill) */}
                      <div className="flex items-center rounded-full border border-[#252E34] bg-[#181D21] px-2 py-0.5 shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-sans text-sm text-white font-bold">
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
          <div className="p-6 border-t border-[#1E2529] bg-[#0E1114] space-y-4">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span className="uppercase tracking-wider">Subtotal</span>
                <span className="text-white font-sans text-2xl font-bold tracking-tight">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500 text-[11px]">
                <span>Complimentary Shipping</span>
                <span className="text-[#25B6A7] font-semibold">Included</span>
              </div>
            </div>

            {/* Error Banner */}
            {checkoutError && (
              <div className="bg-red-950/40 border border-red-900/60 p-3.5 rounded-2xl text-xs text-red-300 space-y-2 animate-fade-in shadow-sm">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="font-light leading-relaxed">{checkoutError}</p>
                </div>
                {isSetupHelpOpen && (
                  <div className="pt-2 border-t border-red-800/60 text-[11px] text-red-300">
                    <p className="font-semibold uppercase tracking-wider mb-0.5">Store Setup Action:</p>
                    <p className="font-light">
                      Add a valid <code className="bg-black/50 px-1 py-0.5 rounded border border-red-800 font-mono">STRIPE_SECRET_KEY</code> to your project's <code className="font-mono">.env</code> file.
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleProceedToCheckout}
              disabled={items.length === 0}
              className={`w-full py-3.5 font-bold text-xs tracking-[0.2em] uppercase rounded-full flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                items.length === 0
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'btn-amber shadow-lg shadow-amber-500/10'
              }`}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <div className="flex items-center justify-center space-x-3 text-[10px] text-neutral-500 pt-1">
              <span className="flex items-center space-x-1">
                <Lock className="w-3 h-3 text-[#EAA858] stroke-[1.8]" />
                <span>Encrypted 256-bit checkout</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-[#25B6A7] stroke-[1.8]" />
                <span>30-Day Guarantee</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
