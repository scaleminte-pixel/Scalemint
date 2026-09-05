'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ThumbsUp, MessageCircle, MoreHorizontal, Globe, ShieldCheck, ArrowUpRight, TrendingUp, Sparkles, CheckCircle2, Zap } from 'lucide-react';
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

interface MetaAdsShowcaseProps {
  projects?: Project[];
}

interface MetaCampaign {
  id: string;
  tabLabel: string;
  clientName: string;
  handle: string;
  avatarText: string;
  primaryText: string;
  headline: string;
  description: string;
  ctaText: string;
  websiteDisplay: string;
  mediaImage: string;
  likes: string;
  comments: string;
  shares: string;
  roas: string;
  roasMultiplier: number;
  cpa: string;
  ctr: string;
  hookVariantA: {
    name: string;
    thumbstop: string;
    ctr: string;
    roas: string;
    isWinner: boolean;
  };
  hookVariantB: {
    name: string;
    thumbstop: string;
    ctr: string;
    roas: string;
    isWinner: boolean;
  };
}

const metaCampaigns: MetaCampaign[] = [
  {
    id: 'd2c-commerce',
    tabLabel: 'E-Commerce & D2C',
    clientName: 'Pulse D2C Commerce',
    handle: '@pulsecommerce',
    avatarText: 'PD',
    primaryText: 'Tired of generic office chairs that collapse after 6 months? 🪑 Meet the Italian Nappa Leather Ergonomic Flagship engineered for 12+ hour deep work. Free white-glove delivery + 100-day in-home risk-free trial.',
    headline: 'Handcrafted Ergonomic Seating — 100-Day Risk-Free Trial',
    description: 'Over 4,200 verified 5-star executive reviews worldwide.',
    ctaText: 'Shop Now',
    websiteDisplay: 'PULSECOMMERCE.COM',
    mediaImage: 'https://images.unsplash.com/photo-1580481077197-9e2954ca9345?q=80&w=1200&auto=format&fit=crop',
    likes: '3.4K',
    comments: '412',
    shares: '680',
    roas: '6.4x ROAS',
    roasMultiplier: 6.4,
    cpa: '$14.20 CPA',
    ctr: '4.8% CTR',
    hookVariantA: {
      name: 'Hook 01: Stress Test Pattern Interrupt',
      thumbstop: '51.2%',
      ctr: '4.8%',
      roas: '6.4x',
      isWinner: true,
    },
    hookVariantB: {
      name: 'Hook 02: Standard Studio Product Spin',
      thumbstop: '26.4%',
      ctr: '1.9%',
      roas: '2.8x',
      isWinner: false,
    },
  },
  {
    id: 'b2b-saas-funnel',
    tabLabel: 'B2B SaaS & PLG',
    clientName: 'ZenFlow AI Systems',
    handle: '@zenflow.ai',
    avatarText: 'ZF',
    primaryText: 'Engineering leaders at Fortune 500 companies are eliminating 14+ hours of weekly DevOps firefighting with autonomous cloud infrastructure orchestration. Get our enterprise architectural teardown 👇',
    headline: 'Automate 80% of Cloud Incidents — Enterprise Whitepaper',
    description: 'SOC2 Type II Certified. Zero agent overhead.',
    ctaText: 'Download Guide',
    websiteDisplay: 'ZENFLOW.AI/ENTERPRISE',
    mediaImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    likes: '1.8K',
    comments: '235',
    shares: '390',
    roas: '5.2x Pipeline ROAS',
    roasMultiplier: 5.2,
    cpa: '$46 MQL',
    ctr: '3.9% CTR',
    hookVariantA: {
      name: 'Hook 01: "Why We Fired Our Kubernetes Team" (Contrarian)',
      thumbstop: '48.9%',
      ctr: '4.2%',
      roas: '5.2x',
      isWinner: true,
    },
    hookVariantB: {
      name: 'Hook 02: Feature List Slideshow',
      thumbstop: '22.1%',
      ctr: '1.4%',
      roas: '1.8x',
      isWinner: false,
    },
  },
  {
    id: 'luxury-health',
    tabLabel: 'Health & Aesthetics',
    clientName: 'Lumina Longevity Care',
    handle: '@luminahealth',
    avatarText: 'LH',
    primaryText: 'True cellular regeneration starts beneath the skin. Our clinical biomarker protocol has helped 12,000+ high-performers optimize sleep architecture and mitochondrial efficiency.',
    headline: 'Clinical Longevity Biomarker Assessment — Book Online',
    description: 'Precision medical diagnostics delivered to your doorstep.',
    ctaText: 'Book Assessment',
    websiteDisplay: 'LUMINAHEALTH.COM',
    mediaImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
    likes: '2.9K',
    comments: '380',
    shares: '495',
    roas: '5.8x ROAS',
    roasMultiplier: 5.8,
    cpa: '$22 Intake CPA',
    ctr: '4.4% CTR',
    hookVariantA: {
      name: 'Hook 01: Doctor Explains Biomarker Lab Results',
      thumbstop: '53.6%',
      ctr: '4.6%',
      roas: '5.8x',
      isWinner: true,
    },
    hookVariantB: {
      name: 'Hook 02: Stock Medical Imagery',
      thumbstop: '18.4%',
      ctr: '1.1%',
      roas: '1.6x',
      isWinner: false,
    },
  },
  {
    id: 'venture-dealflow',
    tabLabel: 'Venture & Capital',
    clientName: 'Apex Capital Partners',
    handle: '@apexventures',
    avatarText: 'AC',
    primaryText: 'We back pre-seed and Series A founders engineering autonomous software and quantum systems. Founders receive direct partner access and $2M to $15M checks within 14 days of term sheet.',
    headline: 'Apex Founder Syndicate — 2026 Dealflow Intake',
    description: 'Explore our portfolio and submit your deck directly to partners.',
    ctaText: 'Apply Now',
    websiteDisplay: 'APEXVENTURES.IO',
    mediaImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
    likes: '2.2K',
    comments: '194',
    shares: '310',
    roas: '6.0x Deal ROAS',
    roasMultiplier: 6.0,
    cpa: '140+ Founder Leads',
    ctr: '3.7% CTR',
    hookVariantA: {
      name: 'Hook 01: Partner Teardown of Winning Pitch Deck',
      thumbstop: '46.7%',
      ctr: '3.9%',
      roas: '6.0x',
      isWinner: true,
    },
    hookVariantB: {
      name: 'Hook 02: Corporate Logo Graphic',
      thumbstop: '19.8%',
      ctr: '1.2%',
      roas: '1.9x',
      isWinner: false,
    },
  },
];

export default function MetaAdsShowcase({ projects }: MetaAdsShowcaseProps) {
  const campaigns: MetaCampaign[] = (projects && projects.length > 0)
    ? projects.map((p, idx) => {
        const fallback = metaCampaigns[idx % metaCampaigns.length];
        return {
          ...fallback,
          id: p.id || p.slug || fallback.id,
          tabLabel: p.title || fallback.tabLabel,
          clientName: p.clientName || fallback.clientName,
          primaryText: p.shortDesc || fallback.primaryText,
          headline: p.title || fallback.headline,
          mediaImage: p.coverMedia?.publicUrl || fallback.mediaImage,
          roas: p.results || fallback.roas,
        };
      })
    : metaCampaigns;

  const [activeTab, setActiveTab] = useState<string>(campaigns[0]?.id || metaCampaigns[0].id);

  const activeCampaign =
    campaigns.find((c) => c.id === activeTab) || campaigns[0] || metaCampaigns[0];

  return (
    <section
      id="meta-ads-section"
      className="py-16 sm:py-20 relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#050B16] via-[#091529] to-[#050B16]"
    >
      {/* Ambient Meta Blue & Indigo Glow */}
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[350px] bg-blue-600/[0.08] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[300px] bg-indigo-600/[0.08] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/25 shadow-sm">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>THEME 05 · META (FACEBOOK & INSTAGRAM) GROWTH SUITE</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Social Ad Systems &{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Algorithmic Scale
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Fusing thumb-stopping visual UGC, Advantage+ audience scaling, and first-party Conversions API (CAPI) tracking to beat iOS signal loss and generate predictable commercial ROAS.
            </p>
          </div>

          <Link
            href="/services/digital-marketing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 hover:border-blue-400 transition-all shrink-0 active:scale-95"
          >
            <span>Explore Meta Sprint</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Industry Campaign Switcher */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {campaigns.map((camp) => {
            const isSelected = camp.id === activeTab;
            return (
              <button
                key={camp.id}
                onClick={() => setActiveTab(camp.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-heading font-bold whitespace-nowrap transition-all flex items-center gap-2.5 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02] border border-blue-400'
                    : 'bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-400'}`} />
                <span>{camp.tabLabel}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-blue-300'}`}>
                  {camp.clientName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Growth Engine Stage: Left = Realistic Facebook Post, Right = Hook Testing & CAPI */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCampaign.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6"
          >
            {/* Left: Realistic Facebook Sponsored Post Simulation (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-blue-500/30 bg-[#08101E]/95 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(37,99,235,0.25)] flex flex-col justify-between space-y-4">
              <div>
                {/* Meta Sponsored Post Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                      {activeCampaign.avatarText}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading font-bold text-white text-sm">
                          {activeCampaign.clientName}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-current" />
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                        <span>Sponsored</span>
                        <span>·</span>
                        <Globe className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white p-1">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Post Copy */}
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-4">
                  {activeCampaign.primaryText}
                </p>

                {/* Sponsored Ad Creative Card */}
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/60 group">
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={activeCampaign.mediaImage}
                      alt={activeCampaign.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-600 text-white shadow-md">
                      Meta Verified Creative
                    </span>
                  </div>

                  {/* Ad Link Banner & Call to Action */}
                  <div className="p-4 bg-[#0A1324] flex items-center justify-between gap-4 border-t border-white/[0.06]">
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider truncate">
                        {activeCampaign.websiteDisplay}
                      </div>
                      <h4 className="font-heading font-bold text-white text-xs sm:text-sm truncate">
                        {activeCampaign.headline}
                      </h4>
                      <p className="text-[11px] text-gray-400 truncate">
                        {activeCampaign.description}
                      </p>
                    </div>

                    <button className="px-4 py-2 rounded-xl text-xs font-heading font-bold bg-blue-600 hover:bg-blue-500 text-white shrink-0 transition-colors shadow-md">
                      {activeCampaign.ctaText}
                    </button>
                  </div>
                </div>

                {/* Facebook Social Engagement Bar */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.08] text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-1">
                      <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">👍</span>
                      <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">❤️</span>
                    </div>
                    <span>{activeCampaign.likes}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span>{activeCampaign.comments} Comments</span>
                    <span>{activeCampaign.shares} Shares</span>
                  </div>
                </div>
              </div>

              {/* Bottom Meta CAPI Status Badge */}
              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Meta Conversions API (CAPI) Event Quality: 9.8/10</span>
                </span>
                <span className="text-[11px] text-emerald-400">
                  ● Advantage+ Auto-Targeting
                </span>
              </div>
            </div>

            {/* Right: Creative Hook Testing Matrix & ROAS Gauges (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-blue-500/30 bg-gradient-to-b from-[#0B1830] to-[#060D1A] p-6 sm:p-7 backdrop-blur-2xl flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                    Creative Hook A/B Test
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Active Sprint
                  </span>
                </div>

                {/* Hook Comparison Matrix */}
                <div className="space-y-2.5">
                  {/* Winning Variant A */}
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-400/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-heading font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {activeCampaign.hookVariantA.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        WINNER (+140% ROAS)
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                      <div className="bg-black/40 p-2 rounded-xl">
                        <div className="text-[9px] text-gray-400">Thumbstop</div>
                        <div className="text-xs font-bold text-blue-300">{activeCampaign.hookVariantA.thumbstop}</div>
                      </div>
                      <div className="bg-black/40 p-2 rounded-xl">
                        <div className="text-[9px] text-gray-400">Outbound CTR</div>
                        <div className="text-xs font-bold text-cyan-300">{activeCampaign.hookVariantA.ctr}</div>
                      </div>
                      <div className="bg-black/40 p-2 rounded-xl">
                        <div className="text-[9px] text-gray-400">Blended ROAS</div>
                        <div className="text-xs font-bold text-emerald-400">{activeCampaign.hookVariantA.roas}</div>
                      </div>
                    </div>
                  </div>

                  {/* Losing Variant B */}
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 space-y-2 opacity-70">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-heading font-bold text-gray-300">
                        {activeCampaign.hookVariantB.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-400">
                        KILLED AT 48H
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                      <div className="bg-black/40 p-2 rounded-xl">
                        <div className="text-[9px] text-gray-500">Thumbstop</div>
                        <div className="text-xs font-bold text-gray-400">{activeCampaign.hookVariantB.thumbstop}</div>
                      </div>
                      <div className="bg-black/40 p-2 rounded-xl">
                        <div className="text-[9px] text-gray-500">Outbound CTR</div>
                        <div className="text-xs font-bold text-gray-400">{activeCampaign.hookVariantB.ctr}</div>
                      </div>
                      <div className="bg-black/40 p-2 rounded-xl">
                        <div className="text-[9px] text-gray-500">Blended ROAS</div>
                        <div className="text-xs font-bold text-gray-400">{activeCampaign.hookVariantB.roas}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Macro ROAS Card */}
                <div className="p-4 rounded-2xl bg-black/50 border border-blue-500/20 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase">
                    <span>Meta Blended Return on Ad Spend</span>
                    <span className="text-blue-400 font-bold">Audience: Advantage+</span>
                  </div>
                  <div className="font-heading text-3xl font-black text-blue-400">
                    {activeCampaign.roas}
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (activeCampaign.roasMultiplier / 8) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee CTA */}
              <div className="pt-4 border-t border-white/[0.06] space-y-3">
                <div className="text-center text-xs font-mono text-blue-300">
                  100% Client-Owned Meta Ad Accounts & Zero Retainer Lock-in
                </div>
                <Link
                  href="/services/digital-marketing"
                  className="w-full py-3.5 px-6 rounded-2xl font-heading font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 active:scale-95"
                >
                  <span>Launch Meta Social Ads Sprint</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
