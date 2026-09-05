'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface ClientItem {
  id?: string;
  name: string;
  websiteUrl?: string | null;
  logoMedia?: { publicUrl: string; altText?: string | null } | null;
}

interface ClientsMarqueeProps {
  title?: string;
  subtitle?: string;
  clients?: ClientItem[];
  variant?: 'home' | 'service';
}

// Custom authentic SVG brand marks for top-tier agency presentation - enlarged & bold
const brandLogos = [
  {
    name: 'APEX VENTURES',
    svg: (
      <svg className="h-8 sm:h-9 w-auto" viewBox="0 0 185 36" fill="currentColor">
        <polygon points="14,4 3,32 25,32" fill="none" stroke="currentColor" strokeWidth="3" />
        <polygon points="14,14 8,27 20,27" fill="currentColor" opacity="0.8" />
        <text x="36" y="24" fontFamily="var(--font-heading)" fontSize="15" fontWeight="900" letterSpacing="0.16em">
          APEX VENTURES
        </text>
      </svg>
    ),
  },
  {
    name: 'NOVATECH GLOBAL',
    svg: (
      <svg className="h-8 sm:h-9 w-auto" viewBox="0 0 165 36" fill="currentColor">
        <circle cx="14" cy="18" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M8 18 Q14 8, 20 18 Q14 28, 8 18" fill="currentColor" opacity="0.8" />
        <text x="34" y="24" fontFamily="var(--font-heading)" fontSize="15" fontWeight="900" letterSpacing="0.16em">
          NOVATECH
        </text>
      </svg>
    ),
  },
  {
    name: 'LUMINA HEALTH',
    svg: (
      <svg className="h-8 sm:h-9 w-auto" viewBox="0 0 150 36" fill="currentColor">
        <path d="M14 4 L16.5 13.5 L26 16 L16.5 18.5 L14 28 L11.5 18.5 L2 16 L11.5 13.5 Z" fill="currentColor" />
        <text x="34" y="24" fontFamily="var(--font-heading)" fontSize="15" fontWeight="900" letterSpacing="0.16em">
          LUMINA
        </text>
      </svg>
    ),
  },
  {
    name: 'HYPERION AI',
    svg: (
      <svg className="h-8 sm:h-9 w-auto" viewBox="0 0 160 36" fill="currentColor">
        <rect x="4" y="6" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <rect x="10" y="12" width="6" height="6" fill="currentColor" opacity="0.9" />
        <text x="32" y="24" fontFamily="var(--font-heading)" fontSize="15" fontWeight="900" letterSpacing="0.18em">
          HYPERION
        </text>
      </svg>
    ),
  },
  {
    name: 'PULSE COMMERCE',
    svg: (
      <svg className="h-8 sm:h-9 w-auto" viewBox="0 0 150 36" fill="currentColor">
        <polyline points="2,18 6,18 10,8 14,28 18,12 21,22 25,18 29,18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="38" y="24" fontFamily="var(--font-heading)" fontSize="15" fontWeight="900" letterSpacing="0.16em">
          PULSE
        </text>
      </svg>
    ),
  },
  {
    name: 'ELEVATE STUDIOS',
    svg: (
      <svg className="h-8 sm:h-9 w-auto" viewBox="0 0 155 36" fill="currentColor">
        <path d="M4 25 L11 11 L18 18 L25 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="20,7 25,7 25,12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="34" y="24" fontFamily="var(--font-heading)" fontSize="15" fontWeight="900" letterSpacing="0.18em">
          ELEVATE
        </text>
      </svg>
    ),
  },
  {
    name: 'VANTAGE CAPITAL',
    svg: (
      <svg className="h-8 sm:h-9 w-auto" viewBox="0 0 160 36" fill="currentColor">
        <polygon points="14,5 24,18 14,31 4,18" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="14" cy="18" r="3.5" fill="currentColor" opacity="0.8" />
        <text x="34" y="24" fontFamily="var(--font-heading)" fontSize="15" fontWeight="900" letterSpacing="0.16em">
          VANTAGE
        </text>
      </svg>
    ),
  },
  {
    name: 'ZENFLOW SYSTEMS',
    svg: (
      <svg className="h-8 sm:h-9 w-auto" viewBox="0 0 165 36" fill="currentColor">
        <circle cx="14" cy="18" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4" />
        <circle cx="14" cy="18" r="4.5" fill="currentColor" opacity="0.8" />
        <text x="34" y="24" fontFamily="var(--font-heading)" fontSize="15" fontWeight="900" letterSpacing="0.16em">
          ZENFLOW
        </text>
      </svg>
    ),
  },
];

export default function ClientsMarquee({
  title = 'Engineered For Visionary Founders & Category Leaders Scaling $10M–$100M+',
  subtitle,
  variant = 'home',
  clients = [],
}: ClientsMarqueeProps) {
  const hasDbClients = clients && clients.length > 0;

  // If dynamic clients are provided from CMS, format them
  const clientList = hasDbClients
    ? clients.map((c, idx) => ({
        id: c.id || `c-${idx}`,
        name: c.name,
        logoUrl: c.logoMedia?.publicUrl || null,
        svg: brandLogos[idx % brandLogos.length]?.svg || null,
      }))
    : brandLogos.map((b, idx) => ({
        id: `b-${idx}`,
        name: b.name,
        logoUrl: null,
        svg: b.svg,
      }));

  // Duplicate for seamless 360 infinite loop
  const duplicated = [...clientList, ...clientList];

  return (
    <section className="relative overflow-hidden py-7 sm:py-9 bg-gradient-to-b from-[#06050C] via-[#0B0917] to-[#06050C] border-y border-white/[0.08]">
      {/* Dynamic ambient center luminescence */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[90px] bg-purple-600/15 blur-[80px] pointer-events-none" />

      {/* Sleek Top Badge with minimal margin */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-5 text-center relative z-10">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] text-gray-200 border border-white/10 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wide text-xs sm:text-sm text-gray-200 font-medium">{title}</span>
        </div>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1.5 font-medium">{subtitle}</p>
        )}
      </div>

      {/* Infinite Scrolling Track with Gradient Edge Masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Gradient Vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-[#06050C] via-[#06050C]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-[#06050C] via-[#06050C]/90 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-infinite flex items-center gap-6 sm:gap-8 py-2">
          {duplicated.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex items-center justify-center shrink-0 cursor-default group"
            >
              <div className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white/80 group-hover:text-white group-hover:bg-white/[0.07] group-hover:border-purple-500/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300 backdrop-blur-sm flex items-center">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-7 sm:h-8 w-auto max-w-[150px] object-contain filter brightness-90 contrast-125 group-hover:brightness-100 transition-all"
                  />
                ) : brand.svg ? (
                  brand.svg
                ) : (
                  <span className="font-heading font-black text-sm tracking-widest text-white/90 uppercase">
                    {brand.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
