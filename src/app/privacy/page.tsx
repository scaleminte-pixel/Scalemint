import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactCTA from '@/components/ContactCTA';
import prisma from '@/lib/prisma';
import { ShieldCheck, Lock, Eye, Database, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Privacy Policy — Scalemint Studio',
  description: 'Data security commitments, client confidentiality, analytics disclosure, and GDPR/CCPA privacy standards for Scalemint Studio.',
};

export default async function PrivacyPolicyPage() {
  const [settings, legalDoc] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.legalPage.findUnique({ where: { slug: 'privacy' } }),
  ]);

  let parsedSections = [];
  if (legalDoc?.sections) {
    try {
      parsedSections = JSON.parse(legalDoc.sections);
    } catch (e) {
      console.error('Error parsing privacy sections:', e);
    }
  }

  const icons = [Database, Eye, Lock, ShieldCheck, FileText, CheckCircle2];
  const iconColors = [
    'text-blue-400',
    'text-purple-400',
    'text-emerald-400',
    'text-rose-400',
    'text-cyan-400',
    'text-amber-400',
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
        {/* Ambient Top Light Spotlight */}
        <div className="spotlight-top" />
        <div className="ambient-orb top-20 left-10 w-[600px] h-[600px] bg-blue-600/10 pointer-events-none" />
        <div className="ambient-orb top-96 right-10 w-[500px] h-[500px] bg-purple-600/10 pointer-events-none" />

        {/* Hero Section */}
        <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/25 mb-4 shadow-glow-blue/20">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>DATA PROTECTION STANDARDS · ZERO RESALE COMMITMENT</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Privacy <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Policy</span>
          </h1>

          <p className="mt-4 text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {legalDoc?.summary || 'We treat client information and proprietary strategic roadmaps with institutional confidentiality. Read how we protect your data.'}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-400">
            <span>Last Updated: <strong className="text-white">{legalDoc?.lastUpdated ? new Date(legalDoc.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'September 2026'}</strong></span>
            <span>•</span>
            <span className="text-blue-400 font-semibold">GDPR & CCPA Compliant</span>
          </div>
        </section>

        {/* Privacy Content Cards */}
        <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {parsedSections.map((sec: any, idx: number) => {
            const IconComponent = icons[idx % icons.length];
            const colorClass = iconColors[idx % iconColors.length];
            return (
              <div
                key={sec.id || idx}
                className="glass-card rounded-2xl p-6 sm:p-8 border border-white/[0.08] hover:border-blue-500/30 transition-all space-y-3 relative overflow-hidden group"
              >
                <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3.5">
                  <div className={`p-2 rounded-xl bg-white/[0.04] border border-white/10 ${colorClass}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h2 className="font-heading text-base sm:text-lg font-bold text-white tracking-tight">
                    {sec.title}
                  </h2>
                </div>

                <div className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal whitespace-pre-line">
                  {sec.content}
                </div>
              </div>
            );
          })}
        </section>

        {/* Contact CTA */}
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
