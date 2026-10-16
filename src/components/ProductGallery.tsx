import React, { useState, TouchEvent } from 'react';
import { ProductImage } from '../types';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface ProductGalleryProps {
  images: ProductImage[];
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Main Large Image Stage (Matching the video's dark floating product stage) */}
      <div
        className="relative w-full aspect-square sm:aspect-[4/3.8] bg-gradient-to-b from-[#14181B] via-[#0E1114] to-[#0A0B0E] border border-[#21272C] rounded-[28px] sm:rounded-[36px] overflow-hidden group shadow-2xl transition-all duration-300 flex items-center justify-center"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,182,167,0.08)_0%,transparent_70%)] pointer-events-none" />

        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
          loading="eager"
        />

        {/* Category Pill Tag */}
        <div className="absolute top-5 left-5 z-10">
          <span className="inline-flex items-center px-3.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase text-white border border-white/10 shadow-md">
            {currentImage.label}
          </span>
        </div>

        {/* Video Amber Play / View Floating Badge (matching frame_01.png) */}
        <button
          onClick={() => setIsZoomModalOpen(true)}
          className="absolute left-6 bottom-6 z-10 w-11 h-11 bg-gradient-to-tr from-[#EAA858] to-[#F4B266] text-black rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          title="Inspect high-resolution details"
          aria-label="View photo"
        >
          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-black ml-0.5" />
        </button>

        {/* Zoom Lightbox Trigger */}
        <button
          onClick={() => setIsZoomModalOpen(true)}
          className="absolute top-5 right-5 z-10 p-2.5 bg-black/60 backdrop-blur-md text-neutral-300 hover:text-white transition-all rounded-full border border-white/10 shadow-sm hover:scale-105"
          title="View high-resolution photograph"
          aria-label="Enlarge image"
        >
          <Maximize2 className="w-4 h-4 stroke-[1.8]" />
        </button>

        {/* Prev / Next arrows */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
          <button
            onClick={handlePrev}
            className="pointer-events-auto p-2.5 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white transition-all rounded-full border border-white/10 shadow-sm -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 sm:opacity-70 hover:scale-105 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.8]" />
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto p-2.5 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white transition-all rounded-full border border-white/10 shadow-sm translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 sm:opacity-70 hover:scale-105 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 stroke-[1.8]" />
          </button>
        </div>

        {/* Mobile Swipe Pagination Dots */}
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center space-x-1.5 sm:hidden z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-5 bg-[#EAA858]' : 'w-1.5 bg-white/30'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails Row */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${images.length}, minmax(0, 1fr))` }}
      >
        {images.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative aspect-[4/3] overflow-hidden bg-[#121518] border rounded-2xl transition-all duration-200 group cursor-pointer ${
                isActive
                  ? 'border-[#EAA858] ring-1 ring-[#EAA858]/40 scale-[1.02] shadow-md'
                  : 'border-[#1E2529] opacity-70 hover:opacity-100 hover:border-[#2E373D]'
              }`}
              aria-label={`Select ${img.label}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-0 inset-x-0 text-[10px] text-center font-medium tracking-wider text-neutral-300 truncate bg-black/75 backdrop-blur-xs py-1 border-t border-white/5">
                {img.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/90 dark:bg-[#1C252B] text-ink-light dark:text-ink-dark hover:scale-105 transition-transform z-50 border border-border-light dark:border-border-dark shadow-lg"
            aria-label="Close high-resolution viewer"
          >
            <X className="w-5 h-5 stroke-[1.8]" />
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-h-[82vh] w-auto max-w-full object-contain shadow-2xl rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-[#141A1E]"
            />
            <p className="mt-4 font-sans text-xs uppercase tracking-widest text-white/90 text-center">
              {currentImage.alt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
