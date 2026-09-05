'use client';

import React from 'react';
import Link from 'next/link';
import {
  Palette,
  Layout,
  Film,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
} from 'lucide-react';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from './AnimateOnScroll';

interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  shortDesc: string;
  startingPrice?: string | null;
  whatIsIncluded?: string[] | null;
  coverMedia?: { publicUrl: string; altText?: string | null } | null;
}

interface ServicesGridProps {
  services: ServiceItem[];
  sectionBadge?: string | null;
  sectionTitle?: string | null;
  sectionSubtitle?: string | null;
}

export default function ServicesGrid({
  services,
  sectionBadge,
  sectionTitle,
  sectionSubtitle,
}: ServicesGridProps) {
  const defaultVisuals: Record<string, { image: string; tag: string }> = {
    'branding-design': {
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop',
      tag: 'Identity & Guidelines',
    },
    'website-design': {
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
      tag: 'Next.js & UI/UX',
    },
    'video-editing': {
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
      tag: 'Cinematic Post-Production',
    },
    'ai-ugc-video-editing': {
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop',
      tag: 'Viral Mobile Ad Hooks',
    },
    'digital-marketing': {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      tag: 'Funnels & Retention',
    },
    'google-ads': {
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      tag: 'PMax & Search Intent',
    },
  };

  const getIcon = (slug: string) => {
    switch (slug) {
      case 'branding-design':
        return <Palette className="w-5 h-5 text-purple-400" />;
      case 'website-design':
        return <Layout className="w-5 h-5 text-blue-400" />;
      case 'video-editing':
        return <Film className="w-5 h-5 text-indigo-400" />;
      case 'ai-ugc-video-editing':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'digital-marketing':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'google-ads':
        return <Target className="w-5 h-5 text-cyan-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const borderColors = [
    'hover:border-purple-500/50',
    'hover:border-blue-500/50',
    'hover:border-indigo-500/50',
    'hover:border-amber-500/50',
    'hover:border-emerald-500/50',
    'hover:border-cyan-500/50',
  ];

  return (
    <section id="services" className="py-14 sm:py-16 relative overflow-hidden">
      {/* Dynamic ambient lighting */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimateOnScroll variant="fadeUp" className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 shadow-glow-purple/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{sectionBadge || 'Comprehensive 360° Disciplines'}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {sectionTitle || 'Six Specialized Pillars. One Unified Squad.'}
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {sectionSubtitle || 'Every capability is executed with direct-response intent and aesthetic prestige so your brand commands authority and delivers commercial ROI.'}
          </p>
        </AnimateOnScroll>

        {/* Clean Minimal Service Cards */}
        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const visual = defaultVisuals[service.slug] || {
              image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
              tag: 'Full Spectrum',
            };

            const displayImage = service.coverMedia?.publicUrl || visual.image;

            return (
              <StaggerItem key={service.id || service.slug} variant="fadeUp">
                <Link
                  href={`/services/${service.slug}`}
                  className={`block glass-card rounded-2xl overflow-hidden border border-agency-border group transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover ${borderColors[index % borderColors.length]} h-full`}
                >
                  {/* Visual Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-agency-dark">
                    <img
                      src={displayImage}
                      alt={service.coverMedia?.altText || service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10101C] via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                        {visual.tag}
                      </span>
                      <span className="font-heading font-black text-xs text-white/70">
                        0{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Minimal Card Content — Name + Icon + CTA Only */}
                  <div className="p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-agency-dark flex items-center justify-center border border-agency-border group-hover:border-purple-500/50 transition-colors shrink-0">
                        {getIcon(service.slug)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug truncate">
                          {service.name}
                        </h3>
                        {service.tagline && (
                          <p className="text-[11px] text-gray-400 font-medium truncate">
                            {service.tagline}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-agency-card border border-agency-border flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:border-purple-500 transition-all">
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
