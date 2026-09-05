'use client';

import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import LeadForm from './LeadForm';

interface ContactCTAProps {
  title?: string | null;
  subtitle?: string | null;
}

export default function ContactCTA({
  title = 'Scale Your Brand With a Dedicated Creative Squad',
  subtitle = 'Stop coordinating between multiple disconnected freelancers. Get a unified creative and growth team working on your brand today.',
}: ContactCTAProps) {
  return (
    <section className="py-14 sm:py-16 relative overflow-hidden bg-agency-surface/40 border-t border-agency-border/60">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 gradient-line" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Conversion Pitch */}
          <AnimateOnScroll variant="fadeLeft" duration={0.8} className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <span>Direct Partner Inquiries</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              {subtitle}
            </p>

            <div className="space-y-4 pt-4 text-sm text-gray-300">
              {[
                { text: 'Direct discovery consultation with a Principal Strategist', color: 'bg-purple-500/20 text-purple-400' },
                { text: 'Transparent sprint scope with zero hidden costs', color: 'bg-blue-500/20 text-blue-400' },
                { text: 'Guaranteed delivery timelines backed by dedicated squad', color: 'bg-emerald-500/20 text-emerald-400' },
              ].map((item, i) => (
                <AnimateOnScroll key={i} variant="fadeLeft" delay={0.2 + i * 0.1} duration={0.5}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full ${item.color} flex items-center justify-center font-bold text-xs`}>
                      ✓
                    </div>
                    <span>{item.text}</span>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Right Column: High-Converting Lead Form */}
          <AnimateOnScroll variant="fadeRight" duration={0.8} delay={0.2} className="lg:col-span-7">
            <LeadForm />
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
