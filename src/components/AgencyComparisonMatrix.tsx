'use client';

import React from 'react';
import { Check, X, Sparkles, Zap, Shield, Clock, Users, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ComparisonItem {
  category: string;
  categoryIcon: React.ReactNode;
  traditional: {
    title: string;
    description: string;
  };
  scalemint: {
    title: string;
    description: string;
    highlight: string;
  };
}

const comparisonList: ComparisonItem[] = [
  {
    category: 'Delivery Speed',
    categoryIcon: <Clock className="w-3.5 h-3.5 text-purple-400" />,
    traditional: {
      title: '3 to 6 Months Dragged Out',
      description: 'Slow discovery phases, endless committee meetings, and bureaucratic roadmaps.',
    },
    scalemint: {
      title: '7 to 14 Days Ultra-Fast Sprints',
      description: 'Laser-focused production sprints with verified milestones and rapid deployment to live production.',
      highlight: '10x Faster Launch',
    },
  },
  {
    category: 'Talent & Craft',
    categoryIcon: <Users className="w-3.5 h-3.5 text-blue-400" />,
    traditional: {
      title: 'Junior Intern Delegation',
      description: 'Pitched by agency partners, then quietly handed off to inexperienced junior interns or freelancers.',
    },
    scalemint: {
      title: 'Direct Senior Leads Only',
      description: 'Direct execution by battle-tested top 1% senior designers & full-stack engineers.',
      highlight: 'Top 1% Craft',
    },
  },
  {
    category: 'Communication',
    categoryIcon: <MessageSquare className="w-3.5 h-3.5 text-amber-400" />,
    traditional: {
      title: '5 Layers of Account Managers',
      description: 'Formal corporate emails, ticket queues, and 2-week calendar delays just to ask a quick question.',
    },
    scalemint: {
      title: 'Direct Private Slack & Loom',
      description: 'Dedicated private Slack channel with real-time maker access and daily async video updates.',
      highlight: 'Zero Bureaucracy',
    },
  },
  {
    category: 'IP & Ownership',
    categoryIcon: <Shield className="w-3.5 h-3.5 text-emerald-400" />,
    traditional: {
      title: 'Files Locked Behind Retainers',
      description: 'Proprietary design files, raw source code, and assets held hostage behind ongoing monthly fees.',
    },
    scalemint: {
      title: '100% Full Source Rights',
      description: 'Complete source ownership transferred on day one — all Figma files, Git repos, 3D assets & 4K masters.',
      highlight: 'Full Autonomy',
    },
  },
  {
    category: 'Billing & Scope',
    categoryIcon: <Zap className="w-3.5 h-3.5 text-pink-400" />,
    traditional: {
      title: 'Opaque Hourly Billing',
      description: 'Vague hourly estimates with unexpected "out-of-scope" line items and escalating monthly invoices.',
    },
    scalemint: {
      title: 'Fixed, Transparent Sprint Pricing',
      description: '100% predictable sprint pricing with guaranteed deliverables, clear milestones & zero surprises.',
      highlight: 'Predictable ROI',
    },
  },
];

export default function AgencyComparisonMatrix() {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#110D26] via-[#090715] to-[#04030A] p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden backdrop-blur-2xl">
      {/* Decorative Ambient Aura */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>The Industry Comparison</span>
        </div>
        <h3 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Traditional Agencies <span className="text-gray-500 font-light">vs</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400">
            Scalemint
          </span>
        </h3>
        <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
          See at a single glance why high-velocity founders switch from legacy agencies to Scalemint&apos;s agile production model.
        </p>
      </div>

      {/* Side-by-Side Comparative Battle Cards */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* Floating Desktop VS Badge */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#160E30] border-2 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.4)] items-center justify-center font-extrabold text-xs text-white font-mono tracking-widest pointer-events-none">
          VS
        </div>

        {/* Card 1: Traditional Agency Model */}
        <div className="rounded-3xl border border-rose-500/20 bg-[#0C0A15]/80 p-6 sm:p-8 backdrop-blur-xl hover:border-rose-500/35 transition-all flex flex-col justify-between relative overflow-hidden">
          {/* Top Badge & Heading */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/25">
                <X className="w-3.5 h-3.5" />
                <span>The Old Agency Model</span>
              </div>
              <span className="text-xs font-mono text-gray-500">Industry Typical</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Traditional Agencies
            </h4>
            <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
              Bloated corporate overhead, multi-month delivery delays, and high frustration.
            </p>

            {/* List of 5 Points */}
            <div className="space-y-3.5">
              {comparisonList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-rose-500/25 transition-all"
                >
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-mono font-medium mb-1.5">
                    {item.categoryIcon}
                    <span className="uppercase tracking-wider">{item.category}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                      <X className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-rose-200/90">
                        {item.traditional.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        {item.traditional.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-rose-400/80 font-medium">
            Result: Missed launch deadlines & wasted capital.
          </div>
        </div>

        {/* Card 2: The Scalemint Standard (Winner) */}
        <div className="rounded-3xl border-2 border-purple-500/50 bg-gradient-to-b from-[#181135]/95 via-[#0F0B24]/95 to-[#070514]/95 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_60px_-15px_rgba(168,85,247,0.35)] hover:border-purple-500/70 transition-all flex flex-col justify-between relative overflow-hidden ring-1 ring-white/10">
          {/* Subtle Ambient Light on Winner Card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Badge & Heading */}
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>The Modern Standard</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 bg-purple-500/15 px-2.5 py-1 rounded-full border border-purple-500/30">
                RECOMMENDED
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span>The Scalemint Model</span>
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
              Rapid sprints, direct senior talent, full ownership, and transparent pricing.
            </p>

            {/* List of 5 Points */}
            <div className="space-y-3.5">
              {comparisonList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/25 hover:border-emerald-500/50 hover:bg-emerald-500/[0.04] transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 text-purple-300 text-[11px] font-mono font-medium">
                      {item.categoryIcon}
                      <span className="uppercase tracking-wider">{item.category}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                      {item.scalemint.highlight}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {item.scalemint.title}
                      </div>
                      <div className="text-xs text-gray-300 mt-0.5 leading-relaxed">
                        {item.scalemint.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-emerald-400 font-semibold relative z-10 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Result: 10x faster market launch & full enterprise control.</span>
          </div>
        </div>
      </div>

      {/* Bottom Conversion Action Bar */}
      <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] rounded-2xl p-5 sm:p-6 border border-white/5 relative z-10">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-bold text-sm sm:text-base">
              Ready for an unfair creative & engineering advantage?
            </div>
            <div className="text-gray-400 text-xs sm:text-sm">
              Kick off your custom sprint in 48 hours. 100% full IP rights from day one.
            </div>
          </div>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] shrink-0"
        >
          <span>Book a Strategy Call</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
