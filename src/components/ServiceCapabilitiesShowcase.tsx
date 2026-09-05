'use client';

import React from 'react';
import { 
  Sparkles, 
  Palette, 
  Layout, 
  Film, 
  Flame, 
  TrendingUp, 
  Target, 
  Check, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Cpu,
  ArrowRight
} from 'lucide-react';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from './AnimateOnScroll';

interface Pillar {
  title: string;
  desc: string;
  icon: any;
  color: string;
  badge: string;
  highlights: string[];
}

interface ServiceCapabilitiesShowcaseProps {
  serviceSlug: string;
  serviceName: string;
}

const servicePillarsData: Record<string, {
  tag: string;
  title: string;
  subtitle: string;
  pillars: Pillar[];
}> = {
  'branding-design': {
    tag: '// CORE BRANDING DISCIPLINES',
    title: 'The 4 Pillars of a Distinctive Brand System',
    subtitle: 'We build cohesive, memorable brand ecosystems engineered for pricing power, executive authority, and immediate market recognition.',
    pillars: [
      {
        title: 'Strategic Positioning & Archetype',
        desc: 'Market differentiation analysis to uncover competitor blind spots and define your unique verbal and psychological brand signature.',
        icon: Target,
        color: 'from-purple-500 to-indigo-500 text-purple-300',
        badge: 'Foundation',
        highlights: ['Competitor Gap Analysis', 'Brand Voice & Tone Matrix', 'Mission & North Star Framing'],
      },
      {
        title: 'Master Vector Symbol & Wordmark',
        desc: 'Mathematically constructed geometric logos designed for instant recall, optical balance, and infinite scalability across all touchpoints.',
        icon: Palette,
        color: 'from-blue-500 to-cyan-500 text-blue-300',
        badge: 'Visual Identity',
        highlights: ['Strict Clearspace Grids', 'Monochrome & Inverted Marks', 'Favicon & Mobile App Icons'],
      },
      {
        title: 'Digital Token & Palette Matrix',
        desc: 'Curated color systems with light and dark mode variables, WCAG 2.1 AAA accessibility contrast, and pairing typography guidelines.',
        icon: Layers,
        color: 'from-pink-500 to-rose-500 text-pink-300',
        badge: 'Design System',
        highlights: ['HEX, RGB & HSL Tokens', 'WCAG AAA Contrast Pairs', 'Grotesque & Monospace Hierarchy'],
      },
      {
        title: 'Brand Portal & Collateral Suite',
        desc: 'Complete Figma design library, investor pitch deck templates, executive stationery, and developer-ready CSS/JSON token packages.',
        icon: ShieldCheck,
        color: 'from-amber-500 to-orange-500 text-amber-300',
        badge: 'Asset Handover',
        highlights: ['Full Figma Auto-Layout Hub', '100% Full IP Rights Transfer', 'Commercial Usage License'],
      },
    ],
  },
  'website-design': {
    tag: '// WEB ARCHITECTURE & ENGINEERING',
    title: 'Engineered for Conversion Velocity & Speed',
    subtitle: 'We construct high-speed Next.js flagships combining interactive visual art, frictionless user journeys, and enterprise infrastructure.',
    pillars: [
      {
        title: 'Conversion-Rate-Optimized UI/UX',
        desc: 'Engineered visual hierarchy and user journey mapping designed to eliminate drop-offs and guide prospects smoothly toward conversion.',
        icon: Layout,
        color: 'from-blue-500 to-indigo-500 text-blue-300',
        badge: 'User Experience',
        highlights: ['Friction-Free Multi-Step Forms', 'High-Trust Social Proof Placement', 'Interactive Responsive Prototypes'],
      },
      {
        title: 'Next.js 14 App Router Codebase',
        desc: 'Modern React Server Components with sub-second page transitions, zero client-bundle bloat, and clean TypeScript code.',
        icon: Cpu,
        color: 'from-purple-500 to-pink-500 text-purple-300',
        badge: 'Engineering',
        highlights: ['React Server Components', 'Edge Routing & Dynamic CDN', 'Clean Modular Architecture'],
      },
      {
        title: 'Sub-Second Google Core Web Vitals',
        desc: 'Guaranteed 95+ Google Lighthouse scores with font preloading, automatic image compression, and sub-300ms Largest Contentful Paint.',
        icon: Zap,
        color: 'from-emerald-500 to-teal-500 text-emerald-300',
        badge: 'Speed & SEO',
        highlights: ['95+ Lighthouse Guarantee', 'Sub-300ms LCP Metric', 'Clean Semantic SEO Schema'],
      },
      {
        title: 'Full CMS & Git Repository Handover',
        desc: 'Intuitive content management dashboard and complete GitHub repository ownership with zero ongoing proprietary agency hostage fees.',
        icon: ShieldCheck,
        color: 'from-amber-500 to-orange-500 text-amber-300',
        badge: 'Autonomy',
        highlights: ['Full Git Repository Access', 'No Proprietary Platform Lock-in', '100% Source Code Rights'],
      },
    ],
  },
  'video-editing': {
    tag: '// POST-PRODUCTION CRAFT',
    title: 'Cinematic Pacing That Commands Attention',
    subtitle: 'We craft high-retention commercial films, YouTube docuseries, and social cuts engineered to capture modern viewer attention spans.',
    pillars: [
      {
        title: 'High-Retention Narrative Pacing',
        desc: 'Aggressive story trimming and cadence matching designed specifically to defeat scroll fatigue and maximize watch-through rates.',
        icon: Film,
        color: 'from-pink-500 to-rose-500 text-pink-300',
        badge: 'Storytelling',
        highlights: ['A-Roll Precision Cuts', 'Beat-Matched Transitions', 'Pattern-Interrupt B-Roll Ingestion'],
      },
      {
        title: 'Broadcast 4K Color Grading',
        desc: 'Studio-grade color correction and cinematic Rec.709/LUT styling that transforms raw camera files into rich filmic visuals.',
        icon: Palette,
        color: 'from-purple-500 to-indigo-500 text-purple-300',
        badge: 'Color Science',
        highlights: ['Skin-Tone Isolation & Polish', 'Cinematic Contrast Curves', 'Consistent Cross-Platform Color'],
      },
      {
        title: 'Kinetic Motion & Lower-Thirds',
        desc: 'Custom kinetic typography, sound-synced animated titles, brand overlays, and dynamic graphic callouts.',
        icon: Zap,
        color: 'from-amber-500 to-orange-500 text-amber-300',
        badge: 'Motion Graphics',
        highlights: ['Custom Animated Titles', 'Lower-Third Brand Badges', 'Sound-Synchronized Visuals'],
      },
      {
        title: 'Studio Sound Design & Foley Suite',
        desc: 'Multi-track audio normalization (-14 LUFS standard), custom whooshes, ambient risers, and licensed commercial soundtrack.',
        icon: Sparkles,
        color: 'from-blue-500 to-cyan-500 text-blue-300',
        badge: 'Sound Design',
        highlights: ['Voice Leveling & De-Noising', 'Layered Dynamic Sound FX', 'Commercial Score Licensing'],
      },
    ],
  },
  'ai-ugc-video-editing': {
    tag: '// SHORT-FORM VIRAL ENGINES',
    title: 'Direct-Response Hooks Built for Algorithm ROAS',
    subtitle: 'Creator-style native ad creatives, AI voice synthesis, and kinetic karaoke captions proven to scale mobile acquisitions.',
    pillars: [
      {
        title: '0.8s Pattern-Interrupt Hooks',
        desc: 'Analyzing viral competitor angles and crafting 3 to 5 unique opening hooks per video to arrest viewer thumbs in the first 3 seconds.',
        icon: Flame,
        color: 'from-amber-500 to-red-500 text-amber-300',
        badge: 'Thumbstop Power',
        highlights: ['A/B Hook Variations', 'Visual Pattern Interrupts', 'High-Emotion Narrative Starts'],
      },
      {
        title: 'Dynamic Kinetic Karaoke Subtitles',
        desc: 'Word-by-word highlighted animated captions that increase sound-off video retention by up to 80% on TikTok, Reels, and Shorts.',
        icon: Layout,
        color: 'from-purple-500 to-pink-500 text-purple-300',
        badge: 'Retention',
        highlights: ['Karaoke Color Highlighting', 'Pop Emoji & Graphic Accents', 'Sound-Off Engagement Max'],
      },
      {
        title: 'AI Voice & Creator Synthesis',
        desc: 'Natural conversational voice cloning and creator B-roll curation that gives your ads genuine direct-response authenticity.',
        icon: Cpu,
        color: 'from-cyan-500 to-blue-500 text-cyan-300',
        badge: 'AI Studio',
        highlights: ['Natural Cadence Voice Synthesis', 'Authentic Creator Overlays', 'Rapid Script Iteration'],
      },
      {
        title: 'Batch Creative Sprints for Paid Ads',
        desc: 'Weekly deliveries of ready-to-test ad cuts optimized with direct CTAs to prevent ad fatigue and lower your customer acquisition cost.',
        icon: ShieldCheck,
        color: 'from-emerald-500 to-teal-500 text-emerald-300',
        badge: 'Continuous Scale',
        highlights: ['Multi-Angle Creative Testing', 'Ad Manager Ready Formats', 'Continuous ROAS Tuning'],
      },
    ],
  },
  'digital-marketing': {
    tag: '// GROWTH ENGINES & ACQUISITION',
    title: 'Omnichannel Funnels Engineered for Real Revenue',
    subtitle: 'We architect full-funnel customer acquisition systems, server-side data tracking, and automated lifecycle retention loops.',
    pillars: [
      {
        title: 'Full-Funnel Acquisition Strategy',
        desc: 'Mapping high-converting customer journeys from cold awareness through middle-funnel education to high-ticket closed conversions.',
        icon: Target,
        color: 'from-purple-500 to-indigo-500 text-purple-300',
        badge: 'Architecture',
        highlights: ['Cold Traffic Funnel Blueprint', 'Offer Architecture & Angle Testing', 'High-Converting Landing Pages'],
      },
      {
        title: 'Server-Side CAPI & GA4 Attribution',
        desc: 'Bypassing browser ad-blockers and iOS privacy restrictions with server-side event tracking for 100% accurate conversion data.',
        icon: Cpu,
        color: 'from-blue-500 to-cyan-500 text-blue-300',
        badge: 'Data Stack',
        highlights: ['Meta Conversions API (CAPI)', 'GA4 Enhanced Event Hooks', 'Clean Attribution Dashboard'],
      },
      {
        title: 'Automated Lifecycle & Retention Flows',
        desc: '12 automated behavioral email and SMS sequences including browse abandonment, post-purchase onboarding, and repeat replenishment loops.',
        icon: Zap,
        color: 'from-amber-500 to-orange-500 text-amber-300',
        badge: 'Retention',
        highlights: ['High-Converting Email Sequences', 'Customer LTV Maximization', 'Automated Churn Defense'],
      },
      {
        title: 'Weekly Executive Growth Telemetry',
        desc: 'Live real-time dashboards tracking Blended CAC, ROAS, and cohort retention with weekly video strategy walk-throughs.',
        icon: ShieldCheck,
        color: 'from-emerald-500 to-teal-500 text-emerald-300',
        badge: 'Transparency',
        highlights: ['Real-Time Profit Telemetry', 'Weekly Strategy Loom Reviews', 'Direct Slack Communication'],
      },
    ],
  },
  'google-ads': {
    tag: '// HIGH-INTENT SEARCH DOMINANCE',
    title: 'High-Intent Search Capture & Budget Shielding',
    subtitle: 'We structure tightly themed Google Search campaigns, Performance Max engines, and strict negative keyword defenses.',
    pillars: [
      {
        title: 'High-Intent Search Architecture',
        desc: 'Harvesting bottom-of-funnel commercial intent queries using Single Theme Ad Groups (STAG) to capture buyers at peak purchase moments.',
        icon: Target,
        color: 'from-cyan-500 to-blue-500 text-cyan-300',
        badge: 'Search Intent',
        highlights: ['Commercial Intent Keywords', 'Exact & Phrase Match Clustering', 'High-CTR Responsive Ad Copy'],
      },
      {
        title: '4,000+ Negative Keyword Shield',
        desc: 'Erecting strict negative keyword exclusions that stop your budget from leaking on junk queries, competitor noise, and accidental clicks.',
        icon: ShieldCheck,
        color: 'from-purple-500 to-indigo-500 text-purple-300',
        badge: 'Budget Shield',
        highlights: ['4,000+ Verified Exclusions', 'Zero Broad-Match Budget Waste', 'Continuous Search Query Pruning'],
      },
      {
        title: 'Performance Max (PMax) Asset Engine',
        desc: 'First-party customer match lists, custom audience signals, dynamic headline variations, and high-impact visual lifestyle assets.',
        icon: Zap,
        color: 'from-amber-500 to-orange-500 text-amber-300',
        badge: 'Algorithmic ML',
        highlights: ['Audience Signal Clustering', 'Multi-Asset Creative Packs', 'Cross-Channel Search & Shopping'],
      },
      {
        title: 'Enhanced Conversions & Value Tracking',
        desc: 'Server-side Google Enhanced Conversion tracking with offline CRM lead value feedback loops to train Google AI on high-ticket buyers.',
        icon: Cpu,
        color: 'from-emerald-500 to-teal-500 text-emerald-300',
        badge: 'Attribution',
        highlights: ['Enhanced Conversion Webhooks', 'Qualified Lead Value Imports', 'Target CPA & ROAS Calibration'],
      },
    ],
  },
};

export default function ServiceCapabilitiesShowcase({
  serviceSlug,
  serviceName,
}: ServiceCapabilitiesShowcaseProps) {
  const data = servicePillarsData[serviceSlug] || servicePillarsData['branding-design'];

  return (
    <section className="py-14 sm:py-16 border-t border-white/[0.06] relative overflow-hidden">
      {/* Dynamic Ambient Background Illumination */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimateOnScroll variant="fadeUp" className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{data.tag}</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {data.title}
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {data.subtitle}
          </p>
        </AnimateOnScroll>

        {/* 4 Pillars Grid: Clean, Elegant & User-Friendly */}
        <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {data.pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <StaggerItem key={idx} variant="scaleUp">
                <div className="group rounded-3xl border border-white/10 bg-gradient-to-b from-[#140F2A]/90 via-[#0D0A1C]/95 to-[#080614] p-7 sm:p-8 shadow-2xl backdrop-blur-2xl hover:border-purple-400/60 hover:shadow-purple-950/40 transition-all duration-400 flex flex-col justify-between h-full relative overflow-hidden">
                  
                  {/* Subtle Top Specular Edge Highlight */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-purple-400/60 transition-colors" />

                  <div>
                    {/* Top Icon & Badge Bar */}
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/[0.04] text-purple-300 border border-white/10">
                        {pillar.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm mt-3 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  {/* Highlights Checklist */}
                  <div className="mt-6 pt-5 border-t border-white/[0.08] space-y-2.5">
                    {pillar.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-gray-200">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="font-medium">{h}</span>
                      </div>
                    ))}
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
