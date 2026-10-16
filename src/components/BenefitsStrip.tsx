import React from 'react';
import { Waves, RotateCw, Sparkles, Zap } from 'lucide-react';

export const BenefitsStrip: React.FC = () => {
  const benefits = [
    {
      icon: Waves,
      title: 'DEEP RELAXATION',
      description: 'Gentle wrapping motion recreates effortless salon waves that help turn your daily routine into a moment of calm.',
    },
    {
      icon: RotateCw,
      title: '60" EXTRA-LONG',
      description: 'Extra-long 60-inch rod accommodates all hair lengths and textures with effortless, full coverage.',
    },
    {
      icon: Sparkles,
      title: 'SOFT ON YOUR HAIR',
      description: 'Plush velvet exterior glides smoothly through hair without creasing, tugging, or heat damage.',
    },
    {
      icon: Zap,
      title: 'USE IT ANYWHERE',
      description: 'No cords, no hot tools, and compact enough to make heatless styling a seamless part of your daily routine.',
    },
  ];

  return (
    <section id="benefits" className="w-full py-16 sm:py-24 bg-[#0A0B0E] border-b border-white/5 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        
        {/* Section Header (Matching sec_05.png) */}
        <div className="text-left mb-12 sm:mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#EAA858] block mb-3">
            BENEFITS
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            More Than Just a Curling Rod.
          </h2>
        </div>

        {/* Benefits 4-Card Grid (Matching video cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b) => {
            const IconComponent = b.icon;
            return (
              <div
                key={b.title}
                className="video-dark-card p-7 sm:p-8 flex flex-col justify-start group cursor-default"
              >
                {/* Circular Badge with subtle amber accent icon */}
                <div className="w-11 h-11 rounded-full bg-[#181D21] border border-[#263037] flex items-center justify-center text-[#EAA858] mb-6 group-hover:border-[#EAA858]/50 group-hover:scale-105 transition-all">
                  <IconComponent className="w-5 h-5 stroke-[1.8]" />
                </div>

                <h3 className="font-sans text-sm sm:text-base font-bold text-white uppercase tracking-wider mb-3">
                  {b.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-400 font-normal leading-relaxed">
                  {b.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
