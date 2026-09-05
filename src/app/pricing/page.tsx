import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactCTA from '@/components/ContactCTA';
import PricingSection from '@/components/PricingSection';
import AgencyComparisonMatrix from '@/components/AgencyComparisonMatrix';
import ServiceScopeCalculator from '@/components/ServiceScopeCalculator';
import FaqAccordion from '@/components/FaqAccordion';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from '@/components/AnimateOnScroll';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  DollarSign,
  HelpCircle,
  FileCheck,
  Star,
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Pricing & Transparent Packages — Scalemint Studio',
  description: 'Explore fixed-price turnkey sprint scopes across branding, Next.js web development, cinematic video, AI UGC, and Google Ads with 100% source ownership.',
};

export default async function PricingPage() {
  const [settings, services, faqs, calcConfig] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      include: {
        coverMedia: true,
        packages: {
          where: { status: 'PUBLISHED' },
          orderBy: { displayOrder: 'asc' },
        },
      },
    }),
    prisma.faq.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { category: 'pricing' },
          { category: 'general' },
        ],
      },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.calculatorConfig.findUnique({ where: { id: 'global_calculator' } }),
  ]);

  // Parse services arrays
  const parsedServices = services.map((s) => ({
    ...s,
    whatIsIncluded: s.whatIsIncluded ? JSON.parse(s.whatIsIncluded) : [],
    benefits: s.benefits ? JSON.parse(s.benefits) : [],
  }));

  const pricingGuarantees = [
    {
      title: 'Milestone-Based Billing',
      desc: 'Standard 50% kickoff and 50% upon verified production sign-off. You never pay in full until milestones are achieved.',
      icon: DollarSign,
    },
    {
      title: '100% Complete IP Handover',
      desc: 'All Figma design libraries, production repositories, vector files, and media ad assets are transferred to your ownership immediately.',
      icon: Lock,
    },
    {
      title: 'Guaranteed Turnaround Commitments',
      desc: 'Every sprint tier includes fixed delivery timelines. If we miss an agreed deadline, we work for free until completed.',
      icon: Clock,
    },
    {
      title: 'Zero Hidden Retainers or Opaque Fees',
      desc: 'What you see is exactly what you invest. No surprise hourly charges, hosting markups, or arbitrary maintenance add-ons.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-agency-dark">
      <Header
        siteName={settings?.siteName || 'Scalemint'}
        tagline={settings?.tagline || '360° Creative & Digital Growth Partner'}
        whatsappNumber={settings?.whatsappNumber}
        logoUrl={settings?.logoUrl}
      />

      <main className="flex-grow pt-28 sm:pt-32">
        {/* 1. Hero Section */}
        <section className="py-14 sm:py-20 relative overflow-hidden">
          <div className="absolute top-10 left-1/4 w-[600px] h-[350px] bg-purple-600/10 blur-[150px] pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-amber-600/10 blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <AnimateOnScroll variant="fadeUp" className="max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>TRANSPARENT SPRINT INVESTMENT</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Predictable Fixed Pricing. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-purple-400 bg-clip-text text-transparent">
                  Zero Agency Retainer Traps.
                </span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Select turnkey production scopes across any discipline, or configure a custom sprint tailored to your commercial milestones. Full source code and IP ownership on day one.
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 2. Interactive Discipline Pricing Packages Switcher */}
        <PricingSection services={parsedServices} />

        {/* 3. Interactive Sprint Scope & Investment Calculator */}
        <section className="py-14 sm:py-16 border-t border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="scaleUp">
              <ServiceScopeCalculator
                serviceName="Custom Multidisciplinary"
                serviceSlug="website-design"
                config={calcConfig}
              />
            </AnimateOnScroll>
          </div>
        </section>

        {/* 4. The Scalemint Standard vs Traditional Agency Bloat Matrix */}
        <section className="py-14 sm:py-16 border-t border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="fadeUp">
              <AgencyComparisonMatrix />
            </AnimateOnScroll>
          </div>
        </section>

        {/* 5. Pricing Guarantees */}
        <section className="py-14 sm:py-16 border-t border-white/[0.06] relative bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll variant="fadeUp" className="text-center max-w-2xl mx-auto space-y-3 mb-10">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                Client Guarantees
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Four Pillars of Commercial Protection
              </h2>
              <p className="text-gray-400 text-sm sm:text-base">
                We align our incentives directly with your success through transparent terms and clear accountability.
              </p>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingGuarantees.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <AnimateOnScroll key={idx} variant="scaleUp" delay={idx * 0.1}>
                    <div className="p-6 rounded-2xl glass-card border border-white/[0.08] hover:border-purple-500/30 transition-all h-full space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading font-bold text-base text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Pricing Specific FAQs */}
        <FaqAccordion faqs={faqs} />

        {/* 7. Direct Conversion CTA */}
        <ContactCTA
          title="Need a Bespoke Sprint Scope for Your Category?"
          subtitle="Speak directly with our leadership team. We will review your product roadmap and provide a transparent, fixed proposal within 24 hours."
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
        logoUrl={settings?.logoUrl}
      />
    </div>
  );
}
