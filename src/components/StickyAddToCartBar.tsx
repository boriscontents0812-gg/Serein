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
      <div className="rounded-full p-2 sm:px-5 sm:py-2.5 shadow-2xl flex items-center space-x-4 max-w-md bg-[#121518]/95 backdrop-blur-md border border-[#21272D] text-white transition-all">
        
        {/* Product Tiny Thumbnail (Circle) */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#181D21] border border-[#252E34] shrink-0 hidden sm:block shadow-sm">
          <img
            src={productData.images[0].src}
            alt={productData.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 pr-2 min-w-0">
          <p className="font-sans text-xs uppercase tracking-wider text-white truncate font-bold">
            {productData.name}
          </p>
          <div className="flex items-center space-x-2 text-xs mt-0.5">
            <span className="text-white font-bold text-xs">
              ${retailPrice.toFixed(2)}
            </span>
            <span className="text-neutral-500 font-normal line-through text-[11px]">$75.00</span>
            <span className="text-neutral-400 font-normal text-[11px]">· Teal</span>
          </div>
        </div>

        {/* CTA (Amber Pill Button) */}
        <button
          onClick={() => addItem(1)}
          className="btn-amber text-xs py-2.5 px-5 flex items-center space-x-1.5 shrink-0 rounded-full font-bold uppercase tracking-wider"
        >
          <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>GET YOURS</span>
        </button>

      </div>
    </div>
  );
};
