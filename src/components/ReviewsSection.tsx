import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, X } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userReviews, setUserReviews] = useState<Array<{ name: string; rating: number; text: string; date: string }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) return;

    setUserReviews((prev) => [
      {
        name,
        rating,
        text: reviewText,
        date: 'Just now',
      },
      ...prev,
    ]);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setName('');
      setReviewText('');
    }, 1500);
  };

  return (
    <section id="reviews" className="w-full py-16 sm:py-24 bg-[#0A0B0E] border-b border-white/5 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-12 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#EAA858] block mb-3">
              REVIEWS
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Loved by Thousands of Routines.
            </h2>
          </div>

          <div className="flex items-center space-x-3 bg-[#121518] border border-[#1E2529] px-5 py-3 rounded-2xl">
            <div className="flex space-x-1 text-[#EAA858]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm">★</span>
              ))}
            </div>
            <span className="text-xs text-neutral-300 font-medium">
              <strong className="text-white">4.8 / 5</strong> rating (4,800+ customers)
            </span>
          </div>
        </div>

        {/* Featured Customer Feedback Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="video-dark-card p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1 text-[#EAA858]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">Verified Buyer</span>
              </div>
              <p className="text-sm text-neutral-300 font-normal leading-relaxed mb-4">
                "The 60-inch length made all the difference for my long, thick hair. It wrapped around both sides without slipping and the waves looked like a professional blowout."
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-white">Claire W.</span>
              <span>New York, NY</span>
            </div>
          </div>

          <div className="video-dark-card p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1 text-[#EAA858]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">Verified Buyer</span>
              </div>
              <p className="text-sm text-neutral-300 font-normal leading-relaxed mb-4">
                "So comfortable to sleep with. The velvet feels ultra soft, doesn't pull my roots, and I wake up with bouncy, effortless waves. Completely replaced my hot curling iron."
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-white">Sienna M.</span>
              <span>Los Angeles, CA</span>
            </div>
          </div>

          <div className="video-dark-card p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1 text-[#EAA858]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm">★</span>
                  ))}
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">Verified Buyer</span>
              </div>
              <p className="text-sm text-neutral-300 font-normal leading-relaxed mb-4">
                "The quality of the whole kit is remarkable. The claw clip and matching scrunchies make it so easy to secure, and the color is gorgeous in person."
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-white">Hannah K.</span>
              <span>Austin, TX</span>
            </div>
          </div>
        </div>

        {/* User Added Reviews & Leave Review Row */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
          <span className="text-xs text-neutral-400">
            {userReviews.length > 0 ? `${userReviews.length} new review recorded` : 'Have you tried The Serein Set?'}
          </span>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-semibold tracking-wider uppercase text-[#EAA858] hover:text-[#F4B266] transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 stroke-[1.8]" />
            <span>Leave a Review</span>
          </button>
        </div>

        {userReviews.length > 0 && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {userReviews.map((rev, i) => (
              <div key={i} className="video-dark-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex space-x-1 text-[#EAA858]">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <span key={idx} className="text-sm">★</span>
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-500">{rev.date}</span>
                </div>
                <p className="text-sm text-neutral-300 font-normal leading-relaxed mb-3">
                  "{rev.text}"
                </p>
                <p className="text-[11px] tracking-wider uppercase text-neutral-400 font-medium">
                  {rev.name} · Verified Order
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Leaving a Review */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-[#121518] border border-[#1E2529] rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in text-left">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1"
                aria-label="Close review dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-[10px] tracking-[0.2em] uppercase text-[#EAA858] font-semibold">
                Customer Perspective
              </span>
              <h3 className="font-sans text-xl sm:text-2xl text-white font-bold tracking-tight mt-1 mb-4">
                Share your experience
              </h3>

              {submitted ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-[#25B6A7]" />
                  <p className="font-sans text-lg text-white font-bold uppercase tracking-tight">Thank you for sharing</p>
                  <p className="text-xs text-neutral-400">Your review has been recorded.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1.5 font-medium">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-neutral-500 hover:text-[#EAA858] focus:outline-none transition-colors"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-[#EAA858] text-[#EAA858]' : 'text-neutral-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1.5 font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena M."
                      className="w-full bg-[#181C20] border border-[#263037] px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 rounded-xl focus:border-[#EAA858] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-300 mb-1.5 font-medium">
                      Your Experience
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="How does The Serein Set feel in your hair routine?"
                      className="w-full bg-[#181C20] border border-[#263037] px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 rounded-xl focus:border-[#EAA858] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 border border-[#263037] rounded-full text-xs text-neutral-400 uppercase tracking-wider hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-amber text-xs px-6 py-2.5"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
