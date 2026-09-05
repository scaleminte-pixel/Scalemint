'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Zap, 
  CheckCircle2, 
  Clock, 
  FileCode2, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  Palette,
  Layout,
  Film,
  Flame,
  Target,
  Copy,
  Check,
  Code,
  Download,
  Eye,
  Sliders,
  Maximize2
} from 'lucide-react';

interface DeliverableItem {
  id: string;
  name: string;
  type: string;
  format: string;
  desc: string;
  icon: any;
  color: string;
  accentGlow: string;
  previewType: 'vector' | 'tokens' | 'figma' | 'deck' | 'code' | 'video' | 'ad';
}

interface MilestoneItem {
  day: string;
  phase: string;
  detail: string;
  deliverable: string;
  progress: number;
}

interface MetricItem {
  metric: string;
  label: string;
  context: string;
  badge: string;
  growth: string;
}

interface ServiceDisciplineConsoleProps {
  serviceSlug: string;
  serviceName: string;
  deliverables?: string[];
}

const serviceConsoleData: Record<string, {
  tagline: string;
  deliverables: DeliverableItem[];
  milestones: MilestoneItem[];
  metrics: MetricItem[];
}> = {
  'branding-design': {
    tagline: 'Vector Master Systems, Typographic Engines & Design Token Libraries',
    deliverables: [
      {
        id: 'vector-master',
        name: 'Core Master Vector System',
        type: 'Vector Architecture',
        format: '.SVG • .EPS • .AI',
        desc: 'Mathematical bezier curves with strict clearspace margins, infinite scalability, and monochrome inversion matrices.',
        icon: Palette,
        color: 'from-purple-500 to-indigo-500 text-purple-300',
        accentGlow: 'rgba(168, 85, 247, 0.4)',
        previewType: 'vector',
      },
      {
        id: 'tokens-matrix',
        name: 'Design Token Matrix',
        type: 'Variables & Theming',
        format: 'tokens.json • .CSS',
        desc: 'Hex, RGB, HSL tokens with light/dark mode semantic pairs, verified for WCAG 2.1 AAA accessibility contrast.',
        icon: Code,
        color: 'from-blue-500 to-cyan-500 text-blue-300',
        accentGlow: 'rgba(59, 130, 246, 0.4)',
        previewType: 'tokens',
      },
      {
        id: 'brand-portal',
        name: 'Interactive Brand Portal',
        type: 'Figma Auto-Layout 5.0',
        format: '.FIG System',
        desc: 'Comprehensive visual documentation, dynamic type hierarchy, responsive layout rules, and photographic art direction.',
        icon: Layout,
        color: 'from-pink-500 to-rose-500 text-pink-300',
        accentGlow: 'rgba(236, 72, 153, 0.4)',
        previewType: 'figma',
      },
      {
        id: 'collateral-suite',
        name: 'Executive Collateral Suite',
        type: 'Pitch & Stationery',
        format: 'Print PDF • Keynote',
        desc: 'Bespoke investor pitch deck templates, executive stationery mockups, and corporate correspondence typography.',
        icon: FileCode2,
        color: 'from-amber-500 to-orange-500 text-amber-300',
        accentGlow: 'rgba(245, 158, 11, 0.4)',
        previewType: 'deck',
      },
    ],
    milestones: [
      { day: 'Day 01 - 03', phase: 'Competitive Positioning & Mood Architecture', detail: 'Exhaustive audit of category competitors and formulation of 3 distinct creative direction moods.', deliverable: 'Positioning Blueprint', progress: 25 },
      { day: 'Day 04 - 07', phase: 'Mark Construction & Type Synthesis', detail: 'Mathematical anchor-point construction, typographic pairings, and color physics validation.', deliverable: 'Primary Vector System', progress: 50 },
      { day: 'Day 08 - 10', phase: 'Digital Stress-Testing & UI Tokens', deliverable: 'Token Library Export', detail: 'Validating marks across mobile app icons, digital UI, billboards, and high-contrast dark modes.', progress: 75 },
      { day: 'Day 11 - 12', phase: 'Complete IP Rights & Handover', detail: '100% intellectual property transfer, packaged asset folders, and developer token exports.', deliverable: 'Master Vault Handover', progress: 100 },
    ],
    metrics: [
      { metric: '100%', label: 'Vector Purity', context: 'Pixel-perfect SVG geometry verified for infinite scalability without distortion.', badge: 'Mathematical Precision', growth: '+100%' },
      { metric: '21:1', label: 'WCAG AAA Contrast', context: 'Complies with the highest international accessibility and legibility standards.', badge: 'Accessibility Gold', growth: 'AAA Rated' },
      { metric: '0%', label: 'Junior Delegation', context: 'Every asset is crafted directly by senior brand architects with zero junior delegation.', badge: 'Senior Led', growth: 'Guaranteed' },
    ],
  },
  'website-design': {
    tagline: 'Next.js 14 App Router Flagships, Server Components & Sub-Second LCP',
    deliverables: [
      {
        id: 'nextjs-repo',
        name: 'Production Next.js 14 Repository',
        type: 'Full-Stack Code',
        format: '.TSX • Tailwind • Git',
        desc: 'Server Components architecture, zero client-bundle bloat, edge routing, and clean TypeScript codebase.',
        icon: Code,
        color: 'from-blue-500 to-indigo-500 text-blue-300',
        accentGlow: 'rgba(59, 130, 246, 0.4)',
        previewType: 'code',
      },
      {
        id: 'figma-library',
        name: 'Atomic Component Design System',
        type: 'Figma Library',
        format: 'Auto-Layout 5.0',
        desc: 'Over 300+ responsive atomic components with interactive hover, focus, disabled, and active states.',
        icon: Layout,
        color: 'from-purple-500 to-pink-500 text-purple-300',
        accentGlow: 'rgba(168, 85, 247, 0.4)',
        previewType: 'figma',
      },
      {
        id: 'cro-funnel',
        name: 'High-Conversion Architecture',
        type: 'CRO Blueprint',
        format: 'Figma & Analytics Spec',
        desc: 'Engineered conversion funnels, friction-free multi-step forms, and automated lead capture webhooks.',
        icon: Zap,
        color: 'from-emerald-500 to-teal-500 text-emerald-300',
        accentGlow: 'rgba(16, 185, 129, 0.4)',
        previewType: 'vector',
      },
      {
        id: 'perf-pack',
        name: 'Lighthouse 99+ Performance Pack',
        type: 'Speed Optimization',
        format: 'Core Web Vitals',
        desc: 'Sub-300ms Largest Contentful Paint (LCP), font preloading, Next/Image optimization, and SEO schema.',
        icon: TrendingUp,
        color: 'from-amber-500 to-orange-500 text-amber-300',
        accentGlow: 'rgba(245, 158, 11, 0.4)',
        previewType: 'tokens',
      },
    ],
    milestones: [
      { day: 'Day 01 - 03', phase: 'Information Architecture & Wireframing', detail: 'User flow mapping, conversion hierarchy, and interactive low-fidelity clickable wireframes.', deliverable: 'UX Architecture Map', progress: 25 },
      { day: 'Day 04 - 08', phase: 'High-Fidelity UI/UX & Motion Synthesis', detail: 'Visual design, glassmorphic accents, bespoke micro-interactions, and responsive typography.', deliverable: 'Interactive Prototype', progress: 55 },
      { day: 'Day 09 - 13', phase: 'Next.js Production Engineering & CMS', detail: 'Clean TypeScript build, dynamic database integration, and cross-browser QA testing.', deliverable: 'Staging Environment', progress: 85 },
      { day: 'Day 14', phase: 'Lighthouse Audit & Production Go-Live', detail: 'Final performance tuning, SSL/DNS deployment, and full Git repository ownership transfer.', deliverable: '100% Production Launch', progress: 100 },
    ],
    metrics: [
      { metric: '99+', label: 'Google Lighthouse', context: 'Sub-second page load times across mobile and desktop devices globally.', badge: 'Core Web Vitals', growth: '0.2s LCP' },
      { metric: '+142%', label: 'Inbound Lead Velocity', context: 'Friction-free UX funnels engineered to convert high-intent traffic into qualified pipeline.', badge: 'CRO Engineered', growth: '2.4x Lift' },
      { metric: '100%', label: 'Full Git Ownership', context: 'Full Git repository access with zero proprietary CMS lock-in or agency hostage fees.', badge: 'Zero Lock-in', growth: 'Day 1 Handover' },
    ],
  },
  'video-editing': {
    tagline: 'Broadcast-Grade 4K Apple ProRes Masters, Kinetic Motion & Sound Design',
    deliverables: [
      {
        id: 'prores-masters',
        name: 'Apple ProRes 422 HQ Masters',
        type: 'Broadcast Grade',
        format: '.MOV • 4K 60FPS',
        desc: 'Uncompressed high-bitrate broadcast masters color-graded in Rec.709 for streaming, web, and cinema.',
        icon: Film,
        color: 'from-pink-500 to-rose-500 text-pink-300',
        accentGlow: 'rgba(236, 72, 153, 0.4)',
        previewType: 'video',
      },
      {
        id: 'kinetic-motion',
        name: 'Kinetic Motion Graphics & Lower-Thirds',
        type: 'Motion Design',
        format: 'After Effects • Premiere',
        desc: 'Custom kinetic typography, rhythmic beat-matched transitions, dynamic sound-synced titles, and overlays.',
        icon: Zap,
        color: 'from-purple-500 to-indigo-500 text-purple-300',
        accentGlow: 'rgba(168, 85, 247, 0.4)',
        previewType: 'vector',
      },
      {
        id: 'audio-mastering',
        name: 'Studio Audio Mastering Suite',
        type: 'Sound Design',
        format: '24-Bit WAV • Dolby',
        desc: 'Multi-track foley sound effects, voice leveling, noise suppression, and commercial score license.',
        icon: Sparkles,
        color: 'from-amber-500 to-orange-500 text-amber-300',
        accentGlow: 'rgba(245, 158, 11, 0.4)',
        previewType: 'tokens',
      },
      {
        id: 'multi-cut',
        name: 'Platform-Optimized Social Cuts',
        type: 'Digital Delivery',
        format: '9:16 Vertical • 16:9 Landscape',
        desc: 'Pre-rendered high-compression MP4 cuts optimized for YouTube, Reels, and paid advertising campaigns.',
        icon: FileCode2,
        color: 'from-blue-500 to-cyan-500 text-blue-300',
        accentGlow: 'rgba(59, 130, 246, 0.4)',
        previewType: 'deck',
      },
    ],
    milestones: [
      { day: 'Day 01', phase: 'Footage Ingestion & Script Breakdown', detail: 'Organizing raw footage, applying custom LUTs, and establishing narrative pacing.', deliverable: 'Storyboard Assembly', progress: 25 },
      { day: 'Day 02 - 04', phase: 'The Rough Cut & Cadence Assembly', detail: 'Trimming A-roll, beat-matching kinetic graphics, and submitting first cut for client review.', deliverable: 'First Review Cut', progress: 55 },
      { day: 'Day 05 - 06', phase: 'Sound Design & Final Color Grade', detail: 'Foley sound effects, audio normalization to -14 LUFS, and cinematic color correction.', deliverable: 'Polished Master', progress: 85 },
      { day: 'Day 07', phase: 'Multi-Format Render & Project Delivery', detail: '4K ProRes exports, high-compression web cuts, and raw project archive transfer.', deliverable: 'Final Handover', progress: 100 },
    ],
    metrics: [
      { metric: '65%+', label: 'Watch-Through Rate', context: 'High-velocity retention curves engineered to beat YouTube and social algorithms.', badge: 'Algorithm Optimized', growth: 'Top 5%' },
      { metric: '4K', label: 'Native Resolution', context: 'Every single frame color-graded and rendered in ultra-crisp high-bitrate video.', badge: 'ProRes 422 HQ', growth: '60 FPS' },
      { metric: '48h', label: 'First Draft Turnaround', context: 'Rapid first cut delivery so your editorial calendar never stalls or misses release.', badge: 'Rapid Velocity', growth: '2 Business Days' },
    ],
  },
  'ai-ugc-video-editing': {
    tagline: 'High-Retention TikTok & Reels Ad Hooks, Kinetic Karaoke Captions & Direct Response',
    deliverables: [
      {
        id: 'hook-matrix',
        name: '3-Second Viral Hook Variations',
        type: 'Paid Social Ads',
        format: '9:16 Vertical • 4K',
        desc: '3 to 5 pattern-interrupt hook variations per concept to A/B test click-through velocity on TikTok and Meta.',
        icon: Flame,
        color: 'from-amber-500 to-red-500 text-amber-300',
        accentGlow: 'rgba(245, 158, 11, 0.4)',
        previewType: 'ad',
      },
      {
        id: 'kinetic-captions',
        name: 'Dynamic Kinetic Caption Engine',
        type: 'Typography Motion',
        format: 'Karaoke Highlights',
        desc: 'Sound-synced highlighted animated subtitles proven to increase sound-off retention by up to 80%.',
        icon: Layout,
        color: 'from-purple-500 to-pink-500 text-purple-300',
        accentGlow: 'rgba(168, 85, 247, 0.4)',
        previewType: 'tokens',
      },
      {
        id: 'ai-synthesis',
        name: 'Synthetic Voice & Avatar Engine',
        type: 'AI Media',
        format: 'Studio Voiceover',
        desc: 'Ultra-realistic voice cloning, natural cadence synthesis, and high-converting creator overlays.',
        icon: Cpu,
        color: 'from-cyan-500 to-blue-500 text-cyan-300',
        accentGlow: 'rgba(6, 182, 212, 0.4)',
        previewType: 'code',
      },
      {
        id: 'ad-pack',
        name: 'Direct-Response Creative Suite',
        type: 'Ad Formats',
        format: 'Meta & TikTok Ready',
        desc: 'Pre-formatted native ad creatives ready to launch directly into Ads Manager with custom thumbnail frames.',
        icon: Zap,
        color: 'from-emerald-500 to-teal-500 text-emerald-300',
        accentGlow: 'rgba(16, 185, 129, 0.4)',
        previewType: 'deck',
      },
    ],
    milestones: [
      { day: 'Day 01', phase: 'Ad Hook Architecture & Scripting', detail: 'Mining viral competitor trends and drafting high-converting direct-response scripts.', deliverable: 'Script & Hook Matrix', progress: 25 },
      { day: 'Day 02 - 03', phase: 'Synthetic Generation & Footage Assembly', detail: 'Voice synthesis, creator footage curation, and rapid visual pacing assembly.', deliverable: 'Base Cuts', progress: 60 },
      { day: 'Day 04', phase: 'Kinetic Motion & Sound Layering', detail: 'Highlight subtitles, pop sound effects, and pattern-interrupt zoom cuts.', deliverable: 'Multi-Hook Assembly', progress: 85 },
      { day: 'Day 05', phase: 'Multi-Variant Batch Delivery', detail: 'Batch delivery of ready-to-test ad creatives with full commercial licensing.', deliverable: 'Final Ad Vault', progress: 100 },
    ],
    metrics: [
      { metric: '3.8x', label: 'Average ROAS Lift', context: 'Authentic creator-style UGC consistently outperforms glossy corporate commercials.', badge: 'Meta Verified', growth: '+280%' },
      { metric: '0.8s', label: 'Pattern Interrupt Hook', context: 'Engineered specifically to halt scrolling thumbs in the critical first second.', badge: 'Thumbstop Power', growth: '87% Retention' },
      { metric: 'Weekly', label: 'Ad Refresh Cadence', context: 'Continuous creative iterations to prevent ad fatigue and keep customer acquisition low.', badge: 'Continuous Scale', growth: 'Zero Fatigue' },
    ],
  },
  'digital-marketing': {
    tagline: 'Omnichannel Growth Funnels, Server-Side CAPI Tracking & Lifecycle Engines',
    deliverables: [
      {
        id: 'growth-blueprint',
        name: 'Omnichannel Acquisition Funnel',
        type: 'Growth Strategy',
        format: 'Miro • PDF Blueprint',
        desc: 'End-to-end customer journey architecture from cold awareness to high-ticket retention and referral loops.',
        icon: Zap,
        color: 'from-purple-500 to-indigo-500 text-purple-300',
        accentGlow: 'rgba(168, 85, 247, 0.4)',
        previewType: 'vector',
      },
      {
        id: 'capi-stack',
        name: 'Server-Side Attribution Stack',
        type: 'Analytics',
        format: 'GA4 • Meta CAPI • GTM',
        desc: 'Server-side conversion tracking eliminating cookie loss and providing 100% accurate revenue attribution.',
        icon: Code,
        color: 'from-blue-500 to-cyan-500 text-blue-300',
        accentGlow: 'rgba(59, 130, 246, 0.4)',
        previewType: 'code',
      },
      {
        id: 'lifecycle-engine',
        name: 'Lifecycle & Retention Engine',
        type: 'Email & SMS',
        format: '12 Automated Flows',
        desc: 'High-converting behavioral email sequences, abandoned cart triggers, and VIP customer replenishment loops.',
        icon: Flame,
        color: 'from-amber-500 to-orange-500 text-amber-300',
        accentGlow: 'rgba(245, 158, 11, 0.4)',
        previewType: 'tokens',
      },
      {
        id: 'telemetry-dashboard',
        name: 'Executive Growth Dashboard',
        type: 'Live Telemetry',
        format: 'Looker Studio Real-Time',
        desc: 'Real-time Blended CAC, LTV, ROAS, and cohort retention metrics with weekly strategy Loom breakdowns.',
        icon: TrendingUp,
        color: 'from-emerald-500 to-teal-500 text-emerald-300',
        accentGlow: 'rgba(16, 185, 129, 0.4)',
        previewType: 'deck',
      },
    ],
    milestones: [
      { day: 'Week 01', phase: 'Data Audit & Funnel Forensics', detail: 'Auditing past ad spend, tracking leaks, conversion drop-off points, and unit economics.', deliverable: 'Growth Forensic Report', progress: 25 },
      { day: 'Week 02', phase: 'Attribution Setup & Cold Funnel Launch', detail: 'Deploying server-side CAPI tracking and launching cold acquisition test campaigns.', deliverable: 'Live Attribution Stack', progress: 55 },
      { day: 'Week 03', phase: 'Scaling Winning Channels', detail: 'Budget reallocation into top-performing creative angles and lookalike audiences.', deliverable: 'Scaled Campaign Fleet', progress: 80 },
      { day: 'Ongoing', phase: 'Continuous CRO & Retention Sprints', detail: 'Landing page A/B tests, email flow optimization, and maximizing customer lifetime value.', deliverable: 'Continuous Optimization', progress: 100 },
    ],
    metrics: [
      { metric: '3.8x', label: 'Blended ROAS', context: 'Proven performance benchmark achieved across venture-backed scale-ups.', badge: 'Revenue Multiple', growth: '+280%' },
      { metric: '100%', label: 'Data Transparency', context: 'Direct live dashboard access with zero vanity metrics; only revenue and profit counted.', badge: 'Server-Side CAPI', growth: 'Real-Time' },
      { metric: '24/7', label: 'Direct Slack Channel', context: 'Proactive, asynchronous communication with senior growth directors.', badge: 'Direct Comms', growth: 'Zero Meetings' },
    ],
  },
  'google-ads': {
    tagline: 'Performance Max Precision, Single Theme Ad Groups & High-Intent Search Defense',
    deliverables: [
      {
        id: 'search-defense',
        name: 'High-Intent Search Architecture',
        type: 'Search Campaigns',
        format: 'Single Theme Ad Groups',
        desc: 'Negative keyword shielding with 4,000+ exclusions, exact match clustering, and zero click waste.',
        icon: Target,
        color: 'from-cyan-500 to-blue-500 text-cyan-300',
        accentGlow: 'rgba(6, 182, 212, 0.4)',
        previewType: 'code',
      },
      {
        id: 'pmax-engine',
        name: 'Performance Max (PMax) Engine',
        type: 'Algorithmic ML',
        format: 'Audience Signal Matrix',
        desc: 'Customer match lists, high-CTR responsive search ads, sitelinks, and custom lifestyle creative assets.',
        icon: Zap,
        color: 'from-purple-500 to-indigo-500 text-purple-300',
        accentGlow: 'rgba(168, 85, 247, 0.4)',
        previewType: 'vector',
      },
      {
        id: 'enhanced-conversions',
        name: 'Enhanced Conversion Tracking',
        type: 'Attribution Setup',
        format: 'Server-Side Webhooks',
        desc: 'Google Enhanced Conversions tracking with CRM offline conversion import feedback loops.',
        icon: Code,
        color: 'from-emerald-500 to-teal-500 text-emerald-300',
        accentGlow: 'rgba(16, 185, 129, 0.4)',
        previewType: 'tokens',
      },
      {
        id: 'brand-guard',
        name: 'Competitor Search Defense System',
        type: 'Auction Protection',
        format: 'Automated Rules',
        desc: 'Guarding brand name queries from competitor conquesting while maintaining lowest possible CPC.',
        icon: ShieldCheck,
        color: 'from-amber-500 to-orange-500 text-amber-300',
        accentGlow: 'rgba(245, 158, 11, 0.4)',
        previewType: 'deck',
      },
    ],
    milestones: [
      { day: 'Day 01 - 03', phase: 'Commercial Intent Mining & Negative Shielding', detail: 'Harvesting high-converting commercial intent keywords and erecting 4,000+ negative keyword barriers.', deliverable: 'Keyword Taxonomy Blueprint', progress: 25 },
      { day: 'Day 04 - 06', phase: 'Enhanced Conversions & GTM Integration', detail: 'Deploying server-side tracking, GTM webhooks, and offline conversion value imports.', deliverable: 'Tracking Architecture', progress: 55 },
      { day: 'Day 07 - 10', phase: 'Campaign Setup & Responsive Copy', detail: 'Building tightly grouped ad themes, high-quality score headlines, and targeted sitelinks.', deliverable: 'Campaign Deployment', progress: 85 },
      { day: 'Weekly', phase: 'Algorithmic Bid Tuning & Search Term Pruning', detail: 'Target ROAS/tCPA algorithmic calibration, device bid modifiers, and continuous keyword pruning.', deliverable: 'Continuous Optimization', progress: 100 },
    ],
    metrics: [
      { metric: '9.8/10', label: 'Average Quality Score', context: 'High relevance scores that lower your Cost-Per-Click while securing top-of-page rank.', badge: 'Google Elite', growth: '-42% CPC' },
      { metric: '91.4%', label: 'Top-of-Page Dominance', context: 'Securing the absolute highest commercial intent positions above direct competitors.', badge: 'Intent Capture', growth: 'Top Rank' },
      { metric: '0%', label: 'Broad Match Waste', context: 'Strict negative keyword shielding that prevents your ad budget from leaking on junk queries.', badge: 'Zero Waste', growth: 'Protected' },
    ],
  },
};

export default function ServiceDisciplineConsole({
  serviceSlug,
  serviceName,
}: ServiceDisciplineConsoleProps) {
  const [activeTab, setActiveTab] = useState<'vault' | 'cadence' | 'impact'>('vault');
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState(false);

  const consoleData = serviceConsoleData[serviceSlug] || serviceConsoleData['branding-design'];
  const activeDeliverable = consoleData.deliverables.find(d => d.id === selectedDeliverableId) || consoleData.deliverables[0];

  const handleCopy = () => {
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="relative w-full">
      {/* Dynamic Ambient Background Illumination */}
      <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/20 via-indigo-600/10 to-blue-600/20 rounded-[40px] blur-3xl opacity-60 pointer-events-none -z-10" />

      {/* Main Apple Studio Workstation Container */}
      <div className="relative rounded-[32px] border-t border-white/25 border-x border-b border-white/10 bg-gradient-to-b from-[#130E26]/95 via-[#0D0A1C]/95 to-[#070512] shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-3xl overflow-hidden ring-1 ring-white/10">
        
        {/* Specular Top Light Accent */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-300/40 to-transparent" />

        {/* Studio Top Control Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 sm:px-8 py-5 border-b border-white/[0.08] bg-black/40 backdrop-blur-md">
          {/* Left Title & Status */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 ring-1 ring-white/20 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-widest">
                  // STUDIO WORKSTATION
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.2 rounded-full border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight">
                {serviceName} Production Vault
              </h3>
            </div>
          </div>

          {/* Right Mode Switcher Tabs (iOS 18 Glass Pills) */}
          <div className="flex items-center bg-black/60 p-1.5 rounded-2xl border border-white/15 backdrop-blur-xl shadow-inner self-start md:self-auto">
            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${
                activeTab === 'vault'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/40'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Artifact Vault</span>
            </button>

            <button
              onClick={() => setActiveTab('cadence')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${
                activeTab === 'cadence'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/40'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Sprint Roadmap</span>
            </button>

            <button
              onClick={() => setActiveTab('impact')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${
                activeTab === 'impact'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/40'
                  : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Commercial ROI</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Artifact Vault */}
        {activeTab === 'vault' && (
          <div className="p-6 sm:p-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Interactive Visual Showcase Canvas (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-white/15 bg-gradient-to-b from-black/60 to-black/90 p-6 sm:p-7 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
                {/* Background Grid Pattern */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.2) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Top Canvas Bar */}
                <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white tracking-wider">
                      {activeDeliverable.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {activeDeliverable.format}
                  </span>
                </div>

                {/* Center Interactive Visual Render */}
                <div className="relative z-10 my-8 py-6 flex flex-col items-center justify-center text-center">
                  
                  {/* Dynamic Graphical Render based on selected deliverable */}
                  {activeDeliverable.previewType === 'vector' && (
                    <div className="w-full max-w-md space-y-6">
                      <div className="relative mx-auto w-48 h-48 rounded-3xl border border-purple-500/40 bg-purple-950/20 p-6 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.2)] group">
                        {/* Anchor points */}
                        <span className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded bg-purple-400 border-2 border-white" />
                        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded bg-purple-400 border-2 border-white" />
                        <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded bg-purple-400 border-2 border-white" />
                        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded bg-purple-400 border-2 border-white" />
                        
                        {/* Vector SVG Graphic */}
                        <Palette className="w-24 h-24 text-purple-300 group-hover:scale-110 transition-transform duration-500 drop-shadow-xl" />
                      </div>

                      <div className="flex items-center justify-center gap-2 pt-2">
                        <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.04] border border-white/10 text-gray-300">
                          Bezier Curves: Mathematically Exact
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                          Infinite Scalability
                        </span>
                      </div>
                    </div>
                  )}

                  {activeDeliverable.previewType === 'tokens' && (
                    <div className="w-full max-w-md rounded-2xl bg-black/80 border border-white/10 p-5 font-mono text-left text-xs space-y-3">
                      <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-white/[0.08]">
                        <span>tokens.config.json</span>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1 text-[11px] text-purple-300 hover:text-white"
                        >
                          {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedToken ? 'Copied' : 'Copy Tokens'}</span>
                        </button>
                      </div>

                      <div className="space-y-1.5 text-[11px] text-purple-200">
                        <p><span className="text-gray-500">1</span>  <span className="text-purple-400">&quot;--brand-primary&quot;</span>: <span className="text-emerald-400">&quot;#8B5CF6&quot;</span>,</p>
                        <p><span className="text-gray-500">2</span>  <span className="text-purple-400">&quot;--brand-accent&quot;</span>: <span className="text-blue-400">&quot;#3B82F6&quot;</span>,</p>
                        <p><span className="text-gray-500">3</span>  <span className="text-purple-400">&quot;--font-heading&quot;</span>: <span className="text-amber-300">&quot;&apos;Plus Jakarta Sans&apos;&quot;</span>,</p>
                        <p><span className="text-gray-500">4</span>  <span className="text-purple-400">&quot;--wcag-contrast&quot;</span>: <span className="text-emerald-400">&quot;21:1 AAA&quot;</span></p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                        <span className="w-4 h-4 rounded-full bg-[#8B5CF6] border border-white/30" />
                        <span className="w-4 h-4 rounded-full bg-[#3B82F6] border border-white/30" />
                        <span className="w-4 h-4 rounded-full bg-[#10B981] border border-white/30" />
                        <span className="text-[10px] text-gray-400 ml-auto">WCAG AAA Verified</span>
                      </div>
                    </div>
                  )}

                  {activeDeliverable.previewType === 'figma' && (
                    <div className="w-full max-w-md space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-[#16122E] p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-gray-400 pb-2 border-b border-white/[0.08]">
                          <span className="text-purple-300 flex items-center gap-1.5">
                            <Layout className="w-4 h-4" />
                            <span>Figma Auto-Layout 5.0</span>
                          </span>
                          <span className="text-emerald-400 font-bold">300+ Variants</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-left text-xs font-mono">
                          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                            <span className="text-gray-400 block text-[10px]">TYPOGRAPHY</span>
                            <span className="text-white font-bold">Fluid Scale</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                            <span className="text-gray-400 block text-[10px]">STATES</span>
                            <span className="text-purple-300 font-bold">Hover / Focus / Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(activeDeliverable.previewType === 'deck' || activeDeliverable.previewType === 'code' || activeDeliverable.previewType === 'video' || activeDeliverable.previewType === 'ad') && (
                    <div className="w-full max-w-md space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-[#140F2B] p-6 space-y-3 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-purple-400 uppercase font-bold">
                            Production Asset Package
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            100% UNLOCKED
                          </span>
                        </div>
                        <h4 className="font-heading text-lg font-bold text-white">
                          {activeDeliverable.name}
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {activeDeliverable.desc}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Canvas Footer */}
                <div className="relative z-10 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Transferred with full intellectual property & commercial rights.</span>
                  </div>
                  <a
                    href="#contact"
                    className="text-white hover:text-purple-300 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span>Request Vault Samples</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                  </a>
                </div>
              </div>

              {/* Right Column: Tactile Interactive Deliverable Cards (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3.5">
                <div className="text-xs font-mono uppercase tracking-wider text-gray-400 pb-1 flex items-center justify-between">
                  <span>SELECT ARTIFACT TO INSPECT:</span>
                  <span className="text-purple-400 font-bold">4 CORE MODULES</span>
                </div>

                {consoleData.deliverables.map((item) => {
                  const isSelected = activeDeliverable.id === item.id;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDeliverableId(item.id)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-purple-900/10 border-purple-400 shadow-xl shadow-purple-950/50 ring-1 ring-purple-400'
                          : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-sm text-white group-hover:text-purple-200 transition-colors">
                              {item.name}
                            </h4>
                            <span className="text-[11px] font-mono text-purple-300">
                              {item.type}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.05] text-gray-300 border border-white/10 shrink-0">
                          {item.format}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-2 mt-1 pl-12">
                        {item.desc}
                      </p>

                      {isSelected && (
                        <div className="absolute right-3 bottom-3 flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>INSPECTING</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Precision Sprint Roadmap */}
        {activeTab === 'cadence' && (
          <div className="p-6 sm:p-8 animate-in fade-in duration-300 space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-white/[0.08]">
              <span className="font-mono text-purple-400 font-bold uppercase tracking-wider">
                RAPID 7-14 DAY EXECUTION TIMELINE
              </span>
              <span className="text-emerald-400 font-mono">100% SPRINT TRANSPARENCY</span>
            </div>

            <div className="space-y-4">
              {consoleData.milestones.map((ms, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-mono font-bold text-sm text-purple-300 shrink-0 group-hover:scale-105 transition-transform">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {ms.day}
                        </span>
                        <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                          {ms.phase}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-300 mt-1.5 max-w-2xl leading-relaxed">
                        {ms.detail}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3 pl-14 md:pl-0">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ms.deliverable}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Quantitative Commercial ROI */}
        {activeTab === 'impact' && (
          <div className="p-6 sm:p-8 animate-in fade-in duration-300 space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-white/[0.08]">
              <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider">
                HISTORICAL PERFORMANCE BENCHMARKS
              </span>
              <span className="text-gray-400 font-mono">VERIFIED CLIENT DATA</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {consoleData.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 flex flex-col justify-between space-y-4 hover:border-purple-500/50 hover:shadow-purple-950/40 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {m.badge}
                      </span>
                      <span className="text-xs font-mono text-purple-400 font-bold">
                        {m.growth}
                      </span>
                    </div>
                    <div className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tight group-hover:text-purple-300 transition-colors">
                      {m.metric}
                    </div>
                    <h4 className="font-heading font-bold text-base text-white mt-1">
                      {m.label}
                    </h4>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed border-t border-white/[0.06] pt-3">
                    {m.context}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
