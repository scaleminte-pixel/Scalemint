'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Calendar } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import BookingModal from './BookingModal';
import HeroVisual from './HeroVisual';

interface HeroSectionProps {
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  ctaSecondaryText?: string | null;
  ctaSecondaryLink?: string | null;
  metadata?: any;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

export default function HeroSection({
  title = 'Engineered for High-Velocity Brand & Revenue Scale',
  subtitle = 'Scalemint is your 360° creative and digital growth partner. We unite strategic branding, conversion-focused web design, viral video editing, AI UGC, digital marketing, and precision Google Ads under one high-velocity squad.',
  ctaText = 'Book Strategy Call',
  ctaLink = '#contact',
  ctaSecondaryText = 'Explore Core Services',
  ctaSecondaryLink = '#services',
  metadata,
}: HeroSectionProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const badgeText = metadata?.badge || 'Accepting Select Q2/Q3 Growth Partners';
  const trustBadges: string[] = metadata?.trustBadges && metadata.trustBadges.length > 0
    ? metadata.trustBadges
    : ['100% Source Code & IP Ownership', 'Sprint Delivery Timelines', 'Strict Non-Disclosure Guarantee'];

  const orbitLabels: string[] = metadata?.orbitLabels && metadata.orbitLabels.length > 0
    ? metadata.orbitLabels
    : ['Branding', 'Web Dev', 'Video', 'Google Ads'];

  const livePill: string = metadata?.livePill || 'Select Q2/Q3 Production Slots Active · Direct Senior Squad Access';

  const defaultBento = [
    {
      eyebrow: 'Full-Stack Synergy',
      value: '360°',
      title: 'Core Capabilities',
      desc: 'Branding, Next.js code, viral video, and Google Ads unified under one senior squad.',
      accent: 'purple',
    },
    {
      eyebrow: 'Sprint Velocity',
      value: '100%',
      title: 'Focus & Execution',
      desc: 'Rigorous sprint delivery cadences with transparent milestones and asynchronous Slack updates.',
      accent: 'blue',
    },
    {
      eyebrow: 'Asset Security',
      value: '1 Squad',
      title: 'Creative Partner',
      desc: 'Strict enterprise NDAs and 100% full intellectual property transfer on all deliverables.',
      accent: 'emerald',
    },
  ];

  const bentoCards = metadata?.bentoCards && metadata.bentoCards.length > 0 ? metadata.bentoCards : defaultBento;

  return (
    <>
      <section className="relative pt-32 pb-10 lg:pt-36 lg:pb-12 overflow-hidden bg-grid-pattern noise-overlay">
        {/* Dynamic ambient gradient spheres */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-purple-700/15 blur-[150px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-blue-600/12 blur-[140px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[350px] h-[250px] bg-amber-600/8 blur-[120px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Status Badge */}
              <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/25 shadow-glow-purple/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>{badgeText}</span>
              </motion.div>

              {/* Main Executive Headline */}
              <motion.h1
                variants={fadeUp}
                transition={{ duration: 0.7 }}
                className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] font-extrabold text-white tracking-tight leading-[1.12]"
              >
                <span className="gradient-text-purple-blue">{title}</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
              >
                {subtitle}
              </motion.p>

              {/* Dual CTAs */}
              <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  type="button"
                  onClick={() => setBookingOpen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-heading font-bold text-sm sm:text-base bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-glow-purple hover:shadow-glow-blue flex items-center justify-center gap-2.5 group transition-all transform hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{ctaText || 'Book Strategy Call'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  href={ctaSecondaryLink || '#services'}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-heading font-semibold text-sm sm:text-base text-gray-200 hover:text-white bg-agency-card hover:bg-agency-cardHover border border-agency-border hover:border-purple-500/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>{ctaSecondaryText || 'Explore Core Services'}</span>
                </Link>
              </motion.div>

              {/* Dynamic Trust Badges */}
              <motion.div variants={fadeIn} transition={{ duration: 0.8, delay: 0.5 }} className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-7 text-xs text-gray-300 font-medium">
                {trustBadges.map((badge, idx) => {
                  const colors = ['text-purple-400', 'text-blue-400', 'text-emerald-400', 'text-amber-400'];
                  const color = colors[idx % colors.length];
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${color}`} />
                      <span>{badge}</span>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right Column: 3D Animated Visual with dynamic orbitLabels */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="hidden lg:flex lg:col-span-5 items-center justify-center"
            >
              <HeroVisual orbitLabels={orbitLabels} />
            </motion.div>
          </div>

          {/* Executive Telemetry Bento Deck */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 sm:mt-16 max-w-5xl mx-auto relative"
          >
            {/* Ambient radiant glow behind the deck */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-indigo-600/15 to-blue-600/20 blur-3xl -z-10 rounded-3xl" />

            {/* Live Status Pill */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] text-gray-300 border border-white/[0.08] shadow-sm backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] text-gray-300 font-medium tracking-wide">
                  {livePill}
                </span>
              </div>
            </div>

            {/* Dynamic Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {bentoCards.map((card: any, idx: number) => {
                const borderHover = idx === 0 ? 'hover:border-purple-500/50' : idx === 1 ? 'hover:border-blue-500/50' : 'hover:border-emerald-500/50';
                const tagColor = idx === 0 ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : idx === 1 ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

                return (
                  <div
                    key={idx}
                    className={`group rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] ${borderHover} transition-all duration-300 backdrop-blur-xl shadow-lg relative overflow-hidden flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md border ${tagColor}`}>
                          {card.eyebrow || 'Specialized Capability'}
                        </span>
                      </div>
                      <AnimatedCounter
                        value={card.value || '360°'}
                        className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight"
                      />
                      <h4 className="text-sm font-bold text-gray-200 mt-2">
                        {card.title || 'Core Service'}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                      {card.desc || ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}
