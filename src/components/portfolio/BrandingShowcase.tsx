'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, ArrowUpRight, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  slug: string;
  title: string;
  clientName?: string | null;
  shortDesc?: string;
  coverMedia?: { publicUrl: string } | null;
}

interface BrandingShowcaseProps {
  projects?: Project[];
}

interface LogoItem {
  id: string;
  title: string;
  clientName: string;
  shortDesc?: string;
  imageUrl: string;
}

// Curated 1:1 square fallback assets
const defaultLogoImages: string[] = [
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop', // Minimalist clean brand seal
  'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop', // Vector geometric branding
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', // Monogram emblem
  'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=800&auto=format&fit=crop', // 3D token icon
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', // Cybernetic tech mark
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop', // Enterprise identity
  'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=800&auto=format&fit=crop', // Modern luxury typography mark
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop', // Abstract circular logo
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop', // Minimalist mark on dark background
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', // High contrast branding mark
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', // Clean aesthetic badge
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop', // Abstract 3D emblem
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop', // Monochrome mark
  'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=800&auto=format&fit=crop', // Sleek luxury mark
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop', // Heritage luxury seal
  'https://images.unsplash.com/photo-1580481077197-9e2954ca9345?q=80&w=800&auto=format&fit=crop',
];

export default function BrandingShowcase({ projects = [] }: BrandingShowcaseProps) {
  // Map live projects from backend FIRST so any backend image changes immediately display
  const liveItems: LogoItem[] = projects.map((p, idx) => ({
    id: p.id || `proj-${idx}`,
    title: p.title,
    clientName: p.clientName || 'Scalemint Partner',
    shortDesc: p.shortDesc,
    imageUrl: p.coverMedia?.publicUrl || defaultLogoImages[idx % defaultLogoImages.length],
  }));

  // Build combined items pool: live items first, then supplement with curated defaults to reach 16 items for dual track
  const combinedItems: LogoItem[] = [...liveItems];
  if (combinedItems.length < 16) {
    const existingUrls = new Set(combinedItems.map((i) => i.imageUrl));
    const supplement = defaultLogoImages.filter((u) => !existingUrls.has(u));
    supplement.forEach((url, i) => {
      if (combinedItems.length < 16) {
        combinedItems.push({
          id: `def-${i}`,
          title: `Visual Identity Mark 0${i + 1}`,
          clientName: 'Scalemint Archive',
          shortDesc: 'Vector identity system & design tokens',
          imageUrl: url,
        });
      }
    });
  }

  // Split into Row 1 (top) and Row 2 (bottom)
  const half = Math.ceil(combinedItems.length / 2);
  const row1Items = combinedItems.slice(0, half);
  const row2Items = combinedItems.slice(half);

  // Duplicated for continuous smooth marquee
  const duplicatedRow1 = [...row1Items, ...row1Items, ...row1Items];
  const duplicatedRow2 = [...row2Items, ...row2Items, ...row2Items];

  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (item: LogoItem) => {
    const idx = combinedItems.findIndex((i) => i.id === item.id || i.imageUrl === item.imageUrl);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + combinedItems.length) % combinedItems.length);
    }
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % combinedItems.length);
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const activeItem = lightboxIndex !== null ? combinedItems[lightboxIndex] : null;

  return (
    <section
      id="branding-section"
      className="py-14 sm:py-18 relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#08070F] via-[#0D0B1A] to-[#08070F]"
    >
      {/* Ambient Warm Glow */}
      <div className="absolute top-1/3 left-1/4 w-[700px] h-[350px] bg-amber-500/[0.06] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[300px] bg-purple-600/[0.08] blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>DISCIPLINE 01 • VECTOR LOGO & IDENTITY SUITE</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Distinctive Visual Systems Built For{' '}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent">
                Pricing Authority
              </span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Every identity mark is engineered with mathematical geometry, custom typography hierarchy, and distinct visual recall — rejecting generic templates so your brand commands instant market premium.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-amber-500/20 text-xs font-mono text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Vector & IP Handover</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-white/[0.02] border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Hover to Pause · Click to Enlarge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Reverse-Sliding 1:1 Image Showcase with Hover-Pause */}
      <div className="relative w-full overflow-hidden space-y-4 my-6 group/container">
        {/* Edge gradient masks for cinematic fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-r from-[#08070F] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-l from-[#08070F] to-transparent z-20 pointer-events-none" />

        {/* ========================================================
            ROW 1: Top Row -> Slides LEFT (Hover pauses animation)
           ======================================================== */}
        <div className="overflow-hidden py-1">
          <div
            className="animate-marquee-infinite flex items-center gap-4 sm:gap-5 hover:[animation-play-state:paused] group-hover/container:[animation-play-state:paused]"
            style={{ willChange: 'transform' }}
          >
            {duplicatedRow1.map((item, idx) => (
              <div
                key={`r1-item-${idx}`}
                onClick={() => openLightbox(item)}
                className="group relative shrink-0 w-[180px] sm:w-[230px] lg:w-[260px] aspect-square rounded-2xl overflow-hidden bg-[#0C0A17] border border-white/10 hover:border-amber-400/60 shadow-xl hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-[1.03] cursor-pointer select-none"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Details Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-0.5 truncate">
                    {item.clientName}
                  </span>
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-white leading-snug truncate">
                    {item.title}
                  </h4>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-amber-200 font-mono">
                    <ZoomIn className="w-3 h-3" />
                    <span>Click to Enlarge</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            ROW 2: Bottom Row -> Slides RIGHT (Reverse) (Hover pauses)
           ======================================================== */}
        <div className="overflow-hidden py-1">
          <div
            className="animate-marquee-reverse flex items-center gap-4 sm:gap-5 hover:[animation-play-state:paused] group-hover/container:[animation-play-state:paused]"
            style={{ willChange: 'transform' }}
          >
            {duplicatedRow2.map((item, idx) => (
              <div
                key={`r2-item-${idx}`}
                onClick={() => openLightbox(item)}
                className="group relative shrink-0 w-[180px] sm:w-[230px] lg:w-[260px] aspect-square rounded-2xl overflow-hidden bg-[#0C0A17] border border-white/10 hover:border-amber-400/60 shadow-xl hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-[1.03] cursor-pointer select-none"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Details Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider mb-0.5 truncate">
                    {item.clientName}
                  </span>
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-white leading-snug truncate">
                    {item.title}
                  </h4>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-amber-200 font-mono">
                    <ZoomIn className="w-3 h-3" />
                    <span>Click to Enlarge</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Click to Enlarge with Details & Prev/Next Navigation) */}
      {lightboxIndex !== null && activeItem && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          {/* Top Bar: Counter, Details & Close Button */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 text-white"
          >
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white/10 backdrop-blur-md border border-white/15">
                {lightboxIndex + 1} / {combinedItems.length}
              </span>
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-sm text-white block">{activeItem.title}</span>
                <span className="text-[11px] font-mono text-amber-400 block">{activeItem.clientName}</span>
              </div>
            </div>

            <button
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-105"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Previous Button */}
          <button
            onClick={showPrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all hover:scale-110 active:scale-95"
            aria-label="Previous Mark"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={showNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all hover:scale-110 active:scale-95"
            aria-label="Next Mark"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Centered High-Res Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[80vh] aspect-square rounded-3xl overflow-hidden border border-amber-500/30 bg-[#0C0A17] shadow-2xl shadow-amber-500/20"
          >
            <img
              src={activeItem.imageUrl}
              alt={activeItem.title}
              className="w-full h-full object-cover"
            />
            {/* Bottom info pill */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 text-center">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest block mb-1">
                {activeItem.clientName}
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                {activeItem.title}
              </h3>
              {activeItem.shortDesc && (
                <p className="text-xs text-gray-300 mt-1 max-w-md mx-auto line-clamp-2">
                  {activeItem.shortDesc}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Discipline Spec Footnote */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Format: 1:1 Scalable Vectors · SVG · AI · PDF · Brand Guidelines Included</span>
          </div>

          <Link
            href="/services/branding-design"
            className="text-amber-300 hover:text-amber-200 font-bold inline-flex items-center gap-1 transition-colors"
          >
            <span>Explore Full Branding Service</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
