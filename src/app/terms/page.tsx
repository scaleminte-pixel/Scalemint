import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactCTA from '@/components/ContactCTA';
import prisma from '@/lib/prisma';
import { Shield, FileText, CheckCircle2, Lock, Scale, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Terms and Conditions — Scalemint Studio',
  description: 'Master Services Agreement, Intellectual Property handover terms, revision standards, and commercial engagement guidelines for Scalemint Studio clients.',
};

export default async function TermsPage() {
  const [settings, legalDoc] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.legalPage.findUnique({ where: { slug: 'terms' } }),
  ]);

  let parsedSections = [];
  if (legalDoc?.sections) {
    try {
      parsedSections = JSON.parse(legalDoc.sections);
    } catch (e) {
      console.error('Error parsing terms sections:', e);
    }
  }

  const icons = [FileText, Award, CheckCircle2, Scale, Lock, Shield, Scale, FileText];
  const iconColors = [
    'text-purple-400',
    'text-emerald-400',
    'text-blue-400',
    'text-amber-400',
    'text-rose-400',
    'text-cyan-400',
    'text-purple-400',
    'text-indigo-400',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#05040A]">
      <Header
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        whatsappNumber={settings?.whatsappNumber}
        logoUrl={settings?.logoUrl}
      />

      <main className="flex-grow pt-28 pb-16 relative overflow-hidden">
        {/* Ambient Top Lighting */}
        <div className="spotlight-top" />
        <div className="ambient-orb top-20 left-10 w-[600px] h-[600px] bg-purple-600/15 pointer-events-none" />
        <div className="ambient-orb top-96 right-10 w-[500px] h-[500px] bg-blue-600/10 pointer-events-none" />

        {/* Page Hero */}
        <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/25 mb-4 shadow-glow-purple/20">
            <Scale className="w-3.5 h-3.5 text-purple-400" />
            <span>COMMERCIAL ENGAGEMENT GOVERNANCE · SPRINT MSA</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Terms & <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">Conditions</span>
          </h1>

          <p className="mt-4 text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {legalDoc?.summary || 'Clear, transparent commercial terms engineered to protect client intellectual property, guarantee rapid sprint delivery, and maintain highest execution standards.'}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-400">
            <span>Last Updated: <strong className="text-white">{legalDoc?.lastUpdated ? new Date(legalDoc.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'September 2026'}</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Standard Master Services Agreement (MSA)</span>
          </div>
        </section>

        {/* Structured Terms Content Cards */}
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {parsedSections.map((sec: any, idx: number) => {
            const IconComponent = icons[idx % icons.length];
            const colorClass = iconColors[idx % iconColors.length];
            return (
              <div
                key={sec.id || idx}
                id={sec.id || `section-${idx}`}
                className="glass-card rounded-2xl p-6 sm:p-8 border border-white/[0.08] hover:border-purple-500/30 transition-all space-y-3 relative overflow-hidden group"
              >
                <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3.5">
                  <div className={`p-2 rounded-xl bg-white/[0.04] border border-white/10 ${colorClass}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h2 className="font-heading text-base sm:text-lg font-bold text-white tracking-tight">
                    {sec.title}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                  {sec.content}
                </p>
              </div>
            );
          })}
        </section>

        {/* Closing Lead CTA */}
        <section className="relative z-10 mt-16">
          <ContactCTA />
        </section>
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
