'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  CheckCircle2
} from 'lucide-react';

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PortfolioFilterGridProps {
  categories: Category[];
  projects: Project[];
}

const defaultImages: Record<string, string> = {
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

export default function PortfolioFilterGrid({
  categories,
  projects,
}: PortfolioFilterGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category?.slug === activeCategory);

  return (
    <div className="space-y-12">
      {/* Filter Navigation Tabs */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#0D0A1C]/80 backdrop-blur-2xl border border-white/15 overflow-x-auto max-w-full no-scrollbar shadow-xl ring-1 ring-white/10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-xs font-heading font-semibold transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            All Work ({projects.length})
          </button>

          {categories.map((cat) => {
            const count = projects.filter((p) => p.category?.slug === cat.slug).length;
            const isActive = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-heading font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => {
          const results = project.results ? JSON.parse(project.results) : {};
          const services = project.servicesUsed ? JSON.parse(project.servicesUsed) : [];
          const displayImg = project.coverMedia?.publicUrl || defaultImages[project.slug] || 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop';

          return (
            <div
              key={project.id}
              className="group rounded-3xl border border-white/10 bg-gradient-to-b from-[#130E26]/90 to-[#0A0717]/95 p-6 shadow-2xl backdrop-blur-2xl hover:border-purple-500/50 hover:shadow-purple-950/50 transition-all duration-400 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-5 bg-black/40 border border-white/[0.08]">
                  <img
                    src={displayImg}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {project.clientName && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-black/80 backdrop-blur-xl border border-white/15 text-white">
                        {project.clientName}
                      </span>
                    </div>
                  )}

                  {/* Category Pill */}
                  {project.category && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md">
                        {project.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="font-heading text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-xs mt-2 leading-relaxed line-clamp-2">
                  {project.shortDesc}
                </p>
              </div>

              {/* Metrics */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] space-y-3">
                {Object.keys(results).length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(results).slice(0, 2).map(([key, val], i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center"
                      >
                        <span className="text-xs font-heading font-black text-emerald-400 block truncate">
                          {String(val)}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tight block truncate">
                          {key}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] font-mono text-purple-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Case Study Verified</span>
                  </span>
                  <Link
                    href="/#contact"
                    className="text-white hover:text-purple-300 font-semibold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Request Demo</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
