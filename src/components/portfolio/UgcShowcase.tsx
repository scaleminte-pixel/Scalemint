'use client';

import React, { useState } from 'react';
import { Smartphone, Sparkles, Flame, Eye, ArrowUpRight, Play, Volume2, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  slug: string;
  title: string;
  clientName?: string | null;
  shortDesc: string;
  results?: string | null;
  servicesUsed?: string | null;
  youtubeUrl?: string | null;
  youtubeId?: string | null;
  category?: { name: string; slug: string } | null;
  coverMedia?: { publicUrl: string } | null;
}

interface UgcShowcaseProps {
  projects?: Project[];
}

interface UgcItem {
  id: string;
  title: string;
  clientName: string;
  views: string;
  hookRate: string;
  cpa: string;
  audioTag: string;
  format: string;
  image: string;
  youtubeUrl?: string | null;
  youtubeId?: string | null;
}

const defaultUgcReels: UgcItem[] = [
  {
    id: 'novatech-viral-hooks',
    title: 'NovaTech Viral AI Hook Sprints',
    clientName: 'NovaTech Global',
    views: '4.8M Views',
    hookRate: '78% Hook Rate',
    cpa: '-42% CPA',
    audioTag: '⚡ Kinetic Beat 140BPM',
    format: 'TikTok & Reels 9:16',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'vantage-app-ugc',
    title: 'Vantage App Store Creator Ads',
    clientName: 'Vantage Mobile',
    views: '6.2M Views',
    hookRate: '82% Scroll-Stop',
    cpa: '-55% App CPA',
    audioTag: '🎵 Trending Synth Audio',
    format: 'iOS App Install Funnel',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'pulse-d2c-reels',
    title: 'Pulse eCommerce Dynamic UGC Reels',
    clientName: 'Pulse D2C Commerce',
    views: '3.9M Views',
    hookRate: '74% 3-Sec Hook',
    cpa: '6.4x Blended ROAS',
    audioTag: '🔥 Viral Unboxing Foley',
    format: 'Meta Feed & IG Story',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'lumina-wellness-creator',
    title: 'Lumina Wellness Creator Sprints',
    clientName: 'Lumina Care',
    views: '5.1M Views',
    hookRate: '80% Hook Rate',
    cpa: '-38% Acquisition Cost',
    audioTag: '✨ Organic Voiceover Pacing',
    format: 'Direct Response UGC',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'zenflow-tutorial-ugc',
    title: 'ZenFlow Interactive TikTok Demos',
    clientName: 'ZenFlow AI Systems',
    views: '2.7M Views',
    hookRate: '71% Retention',
    cpa: '+280% Free Trials',
    audioTag: '⚡ Sub-Second Sound FX',
    format: 'SaaS Mobile Demo Reel',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'artisan-unboxing-ugc',
    title: 'Artisan Heritage Unboxing Series',
    clientName: 'Artisan Co.',
    views: '4.4M Views',
    hookRate: '85% Hook Rate',
    cpa: '7.8x Meta ROAS',
    audioTag: '🎧 ASMR Leather Foley',
    format: 'High-Ticket D2C Hook',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function UgcShowcase({ projects }: UgcShowcaseProps) {
  const [selectedReel, setSelectedReel] = useState<UgcItem | null>(null);

  // Merge live database UGC projects if available
  const baseReels: UgcItem[] = (projects && projects.length > 0)
    ? projects.map((p, idx) => ({
        id: p.id,
        title: p.title,
        clientName: p.clientName || 'Scalemint Client',
        views: p.results || '4.2M Views',
        hookRate: '80% Hook Rate',
        cpa: '-45% CPA',
        audioTag: '⚡ Kinetic Sound FX',
        format: 'TikTok & Reels 9:16',
        image: p.coverMedia?.publicUrl || (defaultUgcReels[idx % defaultUgcReels.length]?.image || defaultUgcReels[0].image),
        youtubeUrl: p.youtubeUrl,
        youtubeId: p.youtubeId,
      }))
    : defaultUgcReels;

  // Duplicate for seamless 360 loop
  const duplicatedReels = [...baseReels, ...baseReels];

  return (
    <section
      id="ugc-section"
      className="py-16 sm:py-20 relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#0F0410] via-[#1A071E] to-[#0F0410]"
    >
      {/* Ambient Hot Magenta / Neon Pink Glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[350px] bg-pink-600/[0.09] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[300px] bg-rose-600/[0.08] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/25 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>THEME 04 · VIRAL 9:16 UGC & MOBILE AD HOOK LAB</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Scroll-Stopping Short-Form Reels &{' '}
              <span className="bg-gradient-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                TikTok Ad Hooks
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Engineered specifically for mobile dopamine feeds — TikTok, Instagram Reels, and YouTube Shorts. Sub-2-second visual hooks, kinetic captions, sound design, and aggressive conversion architecture.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/services/ai-ugc-video-editing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 hover:border-pink-400 transition-all shrink-0 active:scale-95"
            >
              <span>Explore UGC Sprints</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 9:16 Smartphone Slider (Continuous Stream with Pause on Hover) */}
      <div className="relative w-full overflow-hidden mb-10 group/ugc">
        {/* Edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[#0F0410] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[#0F0410] to-transparent z-20 pointer-events-none" />

        <div className="animate-marquee-infinite flex items-center gap-5 sm:gap-6 py-4 hover:[animation-play-state:paused] group-hover/ugc:[animation-play-state:paused]">
          {duplicatedReels.map((ugc, idx) => (
            <div
              key={`${ugc.id}-${idx}`}
              onClick={() => setSelectedReel(ugc)}
              className="group relative shrink-0 w-[230px] sm:w-[270px] aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-black border-2 border-white/10 hover:border-pink-500/70 shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer select-none"
            >
              <img
                src={ugc.image}
                alt={ugc.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

              {/* Smartphone Top Speaker Notch & Viral Metrics */}
              <div className="absolute top-4 left-3 right-3 flex items-center justify-between z-10">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-600 text-white shadow-md">
                  9:16 VIRAL
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-black/80 text-gray-200 border border-white/15 backdrop-blur-md flex items-center gap-1">
                  <Eye className="w-3 h-3 text-pink-400" />
                  {ugc.views}
                </span>
              </div>

              {/* Center Play Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-pink-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_25px_rgba(236,72,153,0.8)]">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Captions & Retention Hook Meter */}
              <div className="absolute bottom-4 left-3.5 right-3.5 space-y-2 z-10">
                <div className="flex flex-wrap items-center gap-1.5">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                    <Flame className="w-3 h-3 text-emerald-400" />
                    <span>{ugc.hookRate}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-mono">
                    <span>{ugc.cpa}</span>
                  </div>
                </div>

                <h4 className="font-heading font-bold text-white text-sm leading-snug group-hover:text-pink-200 transition-colors">
                  {ugc.title}
                </h4>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span className="truncate">{ugc.audioTag}</span>
                  <span className="text-pink-300 shrink-0 flex items-center gap-1">
                    <span>Play Reel</span>
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UGC Performance Metric Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-500/[0.05] via-purple-500/[0.03] to-pink-500/[0.05] p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-base sm:text-lg">
                Multi-Hook Variation Testing Architecture
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                Every sprint ships 5 to 15 unique hook variations per core concept — testing visual disruptors, question hooks, and UGC proof to isolate lowest acquisition costs.
              </p>
            </div>
          </div>
          <Link
            href="/services/ai-ugc-video-editing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 hover:border-pink-400 transition-all shrink-0 active:scale-95"
          >
            <span>Launch TikTok Sprints</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Interactive 9:16 Video Player Modal */}
      {selectedReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-[#0A040D] border-2 border-pink-500/50 shadow-[0_0_60px_rgba(236,72,153,0.4)] flex flex-col">
            {/* Top Close Bar */}
            <div className="p-3 bg-black/80 flex items-center justify-between z-20 border-b border-white/10 text-xs">
              <span className="font-heading font-bold text-pink-300 truncate max-w-[200px]">
                {selectedReel.title}
              </span>
              <button
                onClick={() => setSelectedReel(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewport */}
            <div className="relative flex-1 w-full bg-black overflow-hidden">
              {selectedReel.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedReel.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedReel.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <img
                    src={selectedReel.image}
                    alt={selectedReel.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="relative z-10 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-pink-600/90 text-white flex items-center justify-center mx-auto shadow-lg">
                      <Play className="w-7 h-7 ml-0.5" />
                    </div>
                    <h4 className="font-heading font-bold text-white text-base">
                      {selectedReel.title}
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Paste a YouTube or Shorts link into this project in Admin &gt; Portfolio CMS to stream this reel live with zero video file storage.
                    </p>
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {selectedReel.clientName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
