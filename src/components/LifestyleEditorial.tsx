import React from 'react';
import { productData } from '../data/product';
import { ArrowRight } from 'lucide-react';

export const LifestyleEditorial: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-24 bg-white border-b border-dp-border overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        
        <div className="border border-dp-border bg-dp-offwhite">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Model Photography Column (7 cols) */}
            <div className="lg:col-span-7 relative h-[420px] sm:h-[520px] lg:h-[620px] border-b lg:border-b-0 lg:border-r border-dp-border">
              <img
                src="/images/lifestyle-model.jpg"
                alt="Woman with glossy, natural soft waves resting peacefully in an unhurried modern space"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-6 left-6 z-10">
                <span className="inline-block px-3.5 py-1.5 text-[10px] tracking-[0.2em] uppercase bg-white/95 text-dp-black border border-dp-border">
                  The Serein Ritual
                </span>
              </div>
            </div>

            {/* Editorial Copy Column (5 cols) */}
            <div className="lg:col-span-5 p-8 sm:p-14 lg:p-16 flex flex-col justify-center space-y-7">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-dp-gray">
                  {productData.lifestyleSection.eyebrow}
                </span>
                <h2 className="font-sans text-2xl sm:text-3xl text-dp-black font-normal uppercase tracking-heading mt-2 leading-[1.15]">
                  {productData.lifestyleSection.headline}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-dp-gray font-light leading-relaxed">
                {productData.lifestyleSection.description}
              </p>

              {/* Quote box in Deadly Ponies style */}
              <div className="pt-6 border-t border-dp-border space-y-2">
                <blockquote className="font-editorial italic text-xl sm:text-2xl text-dp-black font-normal leading-snug">
                  "{productData.lifestyleSection.quote}"
                </blockquote>
                <span className="block text-[11px] tracking-[0.16em] uppercase text-dp-gray font-light">
                  — {productData.lifestyleSection.author}
                </span>
              </div>

              <div className="pt-2">
                <a
                  href="#product-hero"
                  className="dp-btn-black text-xs space-x-2"
                >
                  <span>Experience The Set</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
