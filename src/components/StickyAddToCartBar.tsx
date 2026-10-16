import React, { useState, useEffect } from 'react';
import { productData } from '../data/product';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

export const StickyAddToCartBar: React.FC = () => {
  const { addItem, retailPrice } = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 600px
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:right-6 z-30 animate-fade-in">
      <div className="clay-card rounded-full p-2 sm:px-5 sm:py-2.5 shadow-clay-hover flex items-center space-x-4 max-w-md bg-white/95 dark:bg-[#141A1E]/95 backdrop-blur-md border border-border-light dark:border-border-dark transition-colors duration-300">
        
        {/* Product Tiny Thumbnail (Circle) */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-canvas-light dark:bg-[#1C252B] border border-border-light dark:border-border-dark shrink-0 hidden sm:block shadow-sm">
          <img
            src={productData.images[0].src}
            alt={productData.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 pr-2 min-w-0">
          <p className="font-sans text-xs uppercase tracking-wider text-ink-light dark:text-ink-dark truncate font-medium">
            {productData.name}
          </p>
          <div className="flex items-center space-x-2 text-xs mt-0.5">
            <span className="text-teal font-medium text-xs">
              ${retailPrice.toFixed(2)}
            </span>
            <span className="text-ink-lightMuted dark:text-ink-darkMuted font-light text-[11px]">· Teal Velvet</span>
          </div>
        </div>

        {/* CTA (Tactile Pill) */}
        <button
          onClick={() => addItem(1)}
          className="btn-clay-teal text-xs py-2.5 px-4 sm:px-5 flex items-center space-x-1.5 shrink-0 rounded-full"
        >
          <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
          <span>Add to Bag</span>
        </button>

      </div>
    </div>
  );
};
