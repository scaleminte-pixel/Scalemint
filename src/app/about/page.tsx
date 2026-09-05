import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientsMarquee from '@/components/ClientsMarquee';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactCTA from '@/components/ContactCTA';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from '@/components/AnimateOnScroll';
import AnimatedCounter from '@/components/AnimatedCounter';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  Users,
  CheckCircle2,
  ArrowRight,
  Clock,
  Compass,
  Code2,
  Layers,
  Award,
  Globe,
  Lock,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Us — Scalemint 360° Creative & Growth Collective',
  description: 'Learn about Scalemint: Who we are, our 5-step sprint process, recent client collaborations, verified results, and why we rejected traditional agency bloat.',
};

export default async function AboutPage() {
  const [settings, clientBrands, testimonials, recentProjects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.clientBrand.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      include: { logoMedia: true },
    }),
    prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      include: { photoMedia: true },
    }),
    prisma.portfolioProject.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      take: 6,
      include: {
        category: true,
        coverMedia: true,
      },
    }),
  ]);

  const recentPartnerships = [
    {
      name: 'Apex Ventures',
      category: 'Fintech & Venture Capital',
      scope: 'Visual Identity, Next.js 14 Flagship & Dealflow Funnel',
      result: '+$2.4M Pipeline Value',
      metric: '3.1x Deal Velocity',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Pulse Commerce',
      category: 'Headless E-Commerce',
      scope: 'Brand Guidelines, Custom Storefront & Google Shopping Fleet',
      result: '+280% YoY Revenue Growth',
      metric: '7.1x Ads ROAS',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'ZenFlow AI',
      category: 'Enterprise SaaS Platform',
      scope: 'Product Design System, Web App & Viral AI Video Hooks',
      result: '120k+ Waitlist Signups',
      metric: '0.4s LCP Performance',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Horizon Cloud',
      category: 'Developer Infrastructure',
      scope: 'Documentation Architecture & High-Intent Search Shield',
      result: '-46% Customer Acquisition Cost',
      metric: '99/100 Mobile Lighthouse',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'Elevate Studios',
      category: 'Creative Production Hub',
      scope: 'Brand Evolution, Cinematic Video Docuseries & Digital Hub',
      result: '+210% Inbound Inquiries',
      metric: '6-Week Full Turnaround',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    },
    {
      name: 'NovaTech Solutions',
      category: 'Global Enterprise Tech',
      scope: 'Omnichannel Growth Funnels & Responsive Search Campaigns',
      result: '7.4x Google Ads ROAS',
      metric: '+$1.5M Pipeline',
      image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?q=80&w=800&auto=format&fit=crop',
    },
  ];

  const processSteps = [
    {
      number: '01',
      phase: 'Discovery & Strategic Diagnosis',
      title: 'Commercial Framing & Opportunity Mapping',
      desc: 'We audit your existing digital footprint, customer journey bottlenecks, and competitive blind spots to define measurable commercial goals.',
      artifacts: 'Sprint Architecture Manifesto · KPI Target Sheet · Competitor Gap Audit',
    },
    {
      number: '02',
      phase: 'Architecture & Visual Specs',
      title: 'Design Systems & Technical Foundation',
      desc: 'Before moving a single pixel or line of code, we define design tokens, user flows, copy hooks, and Next.js tech stack specifications.',
      artifacts: 'Figma Token Library · Interactive Wireframes · Tech Architecture Blueprint',
    },
    {
      number: '03',
      phase: 'High-Fidelity Sprint Execution',
      title: 'Rapid Production & Senior Craftsmanship',
      desc: 'Our senior craft specialists build in focused 2-to-4 week sprints with daily Loom video walk-throughs and direct async Slack collaboration.',
      artifacts: 'Production-Ready Vector Assets · Next.js Codebase · 4K Master Video Renders',
    },
    {
      number: '04',
      phase: 'Stress-Testing & Optimization',
      title: 'Performance QA & Security Hardening',
      desc: 'Cross-browser testing, Core Web Vitals optimization, mobile viewport audits, and tracking pixel verifications ensure flawless delivery.',
      artifacts: '95+ Lighthouse Audit · Clean Bug Register · SSL/Domain Configuration',
    },
    {
      number: '05',
      phase: 'Deployment & 100% IP Transfer',
      title: 'Turnkey Launch & Growth Scaling',
      desc: 'We deploy to your production servers, handover 100% full source rights, train your in-house squad, and ignite acquisition funnels.',
      artifacts: 'Full GitHub Repo Transfer · Figma Master Ownership · Post-Launch Monitoring',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-agency-dark">
      <Header
        siteName={settings?.siteName || 'Scalemint'}
        tagline={settings?.tagline || '360° Creative & Digital Growth Partner'}
        whatsappNumber={settings?.whatsappNumber}
      />

      <main className="flex-grow pt-28 sm:pt-32">
        {/* 1. Page Hero: Clean, Bold & Human-Crafted */}
        <section className="py-14 sm:py-20 relative overflow-hidden">
          {/* Ambient lighting orbs */}
          <div className="absolute top-10 left-1/4 w-[600px] h-[350px] bg-purple-600/10 blur-[150px] pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <AnimateOnScroll variant="fadeUp" className="max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/25 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>THE SCALEMINT COLLECTIVE · WHO WE ARE</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Architects of Distinction for <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                  Category-Defining Brands
                </span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                We bridge the costly disconnect between brand prestige, sub-second code engineering, and precision acquisition. One unified senior squad. Zero bloated overhead.
              </p>
            </AnimateOnScroll>

            {/* Credibility Key Stats */}
            <AnimateOnScroll variant="scaleUp" delay={0.2} className="mt-12 max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { value: '360°', label: 'Unified Discipline (Brand + Code + Media)', color: 'text-purple-400' },
                  { value: '99+', label: 'Google Core Web Vitals Standard', color: 'text-blue-400' },
                  { value: '100%', label: 'Direct IP & Source Code Ownership', color: 'text-emerald-400' },
                  { value: '6 Wks', label: 'Average End-to-End Sprint Velocity', color: 'text-amber-400' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl glass-card border border-white/[0.08] hover:border-purple-500/30 transition-all text-left space-y-2"
                  >
                    <div className={`font-heading text-3xl sm:text-4xl font-black ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400 font-medium leading-relaxed">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 2. Client Brand Proof Marquee */}
        <ClientsMarquee
          clients={clientBrands}
          title="Ambitious Leaders & Scale-Ups Partnering With Scalemint"
        />

        {/* 3. Who We Are & The Anti-Agency Model */}
        <section className="py-14 sm:py-16 border-t border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Narrative & Mission */}
              <AnimateOnScroll variant="fadeLeft" className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] text-purple-300 border border-white/10">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>Our Founding Thesis</span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Why We Built Scalemint: The End of Fragmented Agency Bloat
                </h2>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Most founders face an impossible choice: hire multiple specialized boutique agencies that never talk to each other, or pay exorbitant monthly retainers to legacy agencies where your work is handed off to inexperienced juniors.
                </p>

                <p className="text-gray-400 text-sm leading-relaxed">
                  The designer creates beautiful vectors that cannot convert. The developer writes code that ignores aesthetics. The media buyer blames the creative assets for lackluster ROAS. Everyone points fingers; your runway burns.
                </p>

                <div className="p-5 rounded-2xl bg-purple-900/15 border border-purple-500/25 space-y-2">
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider block">
                    The Scalemint Standard:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                    We assemble a single, cross-functional squad of senior principals under one roof. Your visual identity, Next.js tech architecture, and customer acquisition engine work in synchronized harmony from day one.
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Right Column: The 4 Non-Negotiable Guarantees */}
              <AnimateOnScroll variant="fadeRight" delay={0.15} className="lg:col-span-6">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#130F26] via-[#0E0C1C] to-[#070512] p-7 sm:p-8 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <h3 className="font-heading font-bold text-xl text-white">
                      Our Studio Non-Negotiables
                    </h3>
                    <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                      Standard Terms
                    </span>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: '100% IP & Source Handover',
                        desc: 'You own every Figma vector, Next.js repository, raw 4K footage master, and ad account. Zero hostage-holding.',
                        icon: Lock,
                      },
                      {
                        title: 'Direct Senior Principal Access',
                        desc: 'You communicate directly with the lead designers and engineers building your artifacts via private Slack and daily Loom video walkthroughs.',
                        icon: Users,
                      },
                      {
                        title: 'Zero Corporate Bloat',
                        desc: 'No account managers, no layers of bureaucracy, and no endless status calls. Pure sprint execution focused on deliverables.',
                        icon: Zap,
                      },
                      {
                        title: 'Ironclad Enterprise NDAs',
                        desc: 'Strict confidentiality agreements standard for all client engagements, protecting proprietary algorithms and brand strategies.',
                        icon: ShieldCheck,
                      },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-4 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-heading font-bold text-sm text-white">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* 4. Recent Client Engagements & Real Evidence (সাম্প্রতিক কাজের প্রমাণ) */}
        <section className="py-14 sm:py-16 border-t border-white/[0.06] relative bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="fadeUp" className="text-center max-w-3xl mx-auto space-y-3 mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Recent Work & Commercial Evidence</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Recent Collaborations & Tangible Output
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Real category leaders we have recently partnered with to design identities, engineer high-speed Next.js flagships, and scale acquisition.
              </p>
            </AnimateOnScroll>

            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPartnerships.map((partner, idx) => (
                <StaggerItem key={idx} variant="scaleUp">
                  <div className="rounded-2xl glass-card border border-white/[0.08] overflow-hidden hover:border-purple-500/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group h-full">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0718] via-transparent to-transparent opacity-80" />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400">
                        {partner.metric}
                      </div>
                    </div>

                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono text-purple-400 font-semibold uppercase tracking-wider">
                          {partner.category}
                        </div>
                        <h3 className="font-heading font-bold text-xl text-white">
                          {partner.name}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {partner.scope}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-300">
                          {partner.result}
                        </span>
                        <Link
                          href="/portfolio"
                          className="text-xs text-purple-300 hover:text-white flex items-center gap-1 group/btn"
                        >
                          <span>Case Proof</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* 5. How We Work / The 5-Step Battle-Tested Process */}
        <section className="py-14 sm:py-16 border-t border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="fadeUp" className="text-center max-w-3xl mx-auto space-y-3 mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.04] text-purple-300 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Structured Delivery Cadence</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How We Work: The 5-Stage Delivery Process
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                Predictable milestones, asynchronous transparency, and disciplined sprint cadences with zero guesswork.
              </p>
            </AnimateOnScroll>

            <div className="space-y-4 max-w-4xl mx-auto">
              {processSteps.map((step, idx) => (
                <AnimateOnScroll key={idx} variant="fadeUp" delay={idx * 0.08}>
                  <div className="p-6 sm:p-7 rounded-2xl glass-card border border-white/[0.08] hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                    <div className="flex items-start gap-4">
                      <span className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-mono font-black text-base text-purple-300 group-hover:scale-110 transition-transform shrink-0">
                        {step.number}
                      </span>
                      <div className="space-y-1">
                        <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
                          {step.phase}
                        </span>
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
                          {step.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/[0.06]">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                        Tangible Artifacts:
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-semibold block">
                        {step.artifacts}
                      </span>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Real Client Endorsements & Reviews */}
        <TestimonialsSection
          testimonials={testimonials}
          title="Verified Executive Feedback & Endorsements"
          subtitle="Real commercial results delivered for ambitious founders, CMOs, and venture-backed scale-ups."
        />

        {/* 7. Conversion CTA */}
        <ContactCTA
          title="Ready to Partner With a Senior 360° Squad?"
          subtitle="Schedule a direct discovery call with our leadership team to map out your upcoming sprint scope and deliverables."
        />
      </main>

      <Footer
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        contactEmail={settings?.contactEmail}
        contactPhone={settings?.contactPhone}
        whatsappNumber={settings?.whatsappNumber}
        address={settings?.address}
        footerText={settings?.footerText}
      />
    </div>
  );
}
