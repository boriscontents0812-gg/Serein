import React, { useEffect, useState } from 'react';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Truck, AlertCircle, Loader2 } from 'lucide-react';

interface OrderConfirmationProps {
  sessionId: string;
  onClose: () => void;
}

interface OrderDetails {
  id: string;
  status: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    image?: string;
  }>;
  currency: string;
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  customer?: {
    email?: string;
    name?: string;
    shippingAddress?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
  paidAt?: string;
  createdAt: string;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationProps> = ({ sessionId, onClose }) => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/order-status?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to retrieve order status');
        }

        if (isMounted) {
          setOrder(data.order);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Unable to load order details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (sessionId) {
      fetchOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmation-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl clay-card rounded-[28px] sm:rounded-[32px] bg-white dark:bg-[#141A1E] border border-border-light dark:border-border-dark shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-ink-light dark:text-ink-dark transition-colors duration-300">
        
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-canvas-light/80 dark:bg-[#182126]">
          <div className="flex items-center space-x-3">
            <span className="font-sans text-xl sm:text-2xl tracking-[0.28em] font-normal text-ink-light dark:text-ink-dark uppercase">
              SEREIN
            </span>
            <span className="text-border-light dark:text-border-dark">|</span>
            <span className="text-[11px] uppercase tracking-wider text-ink-lightMuted dark:text-ink-darkMuted font-medium">
              Order Confirmation
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full text-xs uppercase tracking-wider text-ink-lightMuted dark:text-ink-darkMuted hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 className="w-8 h-8 text-teal animate-spin" />
              <p className="font-sans text-sm uppercase tracking-wider text-ink-light dark:text-ink-dark">
                Verifying payment with Stripe...
              </p>
              <p className="text-xs text-ink-lightMuted dark:text-ink-darkMuted font-light max-w-xs">
                Retrieving your confirmed order and shipping details.
              </p>
            </div>
          ) : error ? (
            <div className="py-12 bg-red-50/50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h3 className="font-sans text-base uppercase tracking-wider text-ink-light dark:text-ink-dark font-medium">
                Unable to load order
              </h3>
              <p className="text-xs text-ink-lightMuted dark:text-ink-darkMuted max-w-md">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 btn-clay-teal text-xs px-6 py-2.5 rounded-full"
              >
                Return to Store
              </button>
            </div>
          ) : order ? (
            <>
              {/* Success Header Banner */}
              <div className="bg-canvas-light/80 dark:bg-[#182126] border border-border-light dark:border-border-dark rounded-2xl p-6 flex items-start space-x-4 shadow-sm">
                <div className="w-11 h-11 rounded-full border border-teal/40 bg-teal/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-teal">
                      Payment Verified · {order.status === 'paid' ? 'Confirmed' : 'Processing'}
                    </span>
                  </div>
                  <h2
                    id="order-confirmation-title"
                    className="font-sans text-2xl sm:text-3xl text-ink-light dark:text-ink-dark font-medium uppercase tracking-heading mt-1"
                  >
                    Thank you for your order
                  </h2>
                  <p className="text-xs text-ink-lightMuted dark:text-ink-darkMuted mt-1 font-light">
                    Order Reference: <strong className="font-mono text-ink-light dark:text-ink-dark font-medium">{order.id}</strong>
                  </p>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="border border-border-light dark:border-border-dark rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 bg-canvas-light dark:bg-[#182126] border-b border-border-light dark:border-border-dark flex justify-between text-[11px] font-semibold tracking-[0.16em] uppercase text-ink-light dark:text-ink-dark">
                  <span>Purchased Item</span>
                  <span>Quantity & Amount</span>
                </div>

                <div className="divide-y divide-border-light/60 dark:divide-border-dark/60 bg-white dark:bg-[#141A1E]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-5 flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4 min-w-0">
                        {item.image && (
                          <div className="w-14 h-14 bg-canvas-light dark:bg-[#1C252B] border border-border-light dark:border-border-dark rounded-xl shrink-0 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-sans text-xs sm:text-sm uppercase tracking-wider text-ink-light dark:text-ink-dark truncate font-medium">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-ink-lightMuted dark:text-ink-darkMuted mt-0.5 font-light">
                            Teal Velvet · 60-inch extra-long set
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs text-ink-lightMuted dark:text-ink-darkMuted font-light block">
                          Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </span>
                        <span className="font-sans text-sm text-ink-light dark:text-ink-dark font-medium tracking-price">
                          ${item.subtotal.toFixed(2)} {order.currency.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Summary */}
                <div className="p-5 bg-canvas-light/80 dark:bg-[#182126] border-t border-border-light dark:border-border-dark space-y-2 text-xs">
                  <div className="flex justify-between text-ink-lightMuted dark:text-ink-darkMuted font-light">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-ink-lightMuted dark:text-ink-darkMuted font-light">
                    <span>Shipping</span>
                    <span className="text-teal font-medium">Complimentary Standard Delivery</span>
                  </div>
                  {order.taxTotal > 0 && (
                    <div className="flex justify-between text-ink-lightMuted dark:text-ink-darkMuted font-light">
                      <span>Tax</span>
                      <span>${order.taxTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border-light/60 dark:border-border-dark/60 flex justify-between items-center text-sm font-medium text-ink-light dark:text-ink-dark">
                    <span className="uppercase tracking-wider">Total Paid</span>
                    <span className="font-sans text-lg tracking-price font-medium text-teal">
                      ${order.total.toFixed(2)} {order.currency.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer & Shipping Summary */}
              {order.customer && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-canvas-light/60 dark:bg-[#182126] border border-border-light dark:border-border-dark rounded-2xl p-5 space-y-1 shadow-sm">
                    <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider text-teal font-semibold mb-2">
                      <Truck className="w-3.5 h-3.5 text-teal" />
                      <span>Shipping Destination</span>
                    </div>
                    {order.customer.name && <p className="font-medium text-ink-light dark:text-ink-dark">{order.customer.name}</p>}
                    {order.customer.shippingAddress && (
                      <p className="text-ink-lightMuted dark:text-ink-darkMuted font-light leading-relaxed">
                        {order.customer.shippingAddress.line1}
                        {order.customer.shippingAddress.line2 ? `, ${order.customer.shippingAddress.line2}` : ''}<br />
                        {order.customer.shippingAddress.city}, {order.customer.shippingAddress.state} {order.customer.shippingAddress.postal_code}<br />
                        {order.customer.shippingAddress.country}
                      </p>
                    )}
                  </div>

                  <div className="bg-canvas-light/60 dark:bg-[#182126] border border-border-light dark:border-border-dark rounded-2xl p-5 space-y-1 shadow-sm">
                    <div className="flex items-center space-x-1.5 text-[10px] uppercase tracking-wider text-teal font-semibold mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal" />
                      <span>Order Confirmation</span>
                    </div>
                    {order.customer.email && (
                      <p className="text-ink-lightMuted dark:text-ink-darkMuted font-light">
                        Receipt updates dispatched to:<br />
                        <strong className="font-medium text-ink-light dark:text-ink-dark">{order.customer.email}</strong>
                      </p>
                    )}
                    <p className="text-[11px] text-ink-lightSubtle dark:text-ink-darkSubtle pt-1">
                      Tracking code will be assigned once fulfilled.
                    </p>
                  </div>
                </div>
              )}

              {/* What Happens Next Card */}
              <div className="bg-canvas-light/80 dark:bg-[#182126] border border-border-light dark:border-border-dark rounded-2xl p-5 space-y-2 shadow-sm">
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider text-ink-light dark:text-ink-dark font-semibold">
                  <Package className="w-3.5 h-3.5 text-teal" />
                  <span>What happens next</span>
                </div>
                <p className="text-xs text-ink-lightMuted dark:text-ink-darkMuted font-light leading-relaxed">
                  Your Serein Heatless Curl Set is being prepared with quiet care in our studio. Once dispatched, you will receive real-time postal tracking updates.
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t border-border-light dark:border-border-dark bg-white dark:bg-[#141A1E] flex justify-end">
          <button
            onClick={onClose}
            className="btn-clay-teal text-xs py-3 px-6 space-x-2 w-full sm:w-auto rounded-full"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
