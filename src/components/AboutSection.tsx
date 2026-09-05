'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';
import AnimatedCounter from './AnimatedCounter';

export default function AboutSection() {
  return (
    <section id="about" className="py-14 sm:py-16 relative overflow-hidden bg-agency-surface/35 border-t border-agency-border/60">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[300px] bg-purple-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Story & Positioning */}
          <AnimateOnScroll variant="fadeLeft" duration={0.8} className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Who We Are & Why We Exist</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              One High-Velocity Partner For Ambitious Business Leaders
            </h2>

            <p className="text-gray-300 text-base leading-relaxed">
              Most digital agencies fracture your brand across isolated teams: designers who do not understand conversion, developers who do not care about aesthetics, and media buyers who blame creatives for ad performance.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed">
              Scalemint was engineered to eliminate this disconnect. We provide enterprise founders, high-growth startups, and established companies with a <strong className="text-white">single unified 360° creative and performance squad</strong> where your visual prestige, Next.js tech architecture, and customer acquisition funnels work in perfect synergy.
            </p>

            {/* Credibility Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { text: 'Zero Corporate Bloat', color: 'text-purple-400' },
                { text: 'Direct Access to Principals', color: 'text-blue-400' },
                { text: 'Full Source Code & IP Ownership', color: 'text-emerald-400' },
                { text: 'Predictable Sprint Timelines', color: 'text-amber-400' },
              ].map((item, i) => (
                <AnimateOnScroll key={i} variant="fadeUp" delay={0.1 * i} duration={0.5}>
                  <div className="flex items-center gap-2.5 text-xs text-gray-200 font-medium">
                    <CheckCircle2 className={`w-4 h-4 ${item.color} shrink-0`} />
                    <span>{item.text}</span>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Right Column: Visual Metrics Card */}
          <AnimateOnScroll variant="fadeRight" duration={0.8} delay={0.2} className="lg:col-span-6">
            <div className="relative rounded-2xl p-1 bg-gradient-to-tr from-purple-500/30 via-indigo-500/20 to-blue-500/30 shadow-2xl animate-border-glow">
              <div className="rounded-2xl bg-agency-dark/95 border border-agency-border/80 p-8 sm:p-10 space-y-8">
                <div>
                  <span className="text-xs uppercase tracking-widest text-purple-400 font-bold block">
                    Our Operating Standards
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-white mt-1">
                    Engineered for Absolute Commercial Impact
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: '360°', desc: 'Full Spectrum Synergy (Brand + Code + Media)', color: 'border-purple-500' },
                    { value: '95+', desc: 'Google Core Web Vitals Performance Standard', color: 'border-blue-500' },
                    { value: '100%', desc: 'Confidentiality & Exclusive Category Rights', color: 'border-amber-500' },
                    { value: '24h', desc: 'Rapid Strategic Onboarding & Sprint Kickoff', color: 'border-emerald-500' },
                  ].map((stat, i) => (
                    <AnimateOnScroll key={i} variant="scaleUp" delay={0.3 + i * 0.1} duration={0.5}>
                      <div className={`space-y-1.5 border-l-2 ${stat.color} pl-4`}>
                        <AnimatedCounter value={stat.value} className="font-heading text-3xl font-black text-white" />
                        <p className="text-xs text-gray-400 font-medium">{stat.desc}</p>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>

                <AnimateOnScroll variant="fadeUp" delay={0.6}>
                  <div className="p-4 rounded-xl bg-agency-card/70 border border-agency-border flex items-center gap-3.5">
                    <ShieldCheck className="w-6 h-6 text-purple-400 shrink-0" />
                    <p className="text-xs text-gray-300 leading-snug">
                      Strict enterprise non-disclosure agreements (NDAs) standard for all client engagements.
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
