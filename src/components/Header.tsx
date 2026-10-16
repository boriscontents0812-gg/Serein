import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const { totalCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', href: '#product-hero' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Included', href: '#product-details' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 bg-[#0A0B0E]/90 dark:bg-[#0A0B0E]/90 backdrop-blur-md border-b border-white/5 ${
        isScrolled ? 'py-3.5 shadow-lg shadow-black/40' : 'py-4 sm:py-5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 flex items-center justify-between">
        
        {/* Left: Brand Logo & Mobile Trigger */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-neutral-300 hover:text-white p-1.5 -ml-1 transition-colors rounded-full hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          <a
            href="#"
            className="font-sans text-xl sm:text-2xl tracking-[0.25em] font-bold text-white hover:opacity-90 transition-opacity uppercase"
          >
            SEREIN
          </a>
        </div>

        {/* Center: Desktop Navigation Links (Centered as in video) */}
        <nav className="hidden md:flex items-center space-x-8 text-[11px] tracking-[0.18em] uppercase text-neutral-400 font-medium">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-white transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#EAA858] after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Theme Toggle & Shopping Bag */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle variant="header" />

          {/* Shopping Bag Button (matching the video's minimal bag trigger) */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-full bg-[#14171A] hover:bg-[#1B2024] border border-[#22282E] text-white hover:text-[#EAA858] transition-all group flex items-center justify-center cursor-pointer"
            aria-label={`Shopping bag with ${totalCount} items`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.8]" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#EAA858] to-[#D98E3A] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white dark:bg-[#141A1D] border-r border-border-light dark:border-border-dark h-full p-6 flex flex-col justify-between shadow-drawer animate-drawer-in">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-border-light dark:border-border-dark">
                <span className="font-sans text-xl tracking-[0.28em] text-ink-light dark:text-ink-dark uppercase">
                  SEREIN
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-ink-light dark:text-ink-dark p-1"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theme toggle inside mobile menu */}
              <div className="mt-6 flex items-center justify-between p-3 rounded-2xl bg-canvas-light dark:bg-[#1A2227] border border-border-light dark:border-border-dark">
                <span className="text-xs uppercase tracking-wider text-ink-lightMuted dark:text-ink-darkMuted font-medium">Appearance</span>
                <ThemeToggle variant="header" />
              </div>

              <div className="mt-8 flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm tracking-[0.18em] uppercase text-ink-light dark:text-ink-dark hover:text-teal font-normal transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border-light dark:border-border-dark text-xs text-ink-lightMuted dark:text-ink-darkMuted space-y-1">
              <p className="font-sans uppercase tracking-wider text-ink-light dark:text-ink-dark">The Serein Heatless Curl Set</p>
              <p className="text-[11px]">Quiet luxury heatless styling ritual.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
