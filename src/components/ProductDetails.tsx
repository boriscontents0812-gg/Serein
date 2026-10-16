import React, { useState } from 'react';
import { productData } from '../data/product';
import { IncludedItem } from '../types';
import { CheckCircle2, Edit2, Check, PackageCheck, Layers, Sparkles } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const [items, setItems] = useState<IncludedItem[]>(productData.includedItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDesc, setTempDesc] = useState('');

  const startEdit = (item: IncludedItem) => {
    setEditingId(item.id);
    setTempTitle(item.title);
    setTempDesc(item.description);
  };

  const saveEdit = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, title: tempTitle, description: tempDesc } : item
      )
    );
    setEditingId(null);
  };

  return (
    <section id="product-details" className="w-full py-16 sm:py-24 bg-canvas-light dark:bg-canvas-dark border-b border-border-light dark:border-border-dark transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        
        {/* Editorial Introduction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-16 sm:mb-24">
          
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#141A1E] border border-border-light dark:border-border-dark text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-lightMuted dark:text-ink-darkMuted shadow-sm mb-3">
              <Sparkles className="w-3 h-3 text-teal" />
              <span>Material & Craftsmanship</span>
            </div>

            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl text-ink-light dark:text-ink-dark font-medium uppercase tracking-heading leading-[1.15]">
              {productData.detailsSection.headline}
            </h2>
            <p className="font-editorial italic text-base sm:text-lg text-teal dark:text-teal-bright mt-2">
              "{productData.detailsSection.subheadline}"
            </p>

            <div className="mt-6 space-y-4 text-xs sm:text-sm text-ink-lightMuted dark:text-ink-darkMuted font-light leading-relaxed">
              {productData.detailsSection.bodyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Specifications Table */}
            <div className="mt-8 border-t border-border-light dark:border-border-dark pt-6 space-y-2.5">
              <div className="flex items-center space-x-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-ink-light dark:text-ink-dark mb-4">
                <Layers className="w-4 h-4 text-teal stroke-[1.8]" />
                <span>Technical Specifications</span>
              </div>
              {productData.detailsSection.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between text-xs py-2.5 px-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-colors border-b border-border-light/60 dark:border-border-dark/60">
                  <span className="text-ink-lightMuted dark:text-ink-darkMuted font-light">{spec.label}</span>
                  <span className="text-ink-light dark:text-ink-dark font-medium text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Macro Craftsmanship Visual Image (Clay Card Frame) */}
          <div className="lg:col-span-7">
            <div className="clay-card rounded-[24px] sm:rounded-[28px] overflow-hidden group">
              <div className="overflow-hidden">
                <img
                  src="/images/product-macro.jpg"
                  alt="Plush teal velvet texture and delicate craftsmanship of the Serein rod"
                  className="w-full aspect-[16/10] object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
              </div>
              <div className="p-5 bg-white dark:bg-[#141A1E] border-t border-border-light dark:border-border-dark flex items-center justify-between text-xs text-ink-light dark:text-ink-dark">
                <span className="tracking-wide font-light">
                  Tactile Teal Velvet Pile · High Resilience Foam Core
                </span>
                <span className="font-mono uppercase tracking-widest text-[11px] text-teal">
                  SEREIN NO. 01
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* What's Included Section (Floating Clay Card) */}
        <div className="clay-card rounded-[28px] sm:rounded-[32px] p-8 sm:p-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-border-light dark:border-border-dark gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <PackageCheck className="w-4 h-4 text-teal stroke-[1.8]" />
                <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-ink-lightMuted dark:text-ink-darkMuted">
                  The Complete Set
                </span>
              </div>
              <h3 className="font-sans text-2xl sm:text-3xl text-ink-light dark:text-ink-dark font-medium uppercase tracking-heading mt-1">
                What’s included in the box
              </h3>
            </div>
            <p className="text-xs text-ink-lightMuted dark:text-ink-darkMuted font-light max-w-sm leading-relaxed">
              All items pictured in the product photography are included in your set. Click the edit icon to customize descriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-canvas-light/60 dark:bg-[#182126] border border-border-light dark:border-border-dark flex flex-col justify-between hover:-translate-y-1 hover:shadow-clay-sm transition-all duration-300 relative group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-full bg-teal/10 dark:bg-teal/20 text-teal text-xs font-mono font-medium flex items-center justify-center border border-teal/20">
                        {item.count}
                      </span>
                      <button
                        onClick={() => (isEditing ? saveEdit(item.id) : startEdit(item))}
                        className="text-ink-lightSubtle dark:text-ink-darkSubtle hover:text-teal opacity-40 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                        title={isEditing ? 'Save item' : 'Edit item'}
                      >
                        {isEditing ? <Check className="w-3.5 h-3.5 text-teal" /> : <Edit2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          className="w-full bg-white dark:bg-[#141A1E] border border-teal text-ink-light dark:text-ink-dark text-xs px-2.5 py-1 rounded"
                        />
                        <textarea
                          value={tempDesc}
                          onChange={(e) => setTempDesc(e.target.value)}
                          rows={3}
                          className="w-full bg-white dark:bg-[#141A1E] border border-teal text-ink-light dark:text-ink-dark text-xs px-2.5 py-1 rounded"
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-sans text-xs uppercase tracking-wider font-medium text-ink-light dark:text-ink-dark mb-2">
                          {item.title}
                        </h4>
                        <p className="text-xs text-ink-lightMuted dark:text-ink-darkMuted font-light leading-relaxed">
                          {item.description}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-border-light dark:border-border-dark flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-teal font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                    <span>Included in set</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
