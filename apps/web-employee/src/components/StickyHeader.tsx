'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Quick Links', href: '#quick-links' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Understanding Benefits', href: '#understanding-benefits' },
  { label: 'Benefits Overview', href: '#benefits-overview' },
  { label: 'Medical Resources', href: '/medical-resources' },
  { label: 'Contact Info', href: '#contacts' },
];

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);

    if (href.startsWith('/')) {
      // Navigate to a different page
      return;
    }

    // Scroll to section
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${
        isScrolled ? 'border-b border-gray-200' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex-shrink-0"
          >
            <span className="text-2xl font-bold text-tobie-700 tracking-tight">
              Tobie
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (!link.href.startsWith('/')) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-tobie-500 hover:bg-tobie-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-tobie-500 hover:bg-tobie-50 transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-down">
          <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (!link.href.startsWith('/')) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }}
                className="block px-3 py-2.5 text-base font-medium text-gray-700 hover:text-tobie-500 hover:bg-tobie-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
