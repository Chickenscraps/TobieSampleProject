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
      className="relative overflow-hidden bg-white"
    >
      {/* Full-width illustration — spans content area, aspect-ratio preserved */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <img
          src={heroIllustration.src}
          alt={heroIllustration.alt}
          width={heroIllustration.width}
          height={heroIllustration.height}
          className="w-full max-w-5xl mx-auto object-contain"
          fetchPriority="high"
          decoding="sync"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">

        {/* Text content — centred below illustration */}
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5 text-gray-900">
            2026 Tobie Benefits Guide
          </h1>

          <p
            className={`text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-6 transition-all duration-700 ease-out delay-150 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            At Tobie, we believe your benefits should support your well-being,
            your ambitions, your relationships and your routines &mdash; at every
            stage of life.
          </p>

          {/* Key dates */}
          <div
            className={`inline-flex items-center gap-2 bg-tobie-50 px-6 py-3 text-sm font-medium text-tobie-700 mb-8 transition-all duration-700 ease-out delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span>Open Enrollment: November 2025</span>
            <span className="text-tobie-300">|</span>
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
              className="w-full sm:w-auto px-8 py-3.5 bg-tobie-600 text-white font-bold hover:bg-tobie-700 transition-all duration-200"
            >
              Explore Your Benefits
            </button>
            <button
              onClick={() => scrollTo('#quick-links')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-tobie-700 font-semibold border border-tobie-200 hover:bg-tobie-50 transition-all duration-200"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
