'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUpRight, Eye } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';

interface PortfolioItem {
  id: string;
  slug?: string;
  title: string;
  clientName?: string | null;
  coverMedia?: { publicUrl: string } | null;
  imageUrl?: string;
}

interface ServicePortfolioSliderProps {
  serviceName: string;
  serviceSlug: string;
  projects: PortfolioItem[];
}

const fallbackImagesByService: Record<string, string[]> = {
  'branding-design': [
    'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=800&auto=format&fit=crop',
  ],
  'website-design': [
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=800&auto=format&fit=crop',
  ],
  'video-editing': [
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
  ],
  'ai-ugc-video-editing': [
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
  ],
  'digital-marketing': [
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
  ],
  'google-ads': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  ],
};

export default function ServicePortfolioSlider({
  serviceName,
  serviceSlug,
  projects,
}: ServicePortfolioSliderProps) {
  const fallbacks = fallbackImagesByService[serviceSlug] || fallbackImagesByService['branding-design'];

  // Build 4 to 6 items from backend projects with image fallback
  const items = Array.from({ length: 6 }).map((_, i) => {
    const project = projects[i];
    const imgUrl = project?.coverMedia?.publicUrl || project?.imageUrl || fallbacks[i % fallbacks.length];
    return {
      id: project?.id || `item-${i}`,
      title: project?.title || `${serviceName} Showcase 0${i + 1}`,
      clientName: project?.clientName || 'Category Leader',
      image: imgUrl,
    };
  });

  // Split into Row 1 and Row 2, then duplicate for seamless loop
  const row1 = [...items.slice(0, 3), ...items.slice(3, 6)];
  const row2 = [...items.slice(3, 6), ...items.slice(0, 3)];

  const row1Duplicated = [...row1, ...row1];
  const row2Duplicated = [...row2, ...row2];

  return (
    <section className="py-14 sm:py-16 border-t border-white/[0.06] relative overflow-hidden bg-black/40">
      {/* Dynamic Ambient Center Luminescence */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] bg-purple-600/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <AnimateOnScroll variant="fadeRight" className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>// VISUAL SHOWCASE GALLERY</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Selected {serviceName} Work
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Explore our recent sprint productions. Hover over any work to pause and inspect.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeLeft">
            <Link
              href="/portfolio"
              className="px-6 py-3 rounded-full font-heading font-bold text-xs bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/15 hover:border-purple-400/50 transition-all flex items-center gap-2 group shrink-0 shadow-lg"
            >
              <span>Explore All Studio Work</span>
              <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Dual Reverse-Sliding Infinite 1:1 Marquee */}
      <div className="relative w-full space-y-6 select-none overflow-hidden">
        
        {/* Left & Right Gradient Vignette Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-28 sm:w-48 bg-gradient-to-r from-[#08080D] via-[#08080D]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-28 sm:w-48 bg-gradient-to-l from-[#08080D] via-[#08080D]/80 to-transparent z-20 pointer-events-none" />

        {/* ROW 1: Slides Left smoothly at medium speed */}
        <div className="flex items-center overflow-hidden">
          <div className="animate-marquee-infinite flex items-center gap-6 sm:gap-8 py-2">
            {row1Duplicated.map((item, idx) => (
              <div
                key={`r1-${idx}`}
                className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 aspect-square rounded-3xl overflow-hidden border border-white/10 hover:border-purple-400/80 shadow-2xl transition-all duration-500 shrink-0 group cursor-pointer hover:scale-105 bg-[#0F0D1E]"
              >
                {/* 1:1 Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Subtle dark vignette on top/bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-90 transition-opacity" />

                {/* Minimalist Floating Pill (Visible on hover or subtle) */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/80 backdrop-blur-xl border border-white/20 text-white truncate max-w-[80%]">
                    {item.clientName}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-purple-600/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Slides in OPPOSITE Direction (Right) smoothly at medium speed */}
        <div className="flex items-center overflow-hidden">
          <div className="animate-marquee-reverse flex items-center gap-6 sm:gap-8 py-2">
            {row2Duplicated.map((item, idx) => (
              <div
                key={`r2-${idx}`}
                className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 aspect-square rounded-3xl overflow-hidden border border-white/10 hover:border-purple-400/80 shadow-2xl transition-all duration-500 shrink-0 group cursor-pointer hover:scale-105 bg-[#0F0D1E]"
              >
                {/* 1:1 Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Subtle dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-90 transition-opacity" />

                {/* Minimalist Floating Pill */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/80 backdrop-blur-xl border border-white/20 text-white truncate max-w-[80%]">
                    {item.clientName}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-purple-600/80 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
