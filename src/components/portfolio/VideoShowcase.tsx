'use client';

import React from 'react';
import { Sparkles, Film, Play, Volume2, ArrowUpRight, Flame, ShieldCheck } from 'lucide-react';
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

interface VideoShowcaseProps {
  cinemaProjects: Project[];
  ugcProjects: Project[];
}

const videoImages: Record<string, string> = {
  'lumina-health-4k-brand-anthem': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
  'elevate-behind-the-craft-docuseries': 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop',
  'apex-ventures-annual-summit-reel': 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=1200&auto=format&fit=crop',
  'zenflow-3d-product-teaser': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
  'hyperion-quantum-launch-film': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
  'novatech-broadcast-commercial': 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=1200&auto=format&fit=crop',

  'novatech-viral-tiktok-hook-sprints': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop',
  'vantage-app-store-creator-ads': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop',
  'pulse-ecommerce-dynamic-ugc-reels': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
  'lumina-wellness-creator-sprints': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
  'zenflow-interactive-tiktok-demos': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
  'artisan-heritage-unboxing-series': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop',
};

export default function VideoShowcase({ cinemaProjects, ugcProjects }: VideoShowcaseProps) {
  // Combine all vertical UGC for sliding phone marquee
  const duplicatedUgc = [...ugcProjects, ...ugcProjects];
  const featuredCinema = cinemaProjects[0];
  const featuredImg = featuredCinema?.coverMedia?.publicUrl || videoImages[featuredCinema?.slug] || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop';

  return (
    <section id="video-section" className="py-16 sm:py-20 relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#0C050D] via-[#170817] to-[#0C050D]">
      {/* Ambient Crimson & Hot Magenta Glow */}
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[350px] bg-rose-600/[0.09] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[300px] bg-pink-600/[0.08] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/25 shadow-sm">
              <Film className="w-3.5 h-3.5 text-rose-400" />
              <span>THEME 03 · CINEMA SUITE & VIRAL 9:16 UGC LAB</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Cinematic Narratives & <span className="bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 bg-clip-text text-transparent">Scroll-Stopping UGC</span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              From 4K Hollywood-grade brand anthems to rapid-testing viral TikTok ad hooks. High-retention pacing, custom Foley sound design, and aggressive direct-response persuasion.
            </p>
          </div>

          <Link
            href="/services/video-editing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all shrink-0"
          >
            <span>Explore Video Sprint</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Part A: 16:9 Director's Cinema Player Mockup */}
      {featuredCinema && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-14">
          <div className="rounded-3xl border border-rose-500/30 bg-[#0E0610]/95 overflow-hidden shadow-[0_0_60px_-15px_rgba(244,63,94,0.25)] relative group">
            {/* Top Video HUD Bar */}
            <div className="px-6 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-xs font-mono text-gray-300">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-rose-400 font-bold uppercase tracking-wider">REC · 4K 60FPS</span>
                <span className="text-gray-500">|</span>
                <span>PRORES 422HQ</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-gray-400">TIMECODE: 00:02:14:18</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded">DOLBY 5.1 AUDIO</span>
              </div>
            </div>

            {/* Main Cinema Viewport */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              <img
                src={featuredImg}
                alt={featuredCinema.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Central Play Badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-rose-600/80 backdrop-blur-md border border-rose-400/50 flex items-center justify-center text-white shadow-[0_0_30px_rgba(244,63,94,0.6)] group-hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>

              {/* Bottom Video Meta */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                    {featuredCinema.clientName || 'Brand Film'}
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                    {featuredCinema.title}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {featuredCinema.shortDesc}
                  </p>
                </div>

                {/* Animated Fake Audio Visualizer Spectrum */}
                <div className="flex items-end gap-1.5 h-8 px-4 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 shrink-0">
                  {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-1 bg-gradient-to-t from-rose-500 to-pink-400 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Part B: 9:16 Vertical Smartphone Reels Slider (TikTok / IG Shorts Format) */}
      <div id="ugc-section" className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                9:16 Vertical Creator UGC & TikTok Hooks
              </h3>
            </div>
            <span className="text-xs font-mono text-pink-300 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
              High-Velocity Mobile Ads
            </span>
          </div>
        </div>

        {/* Continuous Horizontal Stream of 9:16 Mobile Frames */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-[#0C050D] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-[#0C050D] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-infinite flex items-center gap-5 sm:gap-6 py-4">
            {duplicatedUgc.map((ugc, idx) => {
              const img = ugc.coverMedia?.publicUrl || videoImages[ugc.slug] || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop';
              return (
                <div
                  key={`${ugc.id}-${idx}`}
                  className="group relative shrink-0 w-[220px] sm:w-[260px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-white/10 hover:border-pink-500/60 shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <img
                    src={img}
                    alt={ugc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* Phone UI Notch & Top Tags */}
                  <div className="absolute top-4 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-600 text-white shadow-md">
                      9:16 VIRAL
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/80 text-gray-300 border border-white/10">
                      4.2M Views
                    </span>
                  </div>

                  {/* Bottom Captions & Hook Meter */}
                  <div className="absolute bottom-4 left-3 right-3 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                      <Flame className="w-3 h-3 text-emerald-400" />
                      <span>68% Hook Rate</span>
                    </div>
                    <h4 className="font-heading font-bold text-white text-sm leading-snug group-hover:text-pink-200 transition-colors">
                      {ugc.title}
                    </h4>
                    <p className="text-[11px] text-gray-300 line-clamp-1">
                      {ugc.clientName} · Dynamic Subtitles & Sound FX
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
