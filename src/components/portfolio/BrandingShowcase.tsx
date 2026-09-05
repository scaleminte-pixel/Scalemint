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

// 16 curated high-res 1:1 square logo presentation assets
const defaultLogoImages: string[] = [
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop', // Minimalist clean brand seal
  'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop', // Vector geometric branding
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', // Monogram emblem
  'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=800&auto=format&fit=crop', // 3D token icon
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop', // Cybernetic tech mark
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop', // Enterprise identity
  'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=800&auto=format&fit=crop', // Modern luxury typography mark
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop', // Abstract circular logo
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', // Geometric fluid token
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop', // Minimalist mark on dark background
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', // High contrast branding mark
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', // Clean aesthetic badge
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop', // Abstract 3D emblem
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop', // Monochrome mark
  'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=800&auto=format&fit=crop', // Sleek luxury mark
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop', // Heritage luxury seal
];

export default function BrandingShowcase({ projects = [] }: BrandingShowcaseProps) {
  // Extract backend images if available, otherwise use curated 1:1 image pool
  const backendImages = projects
    .map((p) => p.coverMedia?.publicUrl)
    .filter((url): url is string => Boolean(url));

  const allImages = backendImages.length >= 8 ? backendImages : defaultLogoImages;

  // Split into Row 1 (top) and Row 2 (bottom)
  const half = Math.ceil(allImages.length / 2);
  const row1Images = allImages.slice(0, half);
  const row2Images = allImages.slice(half);

  // Duplicated for continuous smooth marquee
  const duplicatedRow1 = [...row1Images, ...row1Images, ...row1Images];
  const duplicatedRow2 = [...row2Images, ...row2Images, ...row2Images];

  // Lightbox Modal State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (imgUrl: string) => {
    const idx = allImages.indexOf(imgUrl);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);
    }
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allImages.length);
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

  return (
    <section
      id="branding-section"
      className="py-14 sm:py-18 relative overflow-hidden border-t border-white/[0.08] bg-gradient-to-b from-[#08070F] via-[#0D0B1A] to-[#08070F]"
    >
      {/* Ambient Warm Glow */}
      <div className="absolute top-1/3 left-1/4 w-[700px] h-[350px] bg-amber-500/[0.06] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[300px] bg-purple-600/[0.07] blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>THEME 01 · BRAND IDENTITY & LOGO ATELIER</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Identities Engineered for{' '}
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent">
                Radical Distinction
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              No generic templates. Unmistakable brand marks, vector geometry systems, and comprehensive design tokens that command premium authority.
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
            {duplicatedRow1.map((imgUrl, idx) => (
              <div
                key={`r1-img-${idx}`}
                onClick={() => openLightbox(imgUrl)}
                className="group relative shrink-0 w-[180px] sm:w-[230px] lg:w-[260px] aspect-square rounded-2xl overflow-hidden bg-[#0C0A17] border border-white/10 hover:border-amber-400/60 shadow-xl hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-[1.03] cursor-pointer select-none"
              >
                <img
                  src={imgUrl}
                  alt="Client Brand Logo"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle Hover Zoom Overlay Icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-black/70 border border-white/20 text-amber-300 backdrop-blur-md shadow-lg">
                    <ZoomIn className="w-5 h-5" />
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
            {duplicatedRow2.map((imgUrl, idx) => (
              <div
                key={`r2-img-${idx}`}
                onClick={() => openLightbox(imgUrl)}
                className="group relative shrink-0 w-[180px] sm:w-[230px] lg:w-[260px] aspect-square rounded-2xl overflow-hidden bg-[#0C0A17] border border-white/10 hover:border-amber-400/60 shadow-xl hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-[1.03] cursor-pointer select-none"
              >
                <img
                  src={imgUrl}
                  alt="Client Brand Logo"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-black/70 border border-white/20 text-amber-300 backdrop-blur-md shadow-lg">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Click to Enlarge with Prev/Next Navigation) */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          {/* Top Bar: Counter & Close Button */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 text-white"
          >
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white/10 backdrop-blur-md border border-white/15">
              {lightboxIndex + 1} / {allImages.length}
            </span>

            <button
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:scale-110 transition-all cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={showPrev}
            className="absolute left-4 sm:left-8 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white hover:text-amber-300 hover:scale-110 transition-all z-20 cursor-pointer shadow-2xl"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={showNext}
            className="absolute right-4 sm:right-8 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white hover:text-amber-300 hover:scale-110 transition-all z-20 cursor-pointer shadow-2xl"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Enlarged 1:1 Image View */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.9)] bg-black flex items-center justify-center"
          >
            <img
              src={allImages[lightboxIndex]}
              alt={`Brand Logo ${lightboxIndex + 1}`}
              className="w-full h-full object-contain select-none"
            />
          </div>
        </div>
      )}

      {/* Bottom Identity Deliverables CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-6">
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/[0.05] via-purple-500/[0.03] to-amber-500/[0.05] p-5 sm:p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-heading font-bold text-white text-sm sm:text-base">
              Full Vector Deliverables on Every Sprint
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              100% vector master files (SVG, AI, Figma Tokens) and full commercial rights handover.
            </p>
          </div>
          <Link
            href="/services/branding-design"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading font-bold text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all shrink-0 active:scale-95"
          >
            <span>Explore Branding Sprint</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
