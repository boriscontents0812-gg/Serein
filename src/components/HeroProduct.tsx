import React, { useState } from 'react';
import { productData } from '../data/product';
import { useCart } from '../context/CartContext';
import { ProductGallery } from './ProductGallery';
import { Minus, Plus, ShoppingBag, ArrowDown, Check, Edit2, ShieldCheck, RefreshCw, Feather, Sparkles } from 'lucide-react';

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
    setTimeout(() => setAddSuccessAnimation(false), 900);
  };

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#how-it-works');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="product-hero" className="w-full py-8 sm:py-14 bg-canvas-light dark:bg-canvas-dark border-b border-border-light dark:border-border-dark transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Product Photography & Gallery (7 cols) */}
          <div className="lg:col-span-7">
            <ProductGallery images={productData.images} />
          </div>

          {/* Right Column: Editorial Product Info & Purchase Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Header info */}
            <div className="space-y-3 border-b border-border-light dark:border-border-dark pb-6">
              
              {/* Kree8-style Micro Pill Tag */}
              <div className="inline-flex items-center space-x-2 text-[11px] font-medium tracking-[0.16em] uppercase px-3.5 py-1 rounded-full bg-white dark:bg-[#151C20] border border-border-light dark:border-border-dark shadow-sm text-ink-lightMuted dark:text-ink-darkMuted group">
                <Sparkles className="w-3 h-3 text-teal group-hover:rotate-12 transition-transform duration-300" />
                <span>{productData.eyebrow}</span>
                <span>·</span>
                <span>{productData.lengthSpecification}</span>
              </div>

              <h1 className="font-sans text-3xl sm:text-4xl text-ink-light dark:text-ink-dark font-medium uppercase tracking-heading leading-[1.15]">
                {productData.name}
              </h1>

              <p className="font-editorial italic text-lg sm:text-xl text-teal dark:text-teal-bright leading-snug">
                "{productData.heroHeadline}"
              </p>

              {/* Price row */}
              <div className="pt-2 flex items-center justify-between">
                {isEditingPrice ? (
                  <div className="flex items-center space-x-1">
                    <span className="text-ink-light dark:text-ink-dark font-sans text-2xl tracking-price">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      className="w-24 bg-white dark:bg-[#1A2227] border border-teal text-ink-light dark:text-ink-dark px-2.5 py-1 text-sm font-sans rounded-md focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handlePriceSave}
                      className="p-1 text-teal hover:text-teal-bright"
                      title="Save retail price"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => setIsEditingPrice(true)}>
                    <span className="font-sans text-3xl sm:text-[34px] text-ink-light dark:text-ink-dark font-medium tracking-price">
                      ${retailPrice.toFixed(2)}
                    </span>
                    <button
                      className="text-ink-lightSubtle dark:text-ink-darkSubtle hover:text-teal transition-colors opacity-50 group-hover:opacity-100 p-1"
                      title="Edit retail price placeholder"
                      aria-label="Edit price"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <span className="text-[11px] uppercase tracking-wider text-teal font-medium border border-teal/30 bg-teal/10 px-3 py-1 rounded-full shadow-sm">
                  In Stock · Ready to Ship
                </span>
              </div>
            </div>

            {/* Product description */}
            <p className="text-sm text-ink-lightMuted dark:text-ink-darkMuted font-light leading-relaxed">
              {productData.heroDescription}
            </p>

            {/* Purchase Controls Card (Floating Clay Card) */}
            <div className="clay-card rounded-[24px] sm:rounded-[28px] p-6 space-y-6">
              
              {/* Color Selector */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="text-ink-light dark:text-ink-dark uppercase tracking-[0.14em] font-medium text-[11px]">Color:</span>
                  <span className="text-ink-lightMuted dark:text-ink-darkMuted text-xs">
                    {productData.availableColor.name} <span className="opacity-70">(Plush Velvet Exterior)</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    className="flex items-center space-x-2.5 px-4 py-2 rounded-full border-2 border-teal bg-teal/5 text-xs text-ink-light dark:text-ink-dark shadow-sm hover:scale-[1.02] transition-transform cursor-pointer"
                    aria-label="Teal color selected"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                      style={{ backgroundColor: productData.availableColor.hex }}
                    />
                    <span className="font-medium tracking-wider uppercase text-[11px]">{productData.availableColor.name}</span>
                  </button>
                </div>
              </div>

              {/* Quantity Controls & Primary Add to Cart */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center space-x-3">
                  {/* Quantity Stepper (Pill style) */}
                  <div className="flex items-center border border-border-light dark:border-border-dark bg-white dark:bg-[#141A1E] h-12 px-3 rounded-full shadow-clay-sm">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="p-1.5 text-ink-lightMuted dark:text-ink-darkMuted hover:text-ink-light dark:hover:text-ink-dark disabled:opacity-30 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-ink-light dark:text-ink-dark font-sans">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="p-1.5 text-ink-lightMuted dark:text-ink-darkMuted hover:text-ink-light dark:hover:text-ink-dark transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary Kree8 Clay Pill Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 px-6 font-medium text-xs tracking-[0.18em] uppercase rounded-full flex items-center justify-center space-x-2 transition-all duration-300 select-none cursor-pointer active:scale-[0.98] ${
                      addSuccessAnimation
                        ? 'btn-clay-teal text-white shadow-teal-glow scale-[1.02]'
                        : 'btn-clay-dark text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
                    <span>{addSuccessAnimation ? 'Added to Bag' : 'Add to Bag'}</span>
                  </button>
                </div>

                {/* Secondary 'How It Works' anchor */}
                <div className="text-center pt-1">
                  <a
                    href="#how-it-works"
                    onClick={scrollToHowItWorks}
                    className="inline-flex items-center space-x-1.5 text-xs text-ink-lightMuted dark:text-ink-darkMuted hover:text-teal transition-colors py-1 group cursor-pointer"
                  >
                    <span className="underline underline-offset-4 decoration-border-light dark:decoration-border-dark group-hover:decoration-teal">
                      View the 5-step curling routine
                    </span>
                    <ArrowDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Editable Bundle Note */}
              <div className="border-t border-border-light dark:border-border-dark pt-4 text-xs text-ink-lightMuted dark:text-ink-darkMuted flex items-start justify-between">
                <div className="flex items-start space-x-2 flex-1">
                  <Feather className="w-3.5 h-3.5 text-teal mt-0.5 shrink-0" />
                  {isEditingBundleNote ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="text"
                        value={bundleNote}
                        onChange={(e) => setBundleNote(e.target.value)}
                        className="w-full bg-white dark:bg-[#1A2227] border border-teal text-ink-light dark:text-ink-dark px-2.5 py-0.5 rounded text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => setIsEditingBundleNote(false)}
                        className="text-teal p-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span>{bundleNote}</span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingBundleNote(!isEditingBundleNote)}
                  className="ml-2 text-ink-lightSubtle dark:text-ink-darkSubtle hover:text-teal transition-colors opacity-50 hover:opacity-100 p-0.5"
                  title="Edit bundle note"
                  aria-label="Edit bundle note"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>

            </div>

            {/* Editorial Features Strip */}
            <div className="grid grid-cols-2 gap-3 text-xs text-ink-lightMuted dark:text-ink-darkMuted pt-1">
              <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white dark:bg-[#141A1E] border border-border-light dark:border-border-dark shadow-sm group hover:-translate-y-0.5 transition-transform">
                <ShieldCheck className="w-4 h-4 text-teal shrink-0 stroke-[1.8] group-hover:rotate-6 transition-transform" />
                <span className="text-[11px] uppercase tracking-wider font-medium text-ink-light dark:text-ink-dark">Tactile velvet exterior</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-white dark:bg-[#141A1E] border border-border-light dark:border-border-dark shadow-sm group hover:-translate-y-0.5 transition-transform">
                <RefreshCw className="w-4 h-4 text-teal shrink-0 stroke-[1.8] group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[11px] uppercase tracking-wider font-medium text-ink-light dark:text-ink-dark">Reusable at-home ritual</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
