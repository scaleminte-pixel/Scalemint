'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Search, ShieldCheck, Target, ArrowUpRight, CheckCircle2, DollarSign, Activity } from 'lucide-react';
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

interface GoogleAdsShowcaseProps {
  projects: Project[];
}

interface CampaignTrack {
  id: string;
  tabLabel: string;
  clientName: string;
  industry: string;
  query: string;
  title: string;
  url: string;
  desc: string;
  roas: string;
  roasMultiplier: number;
  cpa: string;
  pipeline: string;
  sitelinks: string[];
}

const campaignTracks: CampaignTrack[] = [
  {
    id: 'b2b-saas',
    tabLabel: 'B2B SaaS & Cloud',
    clientName: 'CloudScale Tech',
    industry: 'Enterprise Infrastructure',
    query: 'enterprise cloud migration high uptime SLAs',
    title: 'CloudScale Enterprise Migration — 99.99% Guaranteed SLA',
    url: 'https://cloudscale.dev/enterprise-sprint',
    desc: 'Zero downtime cloud architecture migrations engineered for high-velocity scale-ups. Turnkey deployment with 100% full source ownership.',
    roas: '6.2x ROAS',
    roasMultiplier: 6.2,
    cpa: '-46% CPA',
    pipeline: '+$1.8M Pipeline',
    sitelinks: ['✦ Migration Blueprint', '✦ SLA Guarantee', '✦ Cost Benchmark', '✦ Book Senior Architect'],
  },
  {
    id: 'ecommerce-d2c',
    tabLabel: 'High-ROAS E-Commerce',
    clientName: 'Pulse D2C Commerce',
    industry: 'Luxury Consumer Ergonomics',
    query: 'luxury ergonomic leather executive chair direct',
    title: 'Pulse Ergonomic Seating — Handcrafted Italian Leather',
    url: 'https://pulsecommerce.com/flagship-collection',
    desc: 'Engineered for 12+ hour focus. Free white-glove delivery, 100-day risk-free commercial trial, and 10-year warranty.',
    roas: '7.1x ROAS',
    roasMultiplier: 7.1,
    cpa: '-38% CPA',
    pipeline: '+$840k Monthly Run-Rate',
    sitelinks: ['✦ Material Spec Sheet', '✦ Verified 5-Star Reviews', '✦ Corporate Fleet Orders', '✦ Instant Checkout'],
  },
  {
    id: 'fintech-venture',
    tabLabel: 'Fintech & Venture Capital',
    clientName: 'Apex Capital Ventures',
    industry: 'Private Equity & Dealflow',
    query: 'series A venture capital partners technology scale-ups',
    title: 'Apex Ventures — High-Conviction Growth Capital',
    url: 'https://apexventures.io/portfolio-sprint',
    desc: 'Backing category-defining software and AI founders with $2M–$15M initial checks. Direct principal partner access.',
    roas: '5.8x ROAS',
    roasMultiplier: 5.8,
    cpa: '-42% CPA',
    pipeline: '140+ Founder Leads',
    sitelinks: ['✦ Portfolio Track Record', '✦ Investment Thesis', '✦ Founder Testimonials', '✦ Pitch Deck Review'],
  },
  {
    id: 'legal-advisory',
    tabLabel: 'Commercial Litigation & Legal',
    clientName: 'Nexus Legal Group',
    industry: 'Corporate Counsel',
    query: 'commercial litigation corporate attorney new york',
    title: 'Nexus Corporate Counsel — High-Stakes Litigation',
    url: 'https://nexuslegal.com/commercial-practice',
    desc: 'Elite representation for cross-border IP disputes, M&A arbitration, and regulatory compliance. Over $450M recovered for clients.',
    roas: '5.4x ROAS',
    roasMultiplier: 5.4,
    cpa: '-52% CPA',
    pipeline: '+$1.1M Retainer Value',
    sitelinks: ['✦ Lead Counsel Credentials', '✦ Representative Verdicts', '✦ Fee Transparency', '✦ Retainer Intake'],
  },
];

export default function GoogleAdsShowcase({ projects }: GoogleAdsShowcaseProps) {
  const [activeTab, setActiveTab] = useState<string>(campaignTracks[0].id);

  const activeCampaign =
    campaignTracks.find((c) => c.id === activeTab) || campaignTracks[0];

  return (
    <section id="ads-section" className="py-14 sm:py-16 relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#040C08] via-[#081710] to-[#040C08]">
      {/* Ambient Emerald & Cyan Glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[350px] bg-emerald-500/[0.08] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[300px] bg-cyan-500/[0.07] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>THEME 04 · HIGH-INTENT GOOGLE ADS & ROAS ENGINE</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Precision Search Intent & <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">Predictable ROI</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              We eliminate wasteful ad spend, engineer negative keyword shields, and capture ready-to-buy commercial search traffic with high-converting responsive ad copy.
            </p>
          </div>

          <Link
            href="/services/google-ads"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all shrink-0 active:scale-95"
          >
            <span>Explore Google Ads Sprint</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Clean, Spacious Category Tracks (Zero Clutter) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {campaignTracks.map((track) => {
            const isSelected = track.id === activeTab;
            return (
              <button
                key={track.id}
                onClick={() => setActiveTab(track.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-heading font-bold whitespace-nowrap transition-all flex items-center gap-2.5 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 scale-[1.02] border border-emerald-400'
                    : 'bg-white/[0.03] text-gray-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-black' : 'bg-emerald-400'}`} />
                <span>{track.tabLabel}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-emerald-300'}`}>
                  {track.clientName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Growth Engine Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCampaign.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6"
          >
            {/* Left: Google Search Result Simulation Card (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-emerald-500/30 bg-[#07130E]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_50px_-15px_rgba(16,185,129,0.2)] flex flex-col justify-between space-y-6">
              <div>
                {/* Search Bar Simulator */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 mb-6">
                  <Search className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-mono text-gray-200 truncate">
                    {activeCampaign.query}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                    Exact Match
                  </span>
                </div>

                {/* Simulated Google Ad Output */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded text-[11px]">
                      Sponsored
                    </span>
                    <span className="text-emerald-400 font-mono text-xs truncate">
                      {activeCampaign.url}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-blue-400 hover:underline cursor-pointer leading-snug">
                    {activeCampaign.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {activeCampaign.desc}
                  </p>

                  {/* Sitelinks Extensions */}
                  <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-white/[0.06]">
                    {activeCampaign.sitelinks.map((link, i) => (
                      <div
                        key={i}
                        className="text-xs text-blue-400 hover:underline cursor-pointer truncate"
                      >
                        {link}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Shield Guarantee */}
              <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Negative Keyword Shield Active (0% Waste)</span>
                </span>
                <span className="font-mono text-[11px] text-gray-400">
                  Daily Bid Optimization Engine
                </span>
              </div>
            </div>

            {/* Right: Live Telemetry & Verified ROI Gauges (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#091D13] to-[#040C08] p-6 sm:p-8 backdrop-blur-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Live Verified Metrics
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-gray-400">Verified Client Account</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>

                {/* Metric 1: ROAS with Visual Progress Bar */}
                <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-gray-400">
                      Average Return on Ad Spend
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">Industry Avg: 2.1x</span>
                  </div>
                  <div className="font-heading text-3xl sm:text-4xl font-black text-emerald-400">
                    {activeCampaign.roas}
                  </div>
                  {/* Visual Bar Comparison */}
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (activeCampaign.roasMultiplier / 8) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2: CPA Efficiency */}
                <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">
                    Cost Per Acquisition Efficiency
                  </span>
                  <div className="font-heading text-3xl sm:text-4xl font-black text-cyan-300">
                    {activeCampaign.cpa}
                  </div>
                  <p className="text-[11px] text-gray-400">Directly attributed to high-intent commercial keyword shielding.</p>
                </div>

                {/* Metric 3: Pipeline Output */}
                <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">
                    Commercial Pipeline Generated
                  </span>
                  <div className="font-heading text-2xl sm:text-3xl font-black text-white">
                    {activeCampaign.pipeline}
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee */}
              <div className="pt-4 border-t border-white/[0.06] space-y-3">
                <div className="text-center text-xs font-mono text-emerald-300">
                  100% Client-Owned Google Ad Accounts & First-Party Pixel Tracking
                </div>
                <Link
                  href="/services/google-ads"
                  className="w-full py-3.5 px-6 rounded-2xl font-heading font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
                >
                  <span>Initiate Google Ads Sprint</span>
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
