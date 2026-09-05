import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  Layers, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from './AnimateOnScroll';

interface PortfolioProjectItem {
  id: string;
  slug: string;
  title: string;
  clientName?: string | null;
  shortDesc: string;
  results?: string | null;
  servicesUsed?: string | null;
  projectUrl?: string | null;
  coverMedia?: { publicUrl: string } | null;
}

interface ServicePortfolioSectionProps {
  serviceName: string;
  serviceSlug: string;
  projects: PortfolioProjectItem[];
}

const defaultProjectImages: Record<string, string> = {
  'zenflow-ai-brand-architecture': 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop',
  'hyperion-stealth-rebrand': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
  'apex-ventures-web-flagship': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
  'pulse-commerce-enterprise-storefront': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  'lumina-health-cinema-campaign': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
  'elevate-studios-docu-series': 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop',
  'novatech-viral-ugc-hooks': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop',
  'vantage-capital-fintech-ugc': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  'horizon-saas-omnichannel-growth': 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
  'artisan-goods-retention-engine': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop',
  'cloudscale-pmax-search-defense': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
  'nexus-legal-high-intent-ppc': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
};

export default function ServicePortfolioSection({
  serviceName,
  serviceSlug,
  projects,
}: ServicePortfolioSectionProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 border-t border-white/[0.06] relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <AnimateOnScroll variant="fadeRight" className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Verified Production Portfolio</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Featured {serviceName} Case Studies
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Real sprint executions engineered for market authority, quantitative ROI, and rapid client scale.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fadeLeft">
            <Link
              href="/portfolio"
              className="px-6 py-3 rounded-full font-heading font-bold text-xs bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/15 hover:border-purple-400/50 transition-all flex items-center gap-2 group shrink-0"
            >
              <span>Explore All Studio Work</span>
              <ArrowUpRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </AnimateOnScroll>
        </div>

        {/* Project Cards Grid */}
        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => {
            const results = project.results ? JSON.parse(project.results) : {};
            const services = project.servicesUsed ? JSON.parse(project.servicesUsed) : [];
            const displayImg = project.coverMedia?.publicUrl || defaultProjectImages[project.slug] || 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop';

            return (
              <StaggerItem key={project.id} variant="scaleUp">
                <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#130E26]/90 to-[#0A0717]/95 p-6 sm:p-7 shadow-2xl backdrop-blur-2xl hover:border-purple-500/50 hover:shadow-purple-950/40 transition-all duration-500 flex flex-col justify-between h-full">
                  
                  {/* Image Showcase Container */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-6 bg-black/40 border border-white/[0.08]">
                    <img
                      src={displayImg}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Client Badge */}
                    {project.clientName && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-black/80 backdrop-blur-xl border border-white/15 text-white">
                          {project.clientName}
                        </span>
                      </div>
                    )}

                    {/* Deliverable Tags on Image */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-1.5">
                      {services.map((s: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="space-y-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm mt-2 leading-relaxed line-clamp-3">
                        {project.shortDesc}
                      </p>
                    </div>

                    {/* Quantitative Results Strip */}
                    {Object.keys(results).length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.08]">
                        {Object.entries(results).map(([key, val], i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center"
                          >
                            <span className="text-xs sm:text-sm font-heading font-black text-emerald-400 block truncate">
                              {String(val)}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tight block truncate mt-0.5">
                              {key}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <span className="text-xs font-mono text-purple-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified Case Study</span>
                      </span>

                      <Link
                        href="/portfolio"
                        className="text-xs font-heading font-bold text-white hover:text-purple-300 flex items-center gap-1 transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
