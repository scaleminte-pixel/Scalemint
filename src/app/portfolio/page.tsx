import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactCTA from '@/components/ContactCTA';
import PortfolioHeroNav from '@/components/portfolio/PortfolioHeroNav';
import BrandingShowcase from '@/components/portfolio/BrandingShowcase';
import WebShowcase from '@/components/portfolio/WebShowcase';
import CinemaShowcase from '@/components/portfolio/CinemaShowcase';
import UgcShowcase from '@/components/portfolio/UgcShowcase';
import MetaAdsShowcase from '@/components/portfolio/MetaAdsShowcase';
import GoogleAdsShowcase from '@/components/portfolio/GoogleAdsShowcase';
import { Sparkles, Award, ShieldCheck, Flame } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Portfolio & Verified Case Studies — Scalemint Studio',
  description: 'Explore verified client case studies, high-converting digital flagships, cinematic video reels, viral 9:16 UGC, Meta ads, and Google PPC engines engineered by Scalemint.',
};

export default async function PortfolioPage() {
  const [settings, categories, projects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.portfolioCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.portfolioProject.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      include: {
        category: true,
        coverMedia: true,
      },
    }),
  ]);

  // Discipline grouping for tailored themes
  const brandingProjects = projects.filter(
    (p) => p.category?.slug === 'branding'
  );

  const webProjects = projects.filter(
    (p) => p.category?.slug === 'websites' || p.category?.slug === 'web-design'
  );

  const cinemaProjects = projects.filter(
    (p) => p.category?.slug === 'video-editing' || p.category?.slug === 'video'
  );

  const ugcProjects = projects.filter(
    (p) => p.category?.slug === 'ai-ugc'
  );

  const metaProjects = projects.filter(
    (p) => p.category?.slug === 'digital-marketing'
  );

  const googleAdsProjects = projects.filter(
    (p) =>
      p.category?.slug === 'google-ads' ||
      p.category?.slug === 'ads'
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#05040A]">
      {/* Header */}
      <Header
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        whatsappNumber={settings?.whatsappNumber}
      />

      <main className="flex-grow pt-28 pb-16 relative overflow-hidden">
        {/* Ambient Top Light Spotlight */}
        <div className="spotlight-top" />
        <div className="ambient-orb top-20 left-10 w-[600px] h-[600px] bg-purple-600/15 pointer-events-none" />
        <div className="ambient-orb top-96 right-10 w-[500px] h-[500px] bg-blue-600/10 pointer-events-none" />

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-4 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>SCALEMINT PRODUCTION ARCHIVES</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Our Work Defines{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
              Market Leaders
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mt-3 leading-relaxed">
            Every production is organized by specialized discipline with custom architectural themes — engineering radical distinction, sub-second web speed, and exponential commercial ROI.
          </p>

          {/* Key Metrics Row */}
          <div className="pt-5 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-gray-300">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <Award className="w-4 h-4 text-purple-400" />
              <span>36 Verified Sprint Deliverables</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>5.8x Average Client ROAS</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Unrestricted IP Handover</span>
            </div>
          </div>
        </section>

        {/* Quick-Jump Thematic Anchor Dock */}
        <PortfolioHeroNav totalProjects={projects.length} />

        {/* 1. BRANDING SHOWCASE: Dual Reverse-Sliding Vector Logos with Hover-Pause */}
        <BrandingShowcase projects={brandingProjects} />

        {/* 2. WEBSITES SHOWCASE: Digital Product Lab & macOS Browser Flagships */}
        <WebShowcase projects={webProjects} />

        {/* 3. LONG-FORM CINEMA SHOWCASE: 16:9 Director HUD, ProRes 4K, Dolby Sound */}
        <CinemaShowcase projects={cinemaProjects} />

        {/* 4. SHORT-FORM UGC SHOWCASE: 9:16 Vertical Smartphone Reels & Viral Hooks */}
        <UgcShowcase projects={ugcProjects} />

        {/* 5. META MARKETING SHOWCASE: Facebook/Instagram Social Ad Suite & CAPI Telemetry */}
        <MetaAdsShowcase projects={metaProjects} />

        {/* 6. GOOGLE ADS SHOWCASE: Precision Search Intent, Exact-Match Shield & ROI Gauges */}
        <GoogleAdsShowcase projects={googleAdsProjects} />

        {/* Bottom Lead Conversion CTA */}
        <section className="mt-14">
          <ContactCTA
            title="Ready to Build an Iconic Brand, Flagship Web, or High-ROAS Ads?"
            subtitle="Let our senior sprint squad review your requirements and deliver a comprehensive production roadmap in 24 hours."
          />
        </section>
      </main>

      {/* Footer */}
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
