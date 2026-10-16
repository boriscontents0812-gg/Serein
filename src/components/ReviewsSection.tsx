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
    <section id="reviews" className="w-full py-16 sm:py-24 bg-dp-offwhite border-b border-dp-border">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        
        {/* Section Header */}
        <span className="text-[11px] font-semibold tracking-[0.24em] uppercase text-dp-gray">
          Community Experience
        </span>
        <h2 className="font-sans text-2xl sm:text-3xl text-dp-black font-normal uppercase tracking-heading mt-2">
          Customer reviews
        </h2>

        {/* If no user reviews yet, show the tasteful required placeholder */}
        {userReviews.length === 0 ? (
          <div className="mt-10 bg-white border border-dp-border p-8 sm:p-14 max-w-xl mx-auto flex flex-col items-center">
            {/* Outline Star Icons */}
            <div className="flex items-center space-x-2 mb-5 text-dp-grayLight">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 stroke-[1.5]" />
              ))}
            </div>

            <p className="font-sans text-xl sm:text-2xl text-dp-black font-normal uppercase tracking-heading">
              Be the first to share your experience.
            </p>

            <p className="mt-3 text-xs sm:text-sm text-dp-gray font-light max-w-md leading-relaxed">
              We believe in honest, authentic feedback. As a newly launched ritual set, we invite you to share your journey with The Serein Heatless Curl Set.
            </p>

            <button
              onClick={() => setModalOpen(true)}
              className="mt-7 dp-btn-outline text-xs space-x-2"
            >
              <MessageSquarePlus className="w-4 h-4 stroke-[1.5]" />
              <span>Leave a Review</span>
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-6 text-left">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs text-dp-gray font-light">
                {userReviews.length} Community Review{userReviews.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setModalOpen(true)}
                className="dp-link text-xs text-dp-black"
              >
                + Write a review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userReviews.map((rev, i) => (
                <div key={i} className="bg-white border border-dp-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex space-x-1 text-dp-black">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-dp-grayLight">{rev.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-dp-ink font-light leading-relaxed mb-3">
                    "{rev.text}"
                  </p>
                  <p className="text-[11px] tracking-wider uppercase text-dp-gray font-medium">
                    {rev.name} · Verified Order
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for Leaving a Review */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white border border-dp-border p-6 sm:p-8 shadow-2xl animate-fade-in text-left">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-dp-black hover:text-dp-gray p-1"
                aria-label="Close review dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-[10px] tracking-[0.2em] uppercase text-dp-gray font-semibold">
                Customer Perspective
              </span>
              <h3 className="font-sans text-xl sm:text-2xl text-dp-black font-normal uppercase tracking-heading mt-1 mb-4">
                Share your experience
              </h3>

              {submitted ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-teal" />
                  <p className="font-sans text-lg text-dp-black uppercase tracking-tight">Thank you for sharing</p>
                  <p className="text-xs text-dp-gray">Your review has been recorded.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-dp-black mb-1.5 font-medium">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-dp-grayLight hover:text-dp-black focus:outline-none transition-colors"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-dp-black text-dp-black' : 'text-dp-border'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-dp-black mb-1.5 font-medium">
                      Your Name or Initials
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena M."
                      className="w-full bg-dp-offwhite border border-dp-border px-3.5 py-2.5 text-xs text-dp-black placeholder-dp-grayLight focus:border-dp-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-dp-black mb-1.5 font-medium">
                      Your Experience
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="How does The Serein Set feel in your hair routine?"
                      className="w-full bg-dp-offwhite border border-dp-border px-3.5 py-2.5 text-xs text-dp-black placeholder-dp-grayLight focus:border-dp-black focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 border border-dp-border text-xs text-dp-gray uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="dp-btn-black text-xs"
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
