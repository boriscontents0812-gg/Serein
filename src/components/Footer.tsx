import React, { useState } from 'react';
import { productData } from '../data/product';
import { ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [modalPolicy, setModalPolicy] = useState<{ title: string; content: string } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setEmail('');
  };

  const policyContent: Record<string, string> = {
    Shipping: "Standard order processing takes 1-2 business days. Tracking details are automatically emailed upon dispatch. Complimentary standard shipping applies on all sets.",
    Returns: "For hygiene and wellness reasons, heatless curling sets that have been unsealed or used cannot be returned. Unopened items in original sealed condition are eligible for return within 14 days of delivery.",
    Privacy: "Your personal data is treated with utmost discretion. We do not sell or trade your details. Information collected is used strictly for fulfilling your order and dispatching store updates if opted in.",
    Terms: "By using our site and purchasing The Serein Heatless Curl Set, you agree to our standard consumer terms. All trademarks and aesthetic content are property of Serein Beauty.",
    Contact: "We are here to help. Reach our concierge support team at concierge@sereinbeauty.com (Monday through Friday, 9am - 5pm EST)."
  };

  return (
    <footer className="w-full bg-[#07080A] text-white border-t border-white/5 pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-white/5">
          
          {/* Brand info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-sans text-2xl sm:text-3xl tracking-[0.25em] font-bold text-white block uppercase">
              {productData.brandName}
            </span>
            <p className="text-sm text-neutral-400 font-normal max-w-sm leading-relaxed">
              {productData.brandTagline}
            </p>
            <div className="pt-2 flex items-center space-x-2 text-[11px] text-neutral-500 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#EAA858] stroke-[1.8]" />
              <span>Quiet luxury design · Extra-long 60" Edition</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-300 block">
              Customer Care
            </span>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-normal">
              {['Contact', 'Shipping', 'Returns', 'Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => setModalPolicy({ title: item, content: policyContent[item] })}
                    className="hover:text-white transition-colors tracking-wide text-left cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#EAA858]" />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white">
                The Serein Dispatch
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-normal leading-relaxed">
              Receive quiet notes on heat-free hair care, evening rituals, and product releases.
            </p>

            {isSubscribed ? (
              <div className="bg-[#121518] border border-[#25B6A7]/40 text-[#25B6A7] p-3.5 rounded-2xl flex items-center space-x-2.5 text-xs animate-fade-in shadow-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you for joining our community. We'll be in touch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex items-center rounded-full bg-[#121518] border border-[#1E2529] p-1.5 focus-within:border-[#EAA858] transition-all">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="flex-1 bg-transparent px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none uppercase tracking-wider"
                  />
                  <button
                    type="submit"
                    className="btn-amber w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:scale-105"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
                <span className="text-[10px] text-neutral-500 block pl-2">
                  Unsubscribe anytime. We respect your digital tranquility.
                </span>
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Serein Beauty. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Crafted with quiet intention</span>
            <span>·</span>
            <span className="text-[#25B6A7] font-medium uppercase tracking-wider">Teal Velvet Edition</span>
          </div>
        </div>

      </div>

      {/* Policy Details Lightbox Modal */}
      {modalPolicy && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setModalPolicy(null)}
        >
          <div
            className="clay-card rounded-[28px] p-6 sm:p-8 text-left max-w-md w-full relative bg-white dark:bg-[#141A1E] border border-border-light dark:border-border-dark shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-border-dark mb-4">
              <h3 className="font-sans text-lg uppercase tracking-tight text-ink-light dark:text-ink-dark font-medium">{modalPolicy.title} Information</h3>
              <button
                onClick={() => setModalPolicy(null)}
                className="px-3 py-1 rounded-full text-xs uppercase tracking-wider text-ink-lightMuted dark:text-ink-darkMuted hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                Close
              </button>
            </div>
            <p className="text-xs sm:text-sm text-ink-lightMuted dark:text-ink-darkMuted font-light leading-relaxed">
              {modalPolicy.content}
            </p>
          </div>
        </div>
      )}
    </footer>
  );
};
