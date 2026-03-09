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
      className="relative overflow-hidden bg-gradient-to-br from-tobie-700 via-tobie-800 to-tobie-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 py-12 sm:py-16 lg:py-10">
          {/* Text content — left side */}
          <div
            className={`flex-1 text-center lg:text-left transition-all duration-700 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight mb-4 text-white">
              2026 Tobie Benefits Guide
            </h1>

            <p
              className={`text-base sm:text-lg lg:text-xl text-tobie-100 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-5 transition-all duration-700 ease-out delay-150 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              At Tobie, we believe your benefits should support your well-being,
              your ambitions, your relationships and your routines &mdash; at every
              stage of life.
            </p>

            {/* Key dates */}
            <div
              className={`inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white mb-6 transition-all duration-700 ease-out delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <span>Open Enrollment: November 2026</span>
              <span className="text-white/50">|</span>
              <span>Coverage Effective: January 1, 2026</span>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 transition-all duration-700 ease-out delay-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <button
                onClick={() => scrollTo('#benefits-overview')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-tobie-700 font-bold hover:bg-tobie-50 btn-press"
              >
                Explore Your Benefits
              </button>
              <button
                onClick={() => scrollTo('#quick-links')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 text-white font-semibold border border-white/30 hover:bg-white/20 backdrop-blur-sm btn-press"
              >
                Enroll Now
              </button>
            </div>
          </div>

          {/* Hero illustration — right side, visible on md+ */}
          <div
            className={`flex-shrink-0 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl transition-all duration-700 ease-out delay-200 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <img
              src={heroIllustration.src}
              alt={heroIllustration.alt}
              width={heroIllustration.width}
              height={heroIllustration.height}
              className="w-full h-auto drop-shadow-2xl"
              fetchPriority="high"
              decoding="sync"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
