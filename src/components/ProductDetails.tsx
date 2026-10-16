import React, { useState } from 'react';
import { productData } from '../data/product';
import { IncludedItem } from '../types';
import { CheckCircle2, Edit2, Check, Layers } from 'lucide-react';

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
    <section id="product-details" className="w-full py-16 sm:py-24 bg-[#0A0B0E] border-b border-white/5 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        
        {/* What's Included Section Header */}
        <div className="text-left mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#EAA858] block mb-3">
            WHAT'S INCLUDED
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            The Complete Heatless Ritual Kit.
          </h2>
          <p className="mt-3 text-sm text-neutral-400 font-normal max-w-xl">
            All 4 items pictured in the product photography are included in your set. Click the edit icon to customize descriptions.
          </p>
        </div>

        {/* 4 Included Items Grid (Dark video cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16 sm:mb-24">
          {items.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                className="video-dark-card p-6 sm:p-7 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-[#181D21] text-[#EAA858] text-xs font-mono font-bold flex items-center justify-center border border-[#252E34]">
                      {item.count}
                    </span>
                    <button
                      onClick={() => (isEditing ? saveEdit(item.id) : startEdit(item))}
                      className="text-neutral-500 hover:text-[#EAA858] opacity-50 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                      title={isEditing ? 'Save item' : 'Edit item'}
                    >
                      {isEditing ? <Check className="w-3.5 h-3.5 text-[#EAA858]" /> : <Edit2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="w-full bg-[#181C20] border border-[#EAA858] text-white text-xs px-2.5 py-1 rounded"
                      />
                      <textarea
                        value={tempDesc}
                        onChange={(e) => setTempDesc(e.target.value)}
                        rows={3}
                        className="w-full bg-[#181C20] border border-[#EAA858] text-white text-xs px-2.5 py-1 rounded"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                        {item.description}
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-white/5 flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-[#25B6A7] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Included in set</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Editorial Craftsmanship & Material Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-8 border-t border-white/5">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#EAA858] block">
              MATERIAL & DETAIL
            </span>

            <h3 className="font-sans text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-tight leading-snug">
              {productData.detailsSection.headline}
            </h3>

            <div className="space-y-4 text-sm text-neutral-300 font-normal leading-relaxed">
              {productData.detailsSection.bodyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Specifications Table */}
            <div className="border-t border-white/5 pt-5 space-y-2">
              <div className="flex items-center space-x-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white mb-3">
                <Layers className="w-4 h-4 text-[#EAA858] stroke-[1.8]" />
                <span>Technical Specifications</span>
              </div>
              {productData.detailsSection.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between text-xs py-2 px-3 rounded-lg bg-[#121518] border border-[#1E2529]">
                  <span className="text-neutral-400">{spec.label}</span>
                  <span className="text-white font-medium text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Macro Image Showcase */}
          <div className="lg:col-span-7">
            <div className="video-dark-card overflow-hidden group">
              <div className="overflow-hidden">
                <img
                  src="/images/product-macro.jpg"
                  alt="Plush teal velvet texture and delicate craftsmanship of the Serein rod"
                  className="w-full aspect-[16/10] object-cover object-center group-hover:scale-102 transition-transform duration-700"
                />
              </div>
              <div className="p-5 bg-[#121518] border-t border-white/5 flex items-center justify-between text-xs text-neutral-300">
                <span className="tracking-wide">
                  Tactile Teal Velvet Pile · High Resilience Foam Core
                </span>
                <span className="font-mono uppercase tracking-widest text-[11px] text-[#25B6A7]">
                  SEREIN NO. 01
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
