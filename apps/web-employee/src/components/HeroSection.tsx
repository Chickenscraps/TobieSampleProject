'use client';

import { useEffect, useState } from 'react';
import { heroIllustration } from '@/lib/image-manifest';

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.querySelector(id);
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
    <section
      id="hero"
      className="relative overflow-hidden min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center"
    >
      {/* Background image — full fill */}
      <img
        src={heroIllustration.src}
        alt=""
        width={heroIllustration.width}
        height={heroIllustration.height}
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        decoding="sync"
        aria-hidden="true"
      />

      {/* Branded gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-tobie-700/80 via-tobie-600/65 to-tobie-500/50" />

      {/* Text content — centred on top of background */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5 text-white">
            2026 Tobie Benefits Guide
          </h1>

          <p
            className={`text-lg sm:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto mb-6 transition-all duration-700 ease-out delay-150 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            At Tobie, we believe your benefits should support your well-being,
            your ambitions, your relationships and your routines, at every
            stage of life.
          </p>

          {/* Key dates */}
          <div
            className={`inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-6 py-3 text-sm font-medium text-white mb-8 transition-all duration-700 ease-out delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span>Open Enrollment: November 2026</span>
            <span className="text-white/50">|</span>
            <span>Coverage Effective: January 1, 2026</span>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <button
              onClick={() => scrollTo('#benefits-overview')}
              className="w-full sm:w-auto px-8 py-3.5 btn-accent"
            >
              Explore Your Benefits
            </button>
            <button
              onClick={() => scrollTo('#quick-links')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 text-white font-semibold border border-white/30 hover:bg-white/20 dark:bg-white/15 dark:border-white/25 dark:hover:bg-white/25 backdrop-blur-sm btn-press"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
