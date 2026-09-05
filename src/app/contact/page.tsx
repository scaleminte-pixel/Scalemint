import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import ClientsMarquee from '@/components/ClientsMarquee';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from '@/components/AnimateOnScroll';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Mail,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Lock,
  Star,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Us — Scalemint 360° Creative & Growth Collective',
  description: 'Initiate a discovery consultation directly with our leadership team. Transparent fixed-sprint proposals delivered within 24 hours.',
};

export default async function ContactPage() {
  const [settings, clientBrands] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.clientBrand.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      include: { logoMedia: true },
    }),
  ]);

  const trustHighlights = [
    {
      title: '24-Hour Proposal Commitment',
      desc: 'No endless intake queues. A Senior Principal reviews your roadmap and provides a clear milestone scope within 1 business day.',
      icon: Clock,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    },
    {
      title: 'Standard Enterprise NDA',
      desc: 'All communications, proprietary codebase specs, and commercial strategies are strictly confidential under mutual NDA.',
      icon: Lock,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
    },
    {
      title: '100% IP & Source Ownership',
      desc: 'You retain complete ownership of all Figma designs, Next.js code, vector assets, and media buy accounts from kickoff.',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
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
        {/* Hero & Direct Contact Section */}
        <section className="py-12 sm:py-16 relative overflow-hidden">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[350px] bg-purple-600/10 blur-[160px] pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <AnimateOnScroll variant="fadeUp" className="max-w-3xl mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/25 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>DIRECT SENIOR PARTNER INQUIRY · ZERO RED TAPE</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Let’s Build Something <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
                  Exceptional Together.
                </span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Connect directly with our leadership. We review your growth objectives, define your sprint scope, and provide a fixed-price roadmap within 24 hours.
              </p>
            </AnimateOnScroll>

            {/* Main 2-Column Split: Clean, High-Trust Info & Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
              {/* Left Column: Direct Communication Channels & Credibility (5 cols) */}
              <div className="lg:col-span-5 space-y-8">
                {/* Direct Channels Glass Card */}
                <AnimateOnScroll variant="fadeLeft" className="p-7 rounded-3xl glass-card border border-white/10 space-y-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 block">
                    Direct Studio Channels
                  </span>

                  <div className="space-y-4">
                    {/* WhatsApp Fast Track */}
                    {settings?.whatsappNumber && (
                      <a
                        href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/15 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <MessageCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 font-medium">Instant Messaging</div>
                            <div className="font-heading font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                              Chat with Principals on WhatsApp
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
                      </a>
                    )}

                    {/* Email */}
                    <a
                      href={`mailto:${settings?.contactEmail || 'growth@scalemint.com'}`}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-purple-500/30 hover:bg-white/[0.04] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 font-medium">Executive Inquiries</div>
                          <div className="font-heading font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                            {settings?.contactEmail || 'growth@scalemint.com'}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-transform shrink-0" />
                    </a>

                    {/* Studio Location */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium">Global Operations</div>
                        <div className="font-heading font-bold text-sm text-white">
                          {settings?.address || 'San Francisco, CA & Global Hubs'}
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* 3 Protection Guarantees */}
                <AnimateOnScroll variant="fadeLeft" delay={0.15} className="space-y-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 block px-1">
                    Client Guarantees & Terms
                  </span>

                  <div className="space-y-3">
                    {trustHighlights.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3.5"
                        >
                          <div className={`p-2.5 rounded-xl border ${item.color} shrink-0 mt-0.5`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="font-heading font-bold text-xs sm:text-sm text-white">
                              {item.title}
                            </h3>
                            <p className="text-[12px] text-gray-400 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Right Column: Clean, Modern, High-Converting Lead Form (7 cols) */}
              <AnimateOnScroll variant="fadeRight" delay={0.2} className="lg:col-span-7">
                <LeadForm />
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Supporting Proof: Category Leaders Marquee */}
        <section className="py-8 border-t border-white/[0.06]">
          <ClientsMarquee
            clients={clientBrands}
            title="Trusted By Category Leaders & Ambitious Scale-Ups Worldwide"
          />
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
      />
    </div>
  );
}
