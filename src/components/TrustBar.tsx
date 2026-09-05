'use client';

import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

export default function TrustBar() {
  return (
    <AnimateOnScroll variant="fadeIn" duration={0.8}>
      <section className="py-10 border-y border-agency-border/60 bg-agency-surface/30 relative overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-xs uppercase tracking-widest text-purple-400 font-bold block">
                360° Full-Spectrum Agency
              </span>
              <p className="text-sm text-gray-300 mt-0.5 font-medium">
                Engineered for serious founders, enterprise leaders, and scaling brands.
              </p>
            </div>

            {/* Verified Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-gray-300 text-xs sm:text-sm font-semibold">
              {[
                { label: 'Branding Identity', color: 'bg-purple-500 shadow-[0_0_10px_rgba(124,58,237,0.5)]' },
                { label: 'Next.js Flagships', color: 'bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]' },
                { label: 'Viral Video & AI UGC', color: 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' },
                { label: 'Google Ads & ROAS', color: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}
