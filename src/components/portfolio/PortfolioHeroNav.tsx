'use client';

import React from 'react';
import { Palette, Globe, Film, Smartphone, Share2, TrendingUp } from 'lucide-react';

interface PortfolioHeroNavProps {
  totalProjects: number;
}

export default function PortfolioHeroNav({ totalProjects }: PortfolioHeroNavProps) {
  const navItems = [
    {
      id: 'branding-section',
      label: 'Brand Identity',
      icon: <Palette className="w-3.5 h-3.5 text-amber-400" />,
      tag: 'Vector Atelier',
      color: 'hover:border-amber-500/40 hover:text-amber-300',
    },
    {
      id: 'websites-section',
      label: 'Web Experiences',
      icon: <Globe className="w-3.5 h-3.5 text-blue-400" />,
      tag: 'Next.js Flagships',
      color: 'hover:border-blue-500/40 hover:text-blue-300',
    },
    {
      id: 'cinema-section',
      label: 'Long-Form Cinema',
      icon: <Film className="w-3.5 h-3.5 text-rose-400" />,
      tag: '4K Films',
      color: 'hover:border-rose-500/40 hover:text-rose-300',
    },
    {
      id: 'ugc-section',
      label: 'Viral 9:16 Shorts',
      icon: <Smartphone className="w-3.5 h-3.5 text-pink-400" />,
      tag: 'TikTok Hooks',
      color: 'hover:border-pink-500/40 hover:text-pink-300',
    },
    {
      id: 'meta-ads-section',
      label: 'Meta & Social Ads',
      icon: <Share2 className="w-3.5 h-3.5 text-indigo-400" />,
      tag: 'FB & IG Scale',
      color: 'hover:border-indigo-500/40 hover:text-indigo-300',
    },
    {
      id: 'ads-section',
      label: 'Google Search Ads',
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />,
      tag: 'PPC & Intent',
      color: 'hover:border-emerald-500/40 hover:text-emerald-300',
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex items-center justify-center my-6 sticky top-24 z-30 px-4">
      <div className="flex items-center gap-2 p-2 rounded-full bg-[#0A0718]/90 backdrop-blur-2xl border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-x-auto max-w-full no-scrollbar ring-1 ring-white/10">
        <span className="text-[11px] font-mono text-purple-300 px-3 py-1 bg-purple-500/15 rounded-full border border-purple-500/30 hidden lg:inline-flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>6 Disciplines · 36 Sprint Case Studies</span>
        </span>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-heading font-medium text-gray-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${item.color}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
