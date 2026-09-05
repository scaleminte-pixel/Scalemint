import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import ClientsMarquee from '@/components/ClientsMarquee';
import TestimonialsSection from '@/components/TestimonialsSection';
import FaqAccordion from '@/components/FaqAccordion';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from '@/components/AnimateOnScroll';
import ServiceCapabilitiesShowcase from '@/components/ServiceCapabilitiesShowcase';
import ServiceScopeCalculator from '@/components/ServiceScopeCalculator';
import AgencyComparisonMatrix from '@/components/AgencyComparisonMatrix';
import ServiceFloatingDock from '@/components/ServiceFloatingDock';
import ServiceHeroVisual from '@/components/ServiceHeroVisual';
import BrandingShowcase from '@/components/portfolio/BrandingShowcase';
import WebShowcase from '@/components/portfolio/WebShowcase';
import CinemaShowcase from '@/components/portfolio/CinemaShowcase';
import UgcShowcase from '@/components/portfolio/UgcShowcase';
import MetaAdsShowcase from '@/components/portfolio/MetaAdsShowcase';
import GoogleAdsShowcase from '@/components/portfolio/GoogleAdsShowcase';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Shield,
  Star,
  Check,
  Clock,
  Award,
  Layers,
  Repeat,
  FileCode2,
  ChevronRight,
  MessageSquare,
  Flame,
  ShieldCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface ServicePageProps {
  params: { slug: string };
}

const defaultVisuals: Record<string, { image: string; tag: string; index: string }> = {
  'branding-design': {
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop',
    tag: 'Identity & Guidelines',
    index: '01',
  },
  'website-design': {
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    tag: 'Next.js & UI/UX',
    index: '02',
  },
  'video-editing': {
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    tag: 'Cinematic Post-Production',
    index: '03',
  },
  'ai-ugc-video-editing': {
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop',
    tag: 'Viral Mobile Ad Hooks',
    index: '04',
  },
  'digital-marketing': {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    tag: 'Funnels & Retention',
    index: '05',
  },
  'google-ads': {
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    tag: 'PMax & Search Intent',
    index: '06',
  },
};

export async function generateMetadata({ params }: ServicePageProps) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  });

  if (!service) return { title: 'Service Not Found — Scalemint' };

  return {
    title: `${service.name} — Scalemint 360° Creative Agency`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const categorySlugMap: Record<string, string> = {
    'branding-design': 'branding',
    'website-design': 'websites',
    'video-editing': 'video-editing',
    'ai-ugc-video-editing': 'ai-ugc',
    'digital-marketing': 'digital-marketing',
    'google-ads': 'google-ads',
  };

  const matchingCatSlug = categorySlugMap[params.slug] || 'branding';

  const [settings, service, allServices, clientBrands, testimonials, faqs, portfolioProjects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.service.findUnique({
      where: { slug: params.slug },
      include: {
        coverMedia: true,
        packages: {
          where: { status: 'PUBLISHED' },
          orderBy: { displayOrder: 'asc' },
        },
      },
    }),
    prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
    prisma.clientBrand.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      take: 6,
    }),
    prisma.faq.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { category: params.slug },
          { category: 'general' },
        ],
      },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.portfolioProject.findMany({
      where: {
        status: 'PUBLISHED',
        category: {
          slug: matchingCatSlug,
        },
      },
      orderBy: { displayOrder: 'asc' },
      include: {
        category: true,
        coverMedia: true,
      },
    }),
  ]);

  if (!service || service.status !== 'PUBLISHED') {
    notFound();
  }

  const whatIsIncluded: string[] = service.whatIsIncluded
    ? JSON.parse(service.whatIsIncluded)
    : [];
  const benefits: string[] = service.benefits
    ? JSON.parse(service.benefits)
    : [];

  const visual = defaultVisuals[service.slug] || {
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
    tag: 'Full Spectrum',
    index: '01',
  };

  const displayImage = service.coverMedia?.publicUrl || visual.image;

  const sprintSteps = [
    {
      step: '01',
      title: 'Discipline Audit & Commercial Framing',
      desc: `Exhaustive analysis of your existing ${service.name.toLowerCase()} footprint, competitor vulnerabilities, and high-leverage growth opportunities.`,
      deliverable: 'Strategy Architecture Document',
    },
    {
      step: '02',
      title: 'System Architecture & Visual Tokens',
      desc: 'Defining core visual specs, component hierarchies, copy hooks, and production milestones before a single pixel moves.',
      deliverable: 'Interactive Prototype / Style Tiles',
    },
    {
      step: '03',
      title: 'Rapid High-Fidelity Sprints',
      desc: 'Senior craft directors execute dedicated production cycles with daily Loom walk-throughs and private Slack collaboration.',
      deliverable: 'Production Candidates & Polish',
    },
    {
      step: '04',
      title: 'Rigorous QA & Source Handover',
      desc: 'Final stress-testing, cross-platform validation, 100% intellectual property transfer, and post-launch performance calibration.',
      deliverable: 'Complete Master Files & Deployment',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-agency-dark">
      {/* Sticky Top Header */}
      <Header
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        whatsappNumber={settings?.whatsappNumber}
        logoUrl={settings?.logoUrl}
      />

      <main className="flex-grow pt-24 sm:pt-28 pb-20 relative overflow-hidden">
        {/* Ambient Top Light Spotlight & Gradients */}
        <div className="spotlight-top" />
        <div className="ambient-orb top-20 left-10 w-[550px] h-[550px] bg-purple-600/15 pointer-events-none" />
        <div className="ambient-orb top-96 right-10 w-[500px] h-[500px] bg-blue-600/10 pointer-events-none" />

        {/* 1. Global Discipline Quick-Switcher Bar */}
        <nav aria-label="Discipline Selector" className="relative z-20 border-b border-white/[0.08] bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono uppercase text-gray-400">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Capabilities:</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {allServices.map((s) => {
                  const isActive = s.slug === service.slug;
                  return (
                    <Link
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold ring-1 ring-purple-400'
                          : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                      }`}
                    >
                      <span>{s.name}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* 2. Cinematic Discipline Hero */}
        <section className="py-10 sm:py-14 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              {/* Left Column: Headline, Specs & CTAs */}
              <AnimateOnScroll variant="fadeRight" className="lg:col-span-7 space-y-6">
                {/* Discipline Tag & Live Status Pill */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>// DISCIPLINE {visual.index} • SPECIALIZED CRAFT</span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Q2 Sprint Slots Active</span>
                  </div>
                </div>

                {/* Primary Hero Title */}
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                  {service.name}
                </h1>

                {/* Tagline */}
                {service.tagline && (
                  <p className="text-xl sm:text-2xl text-purple-200 font-medium leading-relaxed">
                    {service.tagline}
                  </p>
                )}

                {/* Description */}
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                  {service.fullDesc || service.shortDesc}
                </p>

                {/* Senior Quality Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-300">
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>Senior-Led Direction</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>7-14 Day Delivery Cadence</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>100% Unrestricted IP Handover</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href="#contact"
                    className="px-8 py-4 rounded-full font-heading font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 active:scale-95 transition-all flex items-center gap-2.5 group"
                  >
                    <span>Initiate {service.name} Sprint</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>

                  {service.startingPrice && (
                    <div className="px-5 py-4 rounded-full bg-white/[0.03] text-xs sm:text-sm font-semibold text-amber-300 border border-white/10 font-mono">
                      Starting: {service.startingPrice}
                    </div>
                  )}
                </div>
              </AnimateOnScroll>

              {/* Right Column: Apple VisionOS Liquid Glass Studio Canvas */}
              <AnimateOnScroll variant="fadeLeft" delay={0.15} className="lg:col-span-5">
                <ServiceHeroVisual
                  serviceSlug={service.slug}
                  serviceName={service.name}
                  tag={visual.tag}
                  displayImage={displayImage}
                />
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* 3. 360 Infinite Continuous Client Brand Marquee */}
        <ClientsMarquee
          clients={clientBrands}
          variant="service"
          title={`Category Leaders Who Trust Scalemint For ${service.name}`}
        />

        {/* 4. User-Friendly Discipline Pillars & Capabilities */}
        <ServiceCapabilitiesShowcase
          serviceSlug={service.slug}
          serviceName={service.name}
        />

        {/* 5. Executive Bento Grid Deliverables Showcase */}
        <section className="py-14 sm:py-16 border-t border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="fadeUp" className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                Tangible Output
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
                Everything Included In Your Sprint
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Concrete artifacts designed to scale your commercial reach, eliminate technical debt, and compound brand equity.
              </p>
            </AnimateOnScroll>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Bento Card 1: Deliverables Checklist (7 cols) */}
              <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-gradient-to-b from-[#130F26] via-[#0E0C1C] to-[#070512] p-7 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-purple-400 font-heading font-bold text-lg">
                      <FileCode2 className="w-5 h-5" />
                      <span>Standard Production Deliverables</span>
                    </div>
                    <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                      {whatIsIncluded.length} Core Modules
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-6">
                    Every asset is engineered directly by senior specialists with meticulous attention to detail.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {whatIsIncluded.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl p-3.5 bg-white/[0.02] border border-white/[0.07] flex items-start gap-3 hover:border-purple-500/40 hover:bg-white/[0.04] transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-200 font-medium leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
                  <span>Source formats: Figma, Vector SVG, Production Code, 4K Masters</span>
                  <span className="text-emerald-400 font-mono">100% IP Handover</span>
                </div>
              </div>

              {/* Right Column Bento Cards (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Bento Card 2: Growth Stage Fit */}
                {service.bestFor && (
                  <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-7 flex-1 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-blue-400 font-heading font-bold text-base">
                        <Target className="w-5 h-5" />
                        <span>Ideal Growth Stage</span>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {service.bestFor}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/[0.06] text-xs font-mono text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>Optimized for Founders, Scale-Ups & Category Leaders</span>
                    </div>
                  </div>
                )}

                {/* Bento Card 3: Commercial ROI Velocity */}
                {benefits.length > 0 && (
                  <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-7 flex-1 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-heading font-bold text-base">
                        <Zap className="w-5 h-5" />
                        <span>Commercial & Revenue Velocity</span>
                      </div>
                      <ul className="space-y-2.5 text-xs text-gray-300">
                        {benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 mt-4 border-t border-white/[0.06] text-xs font-mono text-emerald-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Compounding Brand & Pipeline Value</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Tailored Discipline Portfolio Showcase */}
        {service.slug === 'branding-design' && (
          <BrandingShowcase projects={portfolioProjects} />
        )}
        {service.slug === 'website-design' && (
          <WebShowcase projects={portfolioProjects} />
        )}
        {service.slug === 'video-editing' && (
          <CinemaShowcase projects={portfolioProjects} />
        )}
        {service.slug === 'ai-ugc-video-editing' && (
          <UgcShowcase projects={portfolioProjects} />
        )}
        {service.slug === 'digital-marketing' && (
          <MetaAdsShowcase projects={portfolioProjects} />
        )}
        {service.slug === 'google-ads' && (
          <GoogleAdsShowcase projects={portfolioProjects} />
        )}

        {/* 7. Interactive Sprint Scope & Investment Calculator */}
        <section className="py-14 sm:py-16 border-t border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="scaleUp">
              <ServiceScopeCalculator
                serviceName={service.name}
                serviceSlug={service.slug}
              />
            </AnimateOnScroll>
          </div>
        </section>

        {/* 7. The Scalemint Standard vs Traditional Agency Bloat Matrix */}
        <section className="py-14 sm:py-16 border-t border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="fadeUp">
              <AgencyComparisonMatrix />
            </AnimateOnScroll>
          </div>
        </section>

        {/* 8. The 4-Stage Sprint Roadmap (Methodology) */}
        <section className="py-14 sm:py-16 border-t border-white/[0.06] bg-black/30 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="fadeUp" className="text-center max-w-3xl mx-auto space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] text-purple-300 border border-white/10">
                <Repeat className="w-3.5 h-3.5 text-purple-400" />
                <span>Battle-Tested Delivery Cadence</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
                How We Execute Your {service.name} Sprint
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Structured sprints with transparent milestones, direct asynchronous communication, and zero bureaucratic bloat.
              </p>
            </AnimateOnScroll>

            <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sprintSteps.map((step, idx) => (
                <StaggerItem key={idx} variant="scaleUp">
                  <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-7 hover:border-purple-500/40 transition-all duration-300 h-full flex flex-col justify-between space-y-4 group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-mono font-black text-sm text-purple-300 group-hover:scale-110 transition-transform">
                          {step.step}
                        </span>
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                          Phase 0{idx + 1}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{step.deliverable}</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* 9. Transparent Fixed Pricing Packages (If packages exist in CMS) */}
        {service.packages.length > 0 && (
          <section className="py-14 sm:py-16 border-t border-white/[0.06] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimateOnScroll variant="fadeUp" className="text-center max-w-2xl mx-auto space-y-3 mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] text-purple-300 border border-white/10">
                  <Flame className="w-3.5 h-3.5 text-purple-400" />
                  <span>Turnkey Engagements</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
                  Standard {service.name} Tiers
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  Pre-configured turnkey scopes with guaranteed deliverables and turnaround commitments.
                </p>
              </AnimateOnScroll>

              <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {service.packages.map((pkg) => {
                  const deliverables = Array.isArray(pkg.deliverables)
                    ? pkg.deliverables
                    : typeof pkg.deliverables === 'string'
                    ? JSON.parse(pkg.deliverables)
                    : [];

                  return (
                    <StaggerItem key={pkg.id} variant="scaleUp">
                      <div
                        className={`rounded-2xl p-7 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-2 h-full ${
                          pkg.isPopular
                            ? 'bg-gradient-to-b from-[#1C1238] to-[#0E0E1E] border-2 border-purple-500 shadow-xl shadow-purple-500/20'
                            : 'bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/40'
                        }`}
                      >
                        {pkg.isPopular && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-purple-500/30">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>Most Popular</span>
                          </div>
                        )}

                        <div className="space-y-4">
                          <h3 className="font-heading text-xl font-bold text-white">
                            {pkg.name}
                          </h3>
                          {pkg.bestFor && (
                            <p className="text-xs text-purple-300">
                              {pkg.bestFor}
                            </p>
                          )}
                          <div className="pt-2">
                            <span className="font-heading text-4xl font-black text-white">
                              {pkg.price}
                            </span>
                          </div>
                          <ul className="space-y-2.5 text-xs text-gray-300 pt-4 border-t border-white/[0.08]">
                            {deliverables.map((del: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                <span>{del}</span>
                              </li>
                            ))}
                            {pkg.timeline && (
                              <li className="flex items-start gap-2 text-purple-300 font-medium pt-2 border-t border-white/[0.06]">
                                <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                                <span>Timeline: {pkg.timeline}</span>
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="pt-6 mt-6 border-t border-white/[0.08]">
                          <a
                            href="#contact"
                            className={`w-full py-3.5 rounded-xl font-heading font-semibold text-xs text-center block transition-all ${
                              pkg.isPopular
                                ? 'bg-white text-black hover:bg-gray-200'
                                : 'bg-white/[0.05] hover:bg-purple-600 text-white border border-white/10 hover:border-purple-500'
                            }`}
                          >
                            Select Package
                          </a>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          </section>
        )}

        {/* 10. Service-Specific FAQs */}
        {faqs.length > 0 && (
          <section className="border-t border-white/[0.06]">
            <FaqAccordion faqs={faqs} />
          </section>
        )}

        {/* 11. Client Testimonials Carousel */}
        {testimonials.length > 0 && (
          <TestimonialsSection
            testimonials={testimonials}
            title={`Client Endorsements & Proof`}
            subtitle={`What founders and executive leaders say about our ${service.name.toLowerCase()} sprint delivery.`}
          />
        )}

        {/* 12. Lead Capture Sprint Initiation Form */}
        <section id="contact" className="py-14 sm:py-16 border-t border-white/[0.06] bg-black/40 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="fadeUp" className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Direct Production Channel</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Initiate Your {service.name} Sprint
              </h2>
              <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
                Share your target timeline, brand objectives, and scope. Our senior team responds with a detailed roadmap within 24 hours.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="scaleUp" delay={0.15}>
              <LeadForm defaultService={service.name} />
            </AnimateOnScroll>
          </div>
        </section>
      </main>

      {/* 13. Sticky Bottom Conversion Floating Dock */}
      <ServiceFloatingDock
        serviceName={service.name}
        startingPrice={service.startingPrice}
        whatsappNumber={settings?.whatsappNumber}
      />

      {/* Footer */}
      <Footer
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        contactEmail={settings?.contactEmail}
        contactPhone={settings?.contactPhone}
        whatsappNumber={settings?.whatsappNumber}
        address={settings?.address}
        footerText={settings?.footerText}
        logoUrl={settings?.logoUrl}
      />
    </div>
  );
}
