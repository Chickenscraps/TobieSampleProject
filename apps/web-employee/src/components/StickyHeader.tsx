'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Quick Links', href: '#quick-links' },
  { label: 'Benefits', href: '#benefits-overview' },
  { label: 'Medical', href: '/medical-resources' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contacts', href: '#contacts' },
];

const ADMIN_DASHBOARD_URL = 'https://tobie-admin-dashboard.netlify.app';

export function StickyHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const sectionIds = navLinks
      .filter((l) => l.href.startsWith('#'))
      .map((l) => l.href.slice(1));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);

    if (href.startsWith('/')) {
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 72;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: 'smooth',
      });
    }
  };

  const isActive = (href: string) => {
    if (href.startsWith('#')) {
      return activeSection === href.slice(1);
    }
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.06)]'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <span className="text-xl font-bold text-tobie-700 tracking-tight">
              Tobie
            </span>
            <span className="hidden sm:inline text-xs font-medium text-gray-400 border-l border-gray-200 pl-2">
              Benefits 2026
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
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
                className={`relative px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'text-tobie-700'
                    : 'text-gray-500 hover:text-tobie-600'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-tobie-500" />
                )}
              </a>
            ))}

            <div className="w-px h-5 bg-gray-200 mx-2" />

            <a
              href={ADMIN_DASHBOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-down">
          <nav className="max-w-7xl mx-auto px-4 py-2">
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
                className={`block px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-tobie-700 bg-tobie-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </a>
            ))}

            <div className="border-t border-gray-100 mt-1 pt-1">
              <a
                href={ADMIN_DASHBOARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
