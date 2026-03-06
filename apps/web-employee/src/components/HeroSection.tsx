'use client';

import { useEffect, useState } from 'react';

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after mount
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
      className="relative overflow-hidden bg-gradient-to-br from-tobie-700 via-tobie-800 to-tobie-900 text-white"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            2026 Tobie Benefits Guide
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl text-tobie-100 leading-relaxed max-w-2xl mx-auto mb-8 transition-all duration-700 ease-out delay-150 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            At Tobie, we believe your benefits should support your well-being,
            your ambitions, your relationships and your routines &mdash; at every
            stage of life.
          </p>

          {/* Key dates */}
          <div
            className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 text-sm font-medium text-tobie-100 mb-10 transition-all duration-700 ease-out delay-300 ${
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
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-tobie-700 font-semibold rounded-lg shadow-lg hover:bg-tobie-50 hover:shadow-xl transition-all duration-200"
            >
              Explore Your Benefits
            </button>
            <button
              onClick={() => scrollTo('#quick-links')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/25 hover:bg-white/20 transition-all duration-200"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V30C240 5 480 5 720 30C960 55 1200 55 1440 30V60H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
