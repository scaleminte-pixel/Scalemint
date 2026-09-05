'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Code2, 
  ShieldCheck, 
  Maximize2, 
  CheckCircle2, 
  Cpu, 
  Eye, 
  Grid3X3,
  Sliders,
  Flame,
  Palette,
  Layout,
  Film,
  Zap,
  Target
} from 'lucide-react';

interface ServiceHeroVisualProps {
  serviceSlug: string;
  serviceName: string;
  tag: string;
  displayImage: string;
}

const serviceMetaSpecs: Record<string, {
  topBadge: string;
  badgeIcon: any;
  fps: string;
  resolution: string;
  engine: string;
  colorPalette: string[];
  specs: { label: string; val: string }[];
}> = {
  'branding-design': {
    topBadge: '16-Grid Vector Canvas • Pantone 2026',
    badgeIcon: Palette,
    fps: 'Vector Math',
    resolution: 'Infinite Scalability',
    engine: 'Typography & Token Engine',
    colorPalette: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'],
    specs: [
      { label: 'Color Space', val: 'sRGB / P3 / CMYK' },
      { label: 'WCAG Contrast', val: '21:1 AAA Verified' },
      { label: 'Typography Pairing', val: 'Grotesque + Mono' },
      { label: 'Export Clearspace', val: '32px Infinite Vector' },
    ],
  },
  'website-design': {
    topBadge: 'Next.js 14 • 99+ Core Web Vitals',
    badgeIcon: Layout,
    fps: '60 FPS Motion',
    resolution: 'Sub-300ms LCP',
    engine: 'React Server Components',
    colorPalette: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981'],
    specs: [
      { label: 'Framework', val: 'Next.js 14 App Router' },
      { label: 'Bundle Weight', val: 'Zero Client Hydration Bloat' },
      { label: 'Lighthouse Score', val: '99 Performance / 100 SEO' },
      { label: 'Edge Routing', val: 'Global CDN Deployed' },
    ],
  },
  'video-editing': {
    topBadge: '4K Apple ProRes 422 HQ • Master Cut',
    badgeIcon: Film,
    fps: '60 FPS UHD',
    resolution: '3840 x 2160 Broadcast',
    engine: 'Dynamic Sound & Color LUT',
    colorPalette: ['#EC4899', '#8B5CF6', '#3B82F6', '#EAB308'],
    specs: [
      { label: 'Color Grade', val: 'Rec.709 Cinematic LUT' },
      { label: 'Audio Mastering', val: '-14 LUFS Broadcast Standard' },
      { label: 'Kinetic Motion', val: 'Beat-Matched Titles' },
      { label: 'Export Codecs', val: 'ProRes 422 + H.265' },
    ],
  },
  'ai-ugc-video-editing': {
    topBadge: '87% 3-Second Hook Retention Machine',
    badgeIcon: Flame,
    fps: '9:16 Vertical',
    resolution: '1080 x 1920 Mobile Native',
    engine: 'Algorithmic Pattern Interrupt',
    colorPalette: ['#F59E0B', '#EF4444', '#8B5CF6', '#10B981'],
    specs: [
      { label: 'Hook Pacing', val: '0.8s Pattern Interrupt' },
      { label: 'Subtitles', val: 'Dynamic Karaoke Kinetic' },
      { label: 'Target Platforms', val: 'TikTok, Reels, Shorts' },
      { label: 'A/B Hook Variations', val: '3-5 Per Asset Sprint' },
    ],
  },
  'digital-marketing': {
    topBadge: '3.8x Blended ROAS • Omnichannel Funnel',
    badgeIcon: Zap,
    fps: 'Real-Time CAPI',
    resolution: 'Server-Side Attribution',
    engine: 'Automated Lifecycle Engine',
    colorPalette: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
    specs: [
      { label: 'Attribution', val: 'Server-Side GA4 + Meta CAPI' },
      { label: 'Conversion Lift', val: '+44% Funnel Velocity' },
      { label: 'Retention Cadence', val: '12 Behavioral Email Flows' },
      { label: 'CAC Optimization', val: '-38% Blended Acquisition' },
    ],
  },
  'google-ads': {
    topBadge: '9.8/10 Quality Score • Exact Intent Shield',
    badgeIcon: Target,
    fps: 'Smart Bidding',
    resolution: 'High Commercial Intent',
    engine: 'PMax + Search Defense',
    colorPalette: ['#06B6D4', '#3B82F6', '#10B981', '#8B5CF6'],
    specs: [
      { label: 'Negative Keywords', val: '4,000+ Waste Shield' },
      { label: 'Quality Score', val: '9.8 / 10 Average' },
      { label: 'Search Top-of-Page', val: '91.4% Dominance' },
      { label: 'Conversion Tracking', val: 'Google Enhanced Conversions' },
    ],
  },
};

export default function ServiceHeroVisual({
  serviceSlug,
  serviceName,
  tag,
  displayImage,
}: ServiceHeroVisualProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'blueprint' | 'specs'>('preview');

  const meta = serviceMetaSpecs[serviceSlug] || serviceMetaSpecs['website-design'];
  const BadgeIcon = meta.badgeIcon;

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none select-none">
      {/* Dynamic Ambient Neon Aura behind the glass card */}
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-blue-600/30 rounded-3xl blur-3xl opacity-75 animate-pulse -z-10" />
      <div className="absolute top-1/2 -left-8 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Floating Apple-Style Spec Badge (Top Right) */}
      <div className="absolute -top-5 -right-2 sm:-right-4 z-20 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="px-3.5 py-1.5 rounded-full bg-[#0E0A22]/85 backdrop-blur-2xl border border-white/20 shadow-xl shadow-purple-950/40 flex items-center gap-2 ring-1 ring-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <BadgeIcon className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] font-mono font-bold text-white tracking-tight">
            {meta.topBadge}
          </span>
        </div>
      </div>

      {/* Main Apple VisionOS Glass Studio Canvas */}
      <div className="relative rounded-3xl border border-white/20 bg-gradient-to-b from-[#15102E]/90 via-[#0E0B1F]/95 to-[#070512] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden ring-1 ring-white/10 group transition-all duration-500 hover:shadow-purple-900/30">
        
        {/* Specular Edge Highlight (Apple Glass Signature) */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-30" />
        
        {/* Top Control Bar (macOS / VisionOS Traffic Lights + Interactive Mode Switcher) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-black/40 backdrop-blur-md relative z-20">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-sm" />
            <span className="ml-2 text-[11px] font-mono text-gray-400 hidden sm:inline-block">
              {serviceName.toLowerCase()}.canvas
            </span>
          </div>

          {/* Interactive Viewport Tabs */}
          <div className="flex items-center bg-white/[0.05] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                viewMode === 'preview'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Canvas</span>
            </button>

            <button
              onClick={() => setViewMode('blueprint')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                viewMode === 'blueprint'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Grid3X3 className="w-3 h-3" />
              <span>Blueprint</span>
            </button>

            <button
              onClick={() => setViewMode('specs')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                viewMode === 'specs'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Telemetry</span>
            </button>
          </div>
        </div>

        {/* Viewport Stage */}
        <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-[#070512]">
          {/* MODE 1: INTERACTIVE HIGH-RES CANVAS */}
          {viewMode === 'preview' && (
            <div className="relative w-full h-full animate-in fade-in zoom-in-95 duration-400">
              <img
                src={displayImage}
                alt={serviceName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Dynamic Overlay HUD Elements */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-xl border border-white/15 text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  {meta.fps}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-xl">
                  {meta.resolution}
                </span>
              </div>

              {/* Color Swatch Dots */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15">
                {meta.colorPalette.map((c, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full border border-white/30 shadow-sm"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                <div>
                  <div className="text-[11px] font-mono text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Discipline Architecture</span>
                  </div>
                  <h4 className="font-heading text-lg font-extrabold text-white tracking-tight drop-shadow-md">
                    {serviceName}
                  </h4>
                </div>

                <div className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Production Ready</span>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: BLUEPRINT ARCHITECTURAL X-RAY */}
          {viewMode === 'blueprint' && (
            <div className="relative w-full h-full bg-[#0A071A] p-6 flex flex-col justify-between animate-in fade-in duration-300">
              {/* Technical Grid Lines */}
              <div 
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(168, 85, 247, 0.4) 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Blueprint Header */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-purple-500/20">
                <span className="text-xs font-mono text-purple-400 uppercase tracking-widest">// SYSTEM BLUEPRINT SPEC</span>
                <span className="text-[10px] font-mono text-gray-400">ENGINE: {meta.engine}</span>
              </div>

              {/* Blueprint Visual Hierarchy Mockup */}
              <div className="relative z-10 grid grid-cols-12 gap-3 my-auto">
                <div className="col-span-8 rounded-xl border border-dashed border-purple-400/40 p-3 bg-purple-950/20 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-purple-300">
                    <span>ROOT_CONTAINER.tsx</span>
                    <span className="text-emerald-400">STATUS: VALIDATED</span>
                  </div>
                  <div className="h-3 rounded bg-purple-500/20 w-3/4 animate-pulse" />
                  <div className="h-3 rounded bg-white/10 w-1/2" />
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="h-10 rounded border border-white/10 bg-white/[0.03] flex items-center justify-center text-[9px] font-mono text-gray-400">
                      TOKEN_A
                    </div>
                    <div className="h-10 rounded border border-white/10 bg-white/[0.03] flex items-center justify-center text-[9px] font-mono text-gray-400">
                      TOKEN_B
                    </div>
                    <div className="h-10 rounded border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-[9px] font-mono text-purple-300">
                      HERO_NODE
                    </div>
                  </div>
                </div>

                <div className="col-span-4 rounded-xl border border-dashed border-blue-400/40 p-3 bg-blue-950/20 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-blue-300">TELEMETRY_PIPELINE</span>
                  <div className="space-y-1.5 text-[9px] font-mono text-gray-300">
                    <div className="flex justify-between"><span>LATENCY</span><span className="text-emerald-400">0.2ms</span></div>
                    <div className="flex justify-between"><span>CACHE</span><span className="text-purple-300">100% HIT</span></div>
                    <div className="flex justify-between"><span>WCAG</span><span className="text-blue-300">AAA</span></div>
                  </div>
                </div>
              </div>

              {/* Blueprint Footer */}
              <div className="relative z-10 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>ARCHITECTURAL RESOLUTION: 4096 x 2160</span>
                <span className="text-purple-400">ZERO TECHNICAL DEBT</span>
              </div>
            </div>
          )}

          {/* MODE 3: DISCIPLINE CODE & TELEMETRY */}
          {viewMode === 'specs' && (
            <div className="relative w-full h-full bg-[#080514] p-5 font-mono text-xs text-gray-300 flex flex-col justify-between animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-[10px] text-gray-400">
                <span className="text-purple-400 uppercase tracking-widest">// DIRECT PRODUCTION SPECS</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE
                </span>
              </div>

              <div className="space-y-3 py-2">
                {meta.specs.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.06]"
                  >
                    <span className="text-gray-400 text-[11px]">{item.label}:</span>
                    <span className="text-white font-bold text-[11px]">{item.val}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-purple-300">
                <span>LICENSE: FULL ENTERPRISE COMMERCIAL</span>
                <span className="text-white font-bold">100% SOURCE ACCESS</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Floating Pill (Overlapping Glass Ribbon) */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-black/40 backdrop-blur-md flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-medium">100% Full Source IP & Deliverable Handover</span>
          </div>
          <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-wider">
            {tag}
          </span>
        </div>
      </div>
    </div>
  );
}
