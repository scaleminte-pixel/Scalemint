'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to Top"
      className="fixed bottom-7 right-7 z-50 w-12 h-12 rounded-full bg-[#0E0A22]/85 backdrop-blur-2xl border border-white/20 hover:border-purple-400/80 shadow-2xl shadow-purple-950/60 hover:shadow-purple-600/30 flex items-center justify-center text-white hover:text-purple-300 transition-all duration-300 hover:scale-110 active:scale-95 group ring-1 ring-white/10 animate-in fade-in zoom-in-75 duration-300"
    >
      {/* Specular Edge Highlight */}
      <span className="absolute inset-x-2 top-0.5 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Arrow Icon */}
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform text-gray-200 group-hover:text-white" />

      {/* Subtle pulsing outer ring */}
      <span className="absolute -inset-1 rounded-full border border-purple-500/20 group-hover:border-purple-500/50 animate-pulse pointer-events-none" />
    </button>
  );
}
