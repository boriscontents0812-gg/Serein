import React, { useState } from 'react';
import { productData } from '../data/product';
import { Sparkles, HelpCircle } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="w-full py-16 sm:py-24 bg-[#0A0B0E] border-b border-white/5 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#EAA858] block mb-3">
            HOW IT WORKS
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            Five Steps to Effortless Waves.
          </h2>
          <p className="mt-3 text-sm text-neutral-400 font-normal max-w-xl">
            A quiet ritual designed to shape hair naturally without heating elements.
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
                className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-[#161B20] border-[#EAA858] shadow-lg shadow-amber-500/10'
                    : 'bg-[#121518] border-[#1E2529] hover:border-[#2E373D] hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Step Marker Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`font-mono text-xl font-bold transition-colors ${
                        isSelected ? 'text-[#EAA858]' : 'text-neutral-500'
                      }`}
                    >
                      {stepItem.step}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-colors ${
                        isSelected
                          ? 'bg-[#EAA858] text-black'
                          : 'bg-[#181D21] text-neutral-400 border border-[#23292F]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>

                  <h3 className="font-sans text-xs uppercase tracking-wider font-bold text-white mb-2.5">
                    {stepItem.title}
                  </h3>

                  <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                    {stepItem.description}
                  </p>
                </div>

                {/* Practical Tip */}
                {stepItem.tip && (
                  <div className="mt-6 pt-3 border-t border-white/5 text-[11px] text-neutral-400 flex items-start space-x-1.5">
                    <Sparkles className="w-3 h-3 text-[#EAA858] shrink-0 mt-0.5" />
                    <span>{stepItem.tip}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom ritual summary pill */}
        <div className="mt-12 bg-[#121518] border border-[#1E2529] rounded-full p-4 sm:px-8 text-center max-w-2xl mx-auto flex items-center justify-center space-x-3 text-xs text-neutral-400">
          <HelpCircle className="w-4 h-4 text-[#EAA858] shrink-0 stroke-[1.8]" />
          <span>
            For optimal definition, leave the rod in place for 4 to 6 hours or overnight until hair has dried completely.
          </span>
        </div>

      </div>
    </section>
  );
};
