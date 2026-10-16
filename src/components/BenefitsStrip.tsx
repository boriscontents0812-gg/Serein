import React from 'react';
import { productData } from '../data/product';
import { Sparkles, Ruler, Clock } from 'lucide-react';

export const BenefitsStrip: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-teal stroke-[1.8]" />;
      case 'Ruler':
        return <Ruler className="w-5 h-5 text-teal stroke-[1.8]" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-teal stroke-[1.8]" />;
      default:
        return <Sparkles className="w-5 h-5 text-teal stroke-[1.8]" />;
    }
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-canvas-light dark:bg-canvas-dark border-b border-border-light dark:border-border-dark transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        
        {/* Section label */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-[#141A1E] border border-border-light dark:border-border-dark text-[11px] font-semibold tracking-[0.2em] uppercase text-ink-lightMuted dark:text-ink-darkMuted shadow-sm mb-3">
            <span>Thoughtful Design & Use</span>
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl text-ink-light dark:text-ink-dark font-medium uppercase tracking-heading">
            Built for a gentler cadence
          </h2>
        </div>

        {/* Benefits 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {productData.benefits.map((benefit, idx) => (
            <div
              key={benefit.title}
              className="clay-card rounded-[24px] sm:rounded-[28px] p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  {/* Icon container */}
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#182126] border border-border-light dark:border-border-dark flex items-center justify-center shadow-clay-sm group-hover:rotate-[-6deg] transition-transform duration-300">
                    {getIcon(benefit.icon)}
                  </div>
                  {/* Number pill */}
                  <span className="w-9 h-9 rounded-full bg-teal/10 dark:bg-teal/20 text-teal text-xs font-mono font-medium flex items-center justify-center border border-teal/20 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-sans text-lg font-medium text-ink-light dark:text-ink-dark uppercase tracking-tight mb-3">
                  {benefit.title}
                </h3>

                <p className="text-xs sm:text-sm text-ink-lightMuted dark:text-ink-darkMuted font-light leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between text-[11px] tracking-[0.18em] uppercase font-medium text-ink-lightSubtle dark:text-ink-darkSubtle">
                <span>Serein Method</span>
                <span className="text-teal group-hover:translate-x-1 transition-transform duration-200">✦</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
