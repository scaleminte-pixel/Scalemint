'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowUpRight, Zap, ChevronLeft, ChevronRight, Activity, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  slug: string;
  title: string;
  clientName?: string | null;
  shortDesc: string;
  results?: string | null;
  servicesUsed?: string | null;
  category?: { name: string; slug: string } | null;
  coverMedia?: { publicUrl: string } | null;
}

interface WebShowcaseProps {
  projects: Project[];
}

const webImages: Record<string, string> = {
  'apex-ventures-nextjs-14-flagship': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
  'pulse-headless-d2c-storefront': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  'zenflow-ai-cloud-platform': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  'horizon-enterprise-web-portal': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop',
  'elevate-studios-creative-hub': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  'cloudscale-technical-documentation': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
};

const webUrls: Record<string, string> = {
  'apex-ventures-nextjs-14-flagship': 'https://apexventures.io/flagship',
  'pulse-headless-d2c-storefront': 'https://pulsecommerce.com/storefront',
  'zenflow-ai-cloud-platform': 'https://zenflow.ai/platform',
  'horizon-enterprise-web-portal': 'https://horizoncloud.net/enterprise',
  'elevate-studios-creative-hub': 'https://elevatestudios.co/work',
  'cloudscale-technical-documentation': 'https://cloudscale.dev/docs',
};

const projectMetrics: Record<string, { speed: string; metric: string; tech: string[] }> = {
  'apex-ventures-nextjs-14-flagship': {
    speed: '0.4s LCP',
    metric: '+180% Pipeline Velocity',
    tech: ['Next.js 14 App Router', 'TailwindCSS', 'Framer Motion', 'Vercel Edge'],
  },
  'pulse-headless-d2c-storefront': {
    speed: '0.3s TTFB',
    metric: '+48% Checkout Conversion',
    tech: ['Shopify Storefront API', 'React Server Components', 'Radix UI', 'Cloudflare'],
  },
  'zenflow-ai-cloud-platform': {
    speed: '0.5s Load',
    metric: '4.2x Daily Active Users',
    tech: ['Next.js 14', 'TypeScript', 'TailwindCSS', 'Prisma ORM'],
  },
  'horizon-enterprise-web-portal': {
    speed: '99/100 Mobile',
    metric: '-65% Server Latency',
    tech: ['Turbopack', 'TailwindCSS', 'Framer Motion', 'AWS Amplify'],
  },
  'elevate-studios-creative-hub': {
    speed: '0.4s FCP',
    metric: '+210% Inbound Inquiries',
    tech: ['Next.js 14', 'GSAP Animation', 'TailwindCSS', 'Vercel Pro'],
  },
  'cloudscale-technical-documentation': {
    speed: '0.2s Instant Search',
    metric: '100% Core Web Vitals',
    tech: ['MDX v3', 'Next.js 14', 'TailwindCSS', 'Algolia DocSearch'],
  },
};

export default function WebShowcase({ projects }: WebShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentIndex] || projects[0];
  const currentImg =
    currentProject?.coverMedia?.publicUrl ||
    webImages[currentProject?.slug] ||
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop';
  const currentUrl = webUrls[currentProject?.slug] || 'https://scalemint.io/production';
  const currentMeta = currentProject
    ? projectMetrics[currentProject.slug] || {
        speed: '0.4s LCP',
        metric: '+140% Conversion Growth',
        tech: ['Next.js 14', 'TailwindCSS', 'Framer Motion', 'TypeScript'],
      }
    : null;

  return (
    <section id="websites-section" className="py-14 sm:py-16 relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#050817] via-[#090E26] to-[#050817]">
      {/* Ambient Electric Blue Glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[350px] bg-blue-600/[0.08] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[300px] bg-indigo-600/[0.08] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with clear category & title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/25 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>THEME 02 · DIGITAL PRODUCT LAB & NEXT.JS EXPERIENCES</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Sub-Second Flagships Engineered For <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">Conversion</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Every website is built with Next.js 14, React Server Components, and Apple-grade micro-interactions. Zero templates, 99+ Core Web Vitals, and direct enterprise ROI.
            </p>
          </div>

          {/* Quick Navigation Arrows */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={prevSlide}
              aria-label="Previous Project"
              className="w-10 h-10 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Project"
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clean, Readable Project Selector Tabs (Spacious & Modern) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {projects.map((p, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={p.id}
                onClick={() => setCurrentIndex(idx)}
                className={`px-4 py-2.5 rounded-full text-xs font-heading font-semibold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02] border border-blue-400'
                    : 'bg-white/[0.04] text-gray-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-400'}`} />
                <span>{p.clientName || `Flagship 0${idx + 1}`}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive macOS Stage & Intel Grid */}
        <AnimatePresence mode="wait">
          {currentProject && (
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6"
            >
              {/* Left Column: Interactive macOS Safari Mockup Stage (7 cols) */}
              <div className="lg:col-span-7 rounded-3xl border border-blue-500/30 bg-[#070A18]/95 shadow-[0_0_50px_-15px_rgba(59,130,246,0.25)] overflow-hidden backdrop-blur-2xl flex flex-col justify-between">
                {/* Safari Chrome Header */}
                <div className="px-5 py-3.5 bg-[#0A0E22] border-b border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                  </div>

                  {/* Browser Address Bar */}
                  <div className="flex-1 max-w-sm mx-auto px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-mono text-gray-300 flex items-center justify-center gap-2 truncate">
                    <span className="text-emerald-400 text-[11px]">🔒</span>
                    <span className="truncate">{currentUrl}</span>
                  </div>

                  {/* Lighthouse Badge */}
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>99 Lighthouse</span>
                  </div>
                </div>

                {/* High-Fidelity Website Viewport */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/50 group">
                  <img
                    src={currentImg}
                    alt={currentProject.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070A18] via-transparent to-transparent opacity-60" />

                  {/* Floating Link Badge */}
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-white hover:text-black transition-all shadow-lg"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: Project Intel & Commercial Metrics (5 cols) */}
              <div className="lg:col-span-5 rounded-3xl border border-blue-500/25 bg-gradient-to-b from-[#09112B] to-[#060A1D] p-6 sm:p-8 backdrop-blur-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Category & Client Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
                      {currentProject.clientName || 'Scalemint Flagship'}
                    </span>
                    <span className="text-xs font-mono text-gray-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.08]">
                      Production Ready
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                    {currentProject.title}
                  </h3>

                  <p className="text-gray-300 text-sm leading-relaxed">
                    {currentProject.shortDesc} Built with sub-second page transitions, full responsive fidelity across mobile and desktop, and zero technical debt.
                  </p>

                  {/* Performance Metrics Cards */}
                  {currentMeta && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-black/40 border border-blue-500/20 space-y-1">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Activity className="w-3 h-3 text-blue-400" />
                          <span>Core Web Vitals</span>
                        </span>
                        <div className="font-heading font-black text-xl text-blue-300">
                          {currentMeta.speed}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-1">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-400" />
                          <span>Verified Output</span>
                        </span>
                        <div className="font-heading font-black text-xl text-emerald-300">
                          {currentMeta.metric}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tech Stack Chips */}
                  {currentMeta && (
                    <div className="pt-2">
                      <span className="text-[11px] font-mono text-gray-400 block mb-2">Tech Architecture:</span>
                      <div className="flex flex-wrap gap-2">
                        {currentMeta.tech.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono text-gray-300 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.08]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom CTA Button */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <Link
                    href="/services/website-design"
                    className="w-full py-3.5 px-6 rounded-2xl font-heading font-bold text-xs bg-white text-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-xl"
                  >
                    <span>Initiate Website Design Sprint</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
