import React, { useState } from 'react';
import { productData } from '../data/product';
import { Sparkles, HelpCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="w-full py-16 sm:py-24 bg-canvas-light dark:bg-canvas-dark border-b border-border-light dark:border-border-dark transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-[#141A1E] border border-border-light dark:border-border-dark text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-lightMuted dark:text-ink-darkMuted shadow-sm mb-3">
            <Sparkles className="w-3 h-3 text-teal" />
            <span>Step-by-Step Method</span>
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl text-ink-light dark:text-ink-dark font-medium uppercase tracking-heading">
            How it works
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-ink-lightMuted dark:text-ink-darkMuted font-light leading-relaxed">
            A quiet 5-step ritual designed to shape hair naturally without heating elements.
          </p>
        </div>

        {/* 5-Step Visual Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 lg:gap-5">
          {productData.howItWorksSteps.map((stepItem, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={stepItem.step}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer p-6 rounded-[22px] transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'clay-card border-teal ring-2 ring-teal/25 scale-[1.02] shadow-clay-hover'
                    : 'bg-white/80 dark:bg-[#141A1E]/80 border-border-light dark:border-border-dark hover:bg-white dark:hover:bg-[#182126] hover:-translate-y-1 hover:shadow-clay-sm'
                }`}
              >
                <div>
                  {/* Step Marker Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`font-mono text-xl font-medium transition-colors ${
                        isSelected ? 'text-teal' : 'text-ink-lightSubtle dark:text-ink-darkSubtle'
                      }`}
                    >
                      {stepItem.step}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-colors shadow-sm ${
                        isSelected
                          ? 'bg-teal text-white font-bold'
                          : 'bg-canvas-light dark:bg-[#1E272D] text-ink-lightSubtle dark:text-ink-darkSubtle border border-border-light dark:border-border-dark'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>

                  <h3 className="font-sans text-xs uppercase tracking-wider font-medium text-ink-light dark:text-ink-dark mb-2.5">
                    {stepItem.title}
                  </h3>

                  <p className="text-xs text-ink-lightMuted dark:text-ink-darkMuted font-light leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>

                {/* Practical Tip */}
                {stepItem.tip && (
                  <div className="mt-6 pt-3 border-t border-border-light/60 dark:border-border-dark/60 text-[11px] text-ink-lightMuted dark:text-ink-darkMuted font-light flex items-start space-x-1.5">
                    <Sparkles className="w-3 h-3 text-teal shrink-0 mt-0.5" />
                    <span>{stepItem.tip}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom ritual summary card (Pill container) */}
        <div className="mt-12 clay-card rounded-full p-4 sm:px-8 text-center max-w-2xl mx-auto flex items-center justify-center space-x-3 text-xs text-ink-lightMuted dark:text-ink-darkMuted">
          <HelpCircle className="w-4 h-4 text-teal shrink-0 stroke-[1.8]" />
          <span className="font-light">
            For optimal definition, leave the rod in place for at least 4 to 6 hours or overnight until hair has dried completely.
          </span>
        </div>

      </div>
    </section>
  );
};
