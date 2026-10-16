import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Menu, X, Search, Heart, ChevronDown } from 'lucide-react';
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
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Our Story', href: '#product-details' },
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
      className={`sticky top-0 z-40 w-full transition-all duration-300 bg-white/95 dark:bg-[#0D1012]/95 backdrop-blur-md border-b border-border-light dark:border-border-dark ${
        isScrolled ? 'py-3.5 shadow-sm dark:shadow-black/50' : 'py-4 sm:py-5'
      }`}
    >
      <div className="max-w-[1520px] mx-auto px-5 sm:px-8 flex items-center justify-between">
        
        {/* Left: Brand Logo & Mobile Trigger */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-ink-light dark:text-ink-dark p-1.5 -ml-1 hover:text-teal transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>

          <a
            href="#"
            className="font-sans text-2xl sm:text-3xl tracking-[0.28em] font-normal text-ink-light dark:text-ink-dark hover:opacity-80 transition-opacity uppercase"
          >
            SEREIN
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-[12px] tracking-[0.16em] uppercase text-ink-light dark:text-ink-dark ml-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="hover:text-teal dark:hover:text-teal transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-teal after:transition-all after:duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Theme Toggle & Utilities */}
        <div className="flex items-center space-x-4 sm:space-x-5 text-xs tracking-wider uppercase text-ink-light dark:text-ink-dark">
          
          {/* Light / Dark Mode Pill Toggle */}
          <ThemeToggle variant="header" />

          <button
            onClick={() => {
              const target = document.querySelector('#product-hero');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:flex items-center space-x-1.5 hover:text-teal transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
            <span className="text-[11px] hidden lg:inline tracking-[0.14em]">Search</span>
          </button>

          <button
            onClick={() => alert("Added to your Serein wishlist.")}
            className="hidden sm:block hover:text-teal transition-colors p-1"
            aria-label="Wishlist"
          >
            <Heart className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Shopping Bag Button */}
          <button
            onClick={openCart}
            className="flex items-center space-x-2 text-ink-light dark:text-ink-dark hover:text-teal transition-colors p-1 group"
            aria-label={`Shopping bag with ${totalCount} items`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-teal text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium tracking-[0.16em] hidden sm:inline">
              Bag ({totalCount})
            </span>
          </button>

          {/* Currency dropdown placeholder */}
          <div className="hidden lg:flex items-center space-x-1 text-[11px] font-medium text-ink-lightMuted dark:text-ink-darkMuted cursor-pointer hover:text-teal transition-colors pl-2 border-l border-border-light dark:border-border-dark">
            <span>USD</span>
            <ChevronDown className="w-3 h-3" />
          </div>

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
