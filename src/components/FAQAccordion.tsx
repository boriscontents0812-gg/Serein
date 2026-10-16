import React, { useState } from 'react';
import { productData } from '../data/product';
import { FAQItem } from '../types';
import { ChevronDown, Edit2, Check, HelpCircle, Sparkles } from 'lucide-react';

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
    <section id="faq" className="w-full py-16 sm:py-24 bg-canvas-light dark:bg-canvas-dark border-b border-border-light dark:border-border-dark transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-[#141A1E] border border-border-light dark:border-border-dark text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-lightMuted dark:text-ink-darkMuted shadow-sm mb-3">
            <Sparkles className="w-3 h-3 text-teal" />
            <span>Common Inquiries</span>
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl text-ink-light dark:text-ink-dark font-medium uppercase tracking-heading">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-ink-lightMuted dark:text-ink-darkMuted font-light">
            Clear, honest answers about our heatless curler set and order process.
          </p>
        </div>

        {/* Kree8-style Floating Clay Accordion Container */}
        <div className="clay-card rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 divide-y divide-border-light dark:divide-border-dark">
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
                  <span className="font-sans text-sm sm:text-base text-ink-light dark:text-ink-dark font-medium uppercase tracking-wide group-hover:text-teal transition-colors pr-4">
                    {faq.question}
                  </span>
                  
                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={(e) => (isEditing ? saveEdit(e, faq.id) : startEdit(e, faq))}
                      className="text-ink-lightSubtle dark:text-ink-darkSubtle hover:text-teal opacity-40 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                      title={isEditing ? 'Save answer' : 'Edit answer placeholder'}
                      aria-label="Edit FAQ answer"
                    >
                      {isEditing ? <Check className="w-3.5 h-3.5 text-teal" /> : <Edit2 className="w-3.5 h-3.5" />}
                    </button>
                    
                    {/* Tactile circle chevron indicator */}
                    <div className="w-8 h-8 rounded-full bg-canvas-light dark:bg-[#1E262B] flex items-center justify-center text-ink-light dark:text-ink-dark border border-border-light dark:border-border-dark transition-all duration-300 group-open:bg-teal group-open:text-white group-open:border-teal group-open:rotate-180 shadow-sm">
                      <ChevronDown className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>
                </summary>

                <div className="pb-6 text-xs sm:text-sm text-ink-lightMuted dark:text-ink-darkMuted font-light leading-relaxed max-w-3xl">
                  {isEditing ? (
                    <div className="space-y-3 pt-2" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={tempAnswer}
                        onChange={(e) => setTempAnswer(e.target.value)}
                        rows={4}
                        className="w-full bg-white dark:bg-[#1A2227] border border-teal text-ink-light dark:text-ink-dark text-xs sm:text-sm p-3 rounded-xl focus:outline-none"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(null);
                          }}
                          className="px-4 py-1.5 rounded-full border border-border-light dark:border-border-dark text-xs text-ink-lightMuted dark:text-ink-darkMuted cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => saveEdit(e, faq.id)}
                          className="btn-clay-teal px-5 py-1.5 text-xs font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="pl-1">{faq.answer}</p>
                  )}
                </div>
              </details>
            );
          })}
        </div>

        {/* Small Note Pill */}
        <div className="mt-10 text-center text-xs text-ink-lightMuted dark:text-ink-darkMuted font-light flex items-center justify-center space-x-2">
          <HelpCircle className="w-3.5 h-3.5 text-teal shrink-0 stroke-[1.8]" />
          <span>Need further assistance? Contact our care team at concierge@sereinbeauty.com</span>
        </div>

      </div>
    </section>
  );
};
