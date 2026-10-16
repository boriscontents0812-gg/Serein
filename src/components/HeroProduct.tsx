import React, { useState } from 'react';
import { productData } from '../data/product';
import { useCart } from '../context/CartContext';
import { ProductGallery } from './ProductGallery';
import { Minus, Plus, ShoppingBag, Check, Edit2, ArrowDown } from 'lucide-react';

export const HeroProduct: React.FC = () => {
  const { addItem, retailPrice, setRetailPrice } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(retailPrice.toString());
  const [bundleNote, setBundleNote] = useState(productData.includesNote);
  const [isEditingBundleNote, setIsEditingBundleNote] = useState(false);
  const [addSuccessAnimation, setAddSuccessAnimation] = useState(false);

  const handlePriceSave = () => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val > 0) {
      setRetailPrice(val);
    }
    setIsEditingPrice(false);
  };

  const handleAddToCart = () => {
    addItem(quantity);
    setAddSuccessAnimation(true);
    setTimeout(() => setAddSuccessAnimation(false), 1200);
  };

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#how-it-works');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="product-hero" className="w-full pt-8 pb-16 sm:py-20 bg-[#0A0B0E] text-white border-b border-white/5 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Product Introduction, Value Prop, Pricing & CTA (6 cols) */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            
            {/* Eyebrow (Amber uppercase tracking-widest text) */}
            <div className="inline-flex items-center space-x-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-[#EAA858]">
              <span>YOUR DAILY RITUAL</span>
              <span className="opacity-60">·</span>
              <span className="text-neutral-400 font-normal">HEATLESS STYLING</span>
            </div>

            {/* Main Headline (Two Lines: Crisp White + Amber Gradient) */}
            <h1 className="font-sans text-5xl sm:text-6xl lg:text-[68px] font-bold tracking-tight text-white leading-[1.08]">
              Switch Off.
              <span className="block gradient-amber-text">Style On.</span>
            </h1>

            {/* Description (Concise, calm, luxury beauty copy) */}
            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
              An extra-long 60-inch curling rod designed to recreate effortless salon waves — whenever you need it.
            </p>

            {/* Social Proof Rating */}
            <div className="flex items-center space-x-3 pt-1">
              <div className="flex items-center space-x-1 text-[#EAA858]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-base leading-none">★</span>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-neutral-400 font-medium tracking-wide">
                <span className="text-white font-semibold">4.8/5</span> from happy customers
              </span>
            </div>

            {/* Price Row (Large bold white with strikethrough comparison) */}
            <div className="flex items-baseline space-x-3 pt-1">
              {isEditingPrice ? (
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-white">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={tempPrice}
                    onChange={(e) => setTempPrice(e.target.value)}
                    className="w-28 bg-[#181C20] border border-[#EAA858] text-white px-3 py-1 text-2xl font-bold rounded-lg focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handlePriceSave}
                    className="p-1.5 bg-[#EAA858] text-black rounded-md hover:bg-[#F4B266] transition-colors"
                    title="Save price"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              ) : (
                <div className="flex items-baseline space-x-2.5 group cursor-pointer" onClick={() => setIsEditingPrice(true)}>
                  <span className="font-sans text-4xl sm:text-5xl font-bold text-white tracking-tight">
                    ${retailPrice.toFixed(2)}
                  </span>
                  <span className="text-neutral-500 line-through text-lg font-normal">
                    $75.00
                  </span>
                  <button
                    className="text-neutral-500 hover:text-[#EAA858] opacity-50 group-hover:opacity-100 transition-opacity p-1 ml-1"
                    title="Edit retail price placeholder"
                    aria-label="Edit price"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Stepper + GET YOURS Amber Button Row */}
            <div className="flex items-center space-x-4 pt-2 flex-wrap sm:flex-nowrap gap-y-3">
              {/* Dark Pill Stepper */}
              <div className="flex items-center bg-[#15181B] border border-[#23292F] h-13 px-4 rounded-full text-white">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2]" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              </div>

              {/* Main Amber Pill CTA Button (GET YOURS) */}
              <button
                onClick={handleAddToCart}
                className="btn-amber flex-1 h-13 px-8 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase rounded-full flex items-center justify-center space-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span>{addSuccessAnimation ? 'Added to Bag!' : 'GET YOURS'}</span>
              </button>
            </div>

            {/* Trust Guarantee Line */}
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="font-medium text-neutral-300">
                  Free US Shipping • 30-Day Guarantee
                </p>
                <a
                  href="#how-it-works"
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center space-x-1 text-xs text-neutral-400 hover:text-[#EAA858] transition-colors cursor-pointer group"
                >
                  <span className="underline underline-offset-4 decoration-neutral-600 group-hover:decoration-[#EAA858]">How it works</span>
                  <ArrowDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                </a>
              </div>
              <p className="text-[11px] tracking-[0.14em] uppercase text-[#EAA858] font-semibold">
                LIMITED LAUNCH PRICING.
              </p>
            </div>

            {/* 3 Checkmark Micro-Features */}
            <div className="pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-300">
              <div className="flex items-center space-x-2">
                <span className="text-[#EAA858] font-bold">✓</span>
                <span className="tracking-wide">360° mechanical wrap</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#EAA858] font-bold">✓</span>
                <span className="tracking-wide">Soft velvet exterior</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#EAA858] font-bold">✓</span>
                <span className="tracking-wide">Heat-free & hair-safe</span>
              </div>
            </div>

            {/* Editable Bundle Note */}
            <div className="pt-2 text-xs text-neutral-400 flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1">
                <span className="text-[#25B6A7] font-serif italic text-sm">i</span>
                {isEditingBundleNote ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={bundleNote}
                      onChange={(e) => setBundleNote(e.target.value)}
                      className="w-full bg-[#181C20] border border-[#EAA858] text-white px-2.5 py-1 rounded text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => setIsEditingBundleNote(false)}
                      className="text-[#EAA858] p-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-neutral-400">{bundleNote}</span>
                )}
              </div>
              <button
                onClick={() => setIsEditingBundleNote(!isEditingBundleNote)}
                className="ml-2 text-neutral-500 hover:text-[#EAA858] transition-colors opacity-50 hover:opacity-100 p-0.5"
                title="Edit bundle note"
                aria-label="Edit bundle note"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* Right Column: Hero Showcase Stage & Gallery (6 cols) */}
          <div className="lg:col-span-6">
            <ProductGallery images={productData.images} />
          </div>

        </div>
      </div>
    </section>
  );
};
