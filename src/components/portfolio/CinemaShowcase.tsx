'use client';

import React, { useState } from 'react';
import { Film, Play, Volume2, ArrowUpRight, Award, ShieldCheck, Clock, MonitorPlay, Sparkles, X, ExternalLink } from 'lucide-react';
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

interface CinemaShowcaseProps {
  projects?: Project[];
}

interface CinemaFilm {
  id: string;
  title: string;
  clientName: string;
  genre: string;
  runtime: string;
  resolution: string;
  retention: string;
  shortDesc: string;
  image: string;
  colorGrade: string;
  youtubeUrl?: string | null;
  youtubeId?: string | null;
}

const defaultFilms: CinemaFilm[] = [
  {
    id: 'lumina-health-film',
    title: 'Lumina Health 4K Brand Anthem',
    clientName: 'Lumina Global Health',
    youtubeId: 'dQw4w9WgXcQ',
    genre: 'Commercial Brand Anthem',
    runtime: '02:45',
    resolution: '4K ProRes 422HQ',
    retention: '78% Average Retention',
    shortDesc: 'A poetic exploration of human cellular vitality, filmed across 3 continents with multi-cam RED Monstro 8K cameras and custom orchestral score.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    colorGrade: 'ACEScc Kodak 2383 LUT',
  },
  {
    id: 'elevate-docuseries',
    title: 'Elevate Behind The Craft Docuseries',
    clientName: 'Elevate Creative Media',
    genre: 'Episodic YouTube Documentary',
    runtime: '14:20',
    resolution: '4K Cinema DCI',
    retention: '68% YouTube Watch Retention',
    shortDesc: 'Deep-dive 4-part series profiling category-defining artisans. Custom Foley audio recording, archival film grain synthesis, and high-retention chaptering.',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop',
    colorGrade: 'Film Negative Warm Emulsion',
  },
  {
    id: 'apex-investor-reel',
    title: 'Apex Ventures Annual Summit Keynote Film',
    clientName: 'Apex Capital Ventures',
    genre: 'Keynote & Investor Production',
    runtime: '05:12',
    resolution: '4K 60FPS HDR',
    retention: '$42M Committed Syndicate',
    shortDesc: 'Opening film for global LP summit in Singapore. Kinetic motion typography, 3D macro financial topology visuals, and thunderous Dolby Atmos mastering.',
    image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=1200&auto=format&fit=crop',
    colorGrade: 'High-Contrast Enterprise Tungsten',
  },
  {
    id: 'zenflow-product-demo',
    title: 'ZenFlow 3D Product Teaser & Launch Reel',
    clientName: 'ZenFlow Systems AI',
    genre: 'Product Teaser & Motion Craft',
    runtime: '01:50',
    resolution: '4K UHD Cinema',
    retention: '4.8M Organic Impressions',
    shortDesc: 'Sub-second kinetic cut showcasing autonomous cloud orchestration. 3D octane glass render integration and binaural audio design.',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop',
    colorGrade: 'Cyan & Magenta Cyber Grade',
  },
  {
    id: 'hyperion-quantum-cut',
    title: 'Hyperion Quantum Launch Film',
    clientName: 'Hyperion DeepTech',
    genre: 'DeepTech Keynote Film',
    runtime: '03:30',
    resolution: '4K Cinema DCI',
    retention: '84% Tech Executive Recall',
    shortDesc: 'Visualizing quantum encryption principles with bespoke generative particle animations, analog synthesizers, and dark atmospheric cinematography.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
    colorGrade: 'Monochrome Silver Gelatin Tint',
  },
  {
    id: 'novatech-brand-commercial',
    title: 'NovaTech Global Broadcast Commercial',
    clientName: 'NovaTech Group',
    genre: 'National Broadcast Commercial',
    runtime: '00:60',
    resolution: '4K Broadcast Compliant',
    retention: '12M+ Broadcast Reach',
    shortDesc: 'National TV spot broadcast across premier sports and business channels. High-stakes pacing, actor casting, and commercial color science.',
    image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=1200&auto=format&fit=crop',
    colorGrade: 'Arri Alexa Rec.709 Master',
  },
];

export default function CinemaShowcase({ projects }: CinemaShowcaseProps) {
  // Merge live database projects (with YouTube links) if available
  const films: CinemaFilm[] = (projects && projects.length > 0)
    ? projects.map((p, idx) => ({
        id: p.id,
        title: p.title,
        clientName: p.clientName || 'Scalemint Client',
        genre: 'Cinematic Sprint',
        runtime: '02:30',
        resolution: '4K ProRes 422HQ',
        retention: p.results || 'High Retention',
        shortDesc: p.shortDesc,
        image: p.coverMedia?.publicUrl || (defaultFilms[idx % defaultFilms.length]?.image || defaultFilms[0].image),
        colorGrade: 'Arri Alexa Rec.709 Master',
        youtubeUrl: p.youtubeUrl,
        youtubeId: p.youtubeId,
      }))
    : defaultFilms;

  const [selectedFilmId, setSelectedFilmId] = useState<string>(films[0]?.id || defaultFilms[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showNoVideoNotice, setShowNoVideoNotice] = useState<boolean>(false);

  const activeFilm =
    films.find((f) => f.id === selectedFilmId) || films[0] || defaultFilms[0];

  const handlePlayClick = () => {
    if (activeFilm.youtubeId) {
      setIsPlaying(true);
    } else {
      setShowNoVideoNotice(true);
      setTimeout(() => setShowNoVideoNotice(false), 4500);
    }
  };

  return (
    <section
      id="cinema-section"
      className="py-16 sm:py-20 relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#0A040D] via-[#140618] to-[#0A040D]"
    >
      {/* Ambient Crimson & Ruby Cinema Glow */}
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[350px] bg-rose-600/[0.08] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[300px] bg-purple-600/[0.08] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/25 shadow-sm">
              <Film className="w-3.5 h-3.5 text-rose-400" />
              <span>THEME 03 · LONG-FORM CINEMA & YOUTUBE SUITE</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Cinematic Narratives &{' '}
              <span className="bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 bg-clip-text text-transparent">
                High-Retention Films
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Hollywood-grade visual storytelling, custom Foley sound design, dynamic color grading, and broadcast-level narrative pacing engineered for YouTube documentaries, investor summits, and brand anthems.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/services/video-editing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 hover:border-rose-400 transition-all shrink-0 active:scale-95"
            >
              <span>Explore Cinema Sprint</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 16:9 Director's Cinema Master Player */}
        <div className="rounded-3xl border border-rose-500/30 bg-[#0E0610]/95 overflow-hidden shadow-[0_0_70px_-15px_rgba(244,63,94,0.3)] relative mb-8">
          {/* Top Video HUD Bar */}
          <div className="px-6 py-3 bg-black/70 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-300">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-400 font-bold uppercase tracking-wider">REC · 4K 60FPS</span>
              <span className="text-gray-600">|</span>
              <span className="text-gray-300">{activeFilm.resolution}</span>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span className="text-amber-300/90 hidden sm:inline">{activeFilm.colorGrade}</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              {isPlaying && (
                <button
                  onClick={() => setIsPlaying(false)}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close Video Player</span>
                </button>
              )}
              <span className="text-gray-400">RUNTIME: {activeFilm.runtime}</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/15 px-2.5 py-0.5 rounded border border-emerald-500/30">
                DOLBY 5.1 SURROUND
              </span>
            </div>
          </div>

          {/* Main Cinema Viewport */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black group">
            {isPlaying && activeFilm.youtubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeFilm.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeFilm.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={activeFilm.image}
                  alt={activeFilm.title}
                  className="w-full h-full object-cover transition-transform duration-700 opacity-90 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Central Play Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handlePlayClick}
                    className="w-20 h-20 rounded-full bg-rose-600/85 backdrop-blur-md border border-rose-400/60 flex items-center justify-center text-white shadow-[0_0_40px_rgba(244,63,94,0.6)] group-hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                </div>

                {showNoVideoNotice && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-rose-500/60 rounded-2xl px-6 py-4 text-center z-20 backdrop-blur-lg shadow-2xl">
                    <p className="text-rose-300 font-bold text-sm">Direct YouTube Stream</p>
                    <p className="text-gray-300 text-xs mt-1">Paste any YouTube URL into this project in Admin &gt; Portfolio CMS to stream full video instantly with zero server file storage.</p>
                  </div>
                )}

                {/* Bottom Master Film Telemetry & Audio Spectrum */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-none">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/30 text-rose-200 border border-rose-500/40 backdrop-blur-md">
                        {activeFilm.clientName}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/60 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                        {activeFilm.retention}
                      </span>
                      {activeFilm.youtubeId && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-600/80 text-white font-bold backdrop-blur-md">
                          ▶ YouTube Live
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                      {activeFilm.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                      {activeFilm.shortDesc}
                    </p>
                  </div>

                  {/* Audio Visualizer Spectrum */}
                  <div className="flex items-end gap-1.5 h-10 px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15 shrink-0">
                    {[45, 80, 60, 95, 70, 85, 50, 100, 65, 90, 75, 85].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="w-1.5 bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 rounded-full animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Film Selector Reel (Click to Switch Director Player) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {films.map((film) => {
            const isSelected = film.id === selectedFilmId;
            return (
              <button
                key={film.id}
                onClick={() => {
                  setSelectedFilmId(film.id);
                  setIsPlaying(false);
                }}
                className={`text-left rounded-2xl overflow-hidden p-2.5 transition-all duration-300 group border ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-400/80 shadow-[0_0_25px_-5px_rgba(244,63,94,0.4)] scale-[1.02]'
                    : 'bg-white/[0.02] border-white/10 hover:border-rose-500/40 hover:bg-white/[0.05]'
                }`}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-2 bg-black">
                  <img
                    src={film.image}
                    alt={film.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-gray-200">
                    {film.runtime}
                  </span>
                  {isSelected && (
                    <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-gray-400 truncate">
                    {film.clientName}
                  </div>
                  <h4 className={`text-xs font-heading font-bold truncate ${isSelected ? 'text-rose-300' : 'text-white group-hover:text-rose-200'}`}>
                    {film.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
