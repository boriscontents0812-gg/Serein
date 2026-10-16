import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider, useCart } from './context/CartContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroProduct } from './components/HeroProduct';
import { BenefitsStrip } from './components/BenefitsStrip';
import { ProductDetails } from './components/ProductDetails';
import { HowItWorks } from './components/HowItWorks';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQAccordion } from './components/FAQAccordion';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { StickyAddToCartBar } from './components/StickyAddToCartBar';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { CheckoutSection } from './components/CheckoutSection';

const StoreContent: React.FC = () => {
  const { openCart, setCheckoutNotice, clearCart, isCheckoutView } = useCart();
  const [confirmedSessionId, setConfirmedSessionId] = useState<string | null>(null);

  // Handle return from Stripe Checkout (success or cancelled)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const isSuccess = searchParams.get('success') === 'true';
      const sessionId = searchParams.get('session_id');
      const isCanceled = searchParams.get('canceled') === 'true';

      if (isSuccess && sessionId) {
        setConfirmedSessionId(sessionId);
        // Clear customer cart now that order was placed
        clearCart();
        // Clean URL to prevent re-triggering modal on reload
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      } else if (isCanceled) {
        // Customer returned without paying; preserve items and open cart with friendly notice
        setCheckoutNotice('Your checkout was cancelled. Your items have been safely saved in your bag.');
        openCart();
        // Clean URL
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      }
    } catch (err) {
      console.error('[CHECKOUT RETURN ERROR]', err);
    }
  }, [openCart, setCheckoutNotice, clearCart]);

  // If in dedicated checkout view (matching reference video)
  if (isCheckoutView) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] text-white flex flex-col font-sans transition-colors duration-300 selection:bg-[#EAA858] selection:text-black">
        <CheckoutSection onSuccessOrder={(id) => setConfirmedSessionId(id)} />
        {confirmedSessionId && (
          <OrderConfirmationModal
            sessionId={confirmedSessionId}
            onClose={() => setConfirmedSessionId(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white flex flex-col font-sans transition-colors duration-300 selection:bg-[#EAA858] selection:text-black">
      {/* Slim Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Luxury Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section with Product Gallery and Purchase Controls */}
        <HeroProduct />

        {/* Benefits Strip (4-Card Grid matching video) */}
        <BenefitsStrip />

        {/* Product Details Editorial & Included Set */}
        <ProductDetails />

        {/* How It Works (01-05 Visual Sequence) */}
        <HowItWorks />

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* Accessible FAQ Disclosures */}
        <FAQAccordion />

        {/* Checkout Section matching video reference */}
        <CheckoutSection onSuccessOrder={(id) => setConfirmedSessionId(id)} />
      </main>

      {/* Footer with brand story and newsletter */}
      <Footer />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Floating Add to Cart Conversion Bar */}
      <StickyAddToCartBar />

      {/* Order Confirmation Modal (after Stripe payment success) */}
      {confirmedSessionId && (
        <OrderConfirmationModal
          sessionId={confirmedSessionId}
          onClose={() => setConfirmedSessionId(null)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <StoreContent />
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;
