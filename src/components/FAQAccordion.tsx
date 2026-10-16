import React, { useState } from 'react';
import { productData } from '../data/product';
import { FAQItem } from '../types';
import { ChevronDown, Edit2, Check, HelpCircle } from 'lucide-react';

export const FAQAccordion: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>(productData.faqs);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAnswer, setTempAnswer] = useState('');

  const startEdit = (e: React.MouseEvent, faq: FAQItem) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingId(faq.id);
    setTempAnswer(faq.answer);
  };

  const saveEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setFaqs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, answer: tempAnswer } : item))
    );
    setEditingId(null);
  };

  return (
    <section id="faq" className="w-full py-16 sm:py-24 bg-[#0A0B0E] border-b border-white/5 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-left mb-12 sm:mb-14">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#EAA858] block mb-3">
            FAQ
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Frequently Asked Questions.
          </h2>
          <p className="mt-3 text-sm text-neutral-400 font-normal">
            Clear, honest answers about our heatless curler set and order process.
          </p>
        </div>

        {/* Dark Video Accordion Container */}
        <div className="video-dark-card p-6 sm:p-10 divide-y divide-[#1E2529]">
          {faqs.map((faq, index) => {
            const isEditing = editingId === faq.id;
            return (
              <details
                key={faq.id}
                name="serein-faq"
                className="group transition-colors duration-200"
                open={index === 0 ? true : undefined}
              >
                <summary className="cursor-pointer list-none py-5 sm:py-6 flex items-center justify-between text-left select-none focus-visible:outline-none">
                  <span className="font-sans text-sm sm:text-base text-white font-semibold uppercase tracking-wide group-hover:text-[#EAA858] transition-colors pr-4">
                    {faq.question}
                  </span>
                  
                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={(e) => (isEditing ? saveEdit(e, faq.id) : startEdit(e, faq))}
                      className="text-neutral-500 hover:text-[#EAA858] opacity-40 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                      title={isEditing ? 'Save answer' : 'Edit answer placeholder'}
                      aria-label="Edit FAQ answer"
                    >
                      {isEditing ? <Check className="w-3.5 h-3.5 text-[#EAA858]" /> : <Edit2 className="w-3.5 h-3.5" />}
                    </button>
                    
                    {/* Circle chevron indicator */}
                    <div className="w-8 h-8 rounded-full bg-[#181D21] flex items-center justify-center text-neutral-400 border border-[#252E34] transition-all duration-300 group-open:bg-[#EAA858] group-open:text-black group-open:border-[#EAA858] group-open:rotate-180 shadow-sm">
                      <ChevronDown className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                </summary>

                <div className="pb-6 text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed max-w-3xl">
                  {isEditing ? (
                    <div className="space-y-3 pt-2" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={tempAnswer}
                        onChange={(e) => setTempAnswer(e.target.value)}
                        rows={4}
                        className="w-full bg-[#181C20] border border-[#EAA858] text-white text-xs sm:text-sm p-3 rounded-xl focus:outline-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(null);
                          }}
                          className="px-4 py-1.5 rounded-full border border-[#263037] text-xs text-neutral-400 cursor-pointer hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => saveEdit(e, faq.id)}
                          className="btn-amber px-5 py-1.5 text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="pl-1 text-neutral-400">{faq.answer}</p>
                  )}
                </div>
              </details>
            );
          })}
        </div>

        {/* Small Note Pill */}
        <div className="mt-10 text-center text-xs text-neutral-400 flex items-center justify-center space-x-2">
          <HelpCircle className="w-3.5 h-3.5 text-[#EAA858] shrink-0 stroke-[1.8]" />
          <span>Need further assistance? Contact our care team at concierge@sereinbeauty.com</span>
        </div>

      </div>
    </section>
  );
};
