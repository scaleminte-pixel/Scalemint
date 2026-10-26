import React from 'react';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactCTA from '@/components/ContactCTA';
import LeadForm from '@/components/LeadForm';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from '@/components/AnimateOnScroll';
import Link from 'next/link';
import {
  Sparkles,
  Check,
  CheckCircle2,
  Zap,
  Star,
  ArrowRight,
  Globe,
  Users,
  Video,
  Share2,
  ShieldCheck,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Business Growth Packages — Scalemint Studio',
  description: 'Turnkey website, client management CRM, high-retention monthly Reels, and complete social media management engineered for established businesses.',
};

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { displayOrder: 'asc' },
      include: {
        packages: {
          where: { status: 'PUBLISHED' },
          orderBy: { displayOrder: 'asc' },
        },
      },
    }),
  ]);

  // Find the primary business growth service
  const growthService = services.find((s) => s.slug === 'business-growth-packages') || services[0];
  const packages = growthService?.packages || [];

  return (
    <div className="min-h-screen flex flex-col bg-agency-dark">
      <Header
        siteName={settings?.siteName || 'Scalemint'}
        tagline={settings?.tagline || 'Business Growth Partner'}
        whatsappNumber={settings?.whatsappNumber}
        logoUrl={settings?.logoUrl}
      />

      <main className="flex-grow pt-32 pb-20">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-16">
          <AnimateOnScroll variant="fadeUp" className="space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>THE ALL-IN-ONE BUSINESS GROWTH SUITE</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              One Consolidated Engine for{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                Predictable Business Growth
              </span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              No fragmented agencies or disjointed retainers. Get a high-converting custom website, client management CRM, monthly viral Reels, and complete social media distribution under one predictable partnership.
            </p>
          </AnimateOnScroll>

          {/* 4 Core Pillars Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 text-left">
            <div className="glass-card rounded-2xl p-5 border border-agency-border/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-white">Website & Design</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Brand-aligned, high-speed Next.js flagships with free domain and cloud hosting.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-agency-border/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-white">Client Management</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Custom pipeline stages, follow-up reminders, team assignment, and invoicing records.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-agency-border/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-white">Monthly Reels</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                4 to 12 monthly high-retention 9:16 vertical video reels engineered to hook and convert.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-agency-border/80 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-sm text-white">Social Management</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Posts, carousels, stories, daily community engagement, and monthly growth roadmap.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing & Packages Grid */}
        <section id="packages" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Choose the Growth Package Built for Your Stage
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2">
              Every package is fully configurable through our client portal with dedicated sprint timelines and 100% IP ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg) => {
              const deliverablesList = Array.isArray(pkg.deliverables)
                ? pkg.deliverables
                : typeof pkg.deliverables === 'string'
                ? JSON.parse(pkg.deliverables)
                : [];

              const anchorId = pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

              return (
                <div
                  key={pkg.id}
                  id={anchorId}
                  className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all duration-300 ${
                    pkg.isPopular
                      ? 'bg-gradient-to-b from-[#1E1438] to-[#121226] border-2 border-purple-500 shadow-glow-purple lg:-translate-y-2'
                      : 'glass-card border border-agency-border hover:border-purple-500/30'
                  }`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{pkg.badge}</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-white">
                        {pkg.name}
                      </h3>
                      {pkg.bestFor && (
                        <p className="text-xs text-purple-300/80 mt-1.5 leading-relaxed font-medium">
                          {pkg.bestFor}
                        </p>
                      )}
                    </div>

                    {/* Price Block */}
                    <div className="pt-2 border-b border-agency-border/60 pb-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                          {pkg.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" />
                        <span>{pkg.timeline || 'One-Time Setup + Monthly Retainer'}</span>
                      </p>
                    </div>

                    {/* Deliverables List */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                        Included in Package:
                      </span>
                      <ul className="space-y-2.5 text-xs text-gray-300">
                        {deliverablesList.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 leading-snug">
                            <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button with package preselection */}
                  <div className="pt-8 mt-8 border-t border-agency-border/60">
                    <Link
                      href={`#contact?service=${encodeURIComponent(
                        growthService?.name || 'Business Growth Packages'
                      )}&packageId=${encodeURIComponent(pkg.id)}&package=${encodeURIComponent(pkg.name)}`}
                      className={`w-full py-3.5 rounded-xl font-heading font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                        pkg.isPopular
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-glow-purple hover:scale-[1.02]'
                          : 'bg-agency-card text-white hover:bg-purple-900/30 border border-agency-border hover:border-purple-500/40 hover:scale-[1.02]'
                      }`}
                    >
                      <span>{pkg.ctaText || 'Get Started with ' + pkg.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Side-by-Side Deliverable Matrix
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Direct breakdown of technical capacities and monthly inclusions across all 3 tiers.
            </p>
          </div>

          <div className="glass-card rounded-2xl border border-agency-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-agency-border bg-agency-dark/60 text-white font-heading font-bold">
                    <th className="p-4 sm:p-5 w-1/4">Feature & Scope</th>
                    <th className="p-4 sm:p-5 w-1/4 text-purple-300">Business Boost</th>
                    <th className="p-4 sm:p-5 w-1/4 text-purple-300 bg-purple-900/20">Growth Plus (Popular)</th>
                    <th className="p-4 sm:p-5 w-1/4 text-purple-300">Scale Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-agency-border/60 text-gray-300">
                  <tr className="bg-white/[0.02]">
                    <td colSpan={4} className="p-3 text-[11px] font-bold uppercase tracking-wider text-purple-400">
                      1. Website & Client System (One-Time Setup)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Pages & Layout</td>
                    <td className="p-4">Up to 5 Pages (Brand-Aligned)</td>
                    <td className="p-4 bg-purple-900/10">Up to 10 Pages (Custom Sections)</td>
                    <td className="p-4">Up to 15 Pages (Custom UI & Animations)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Domain & Hosting</td>
                    <td className="p-4 text-emerald-400 font-bold">Free Setup</td>
                    <td className="p-4 text-emerald-400 font-bold bg-purple-900/10">Free Setup</td>
                    <td className="p-4 text-emerald-400 font-bold">Free Setup</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Content & Products</td>
                    <td className="p-4">Fixed content (no self-editing)</td>
                    <td className="p-4 bg-purple-900/10">Admin access to edit designated content</td>
                    <td className="p-4">Full catalog + categories, search & filters</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Blog & Landing Pages</td>
                    <td className="p-4 text-gray-500">—</td>
                    <td className="p-4 bg-purple-900/10">Dynamic Blog + 1 Landing Page</td>
                    <td className="p-4">Blog with categories & search + 3 Landing Pages</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Client Management (CRM)</td>
                    <td className="p-4">Basic Client Directory</td>
                    <td className="p-4 bg-purple-900/10">Client & Follow-up Manager</td>
                    <td className="p-4">Sales & Client Manager + Deal Values</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Lead Stages</td>
                    <td className="p-4">New / Contacted</td>
                    <td className="p-4 bg-purple-900/10">New / Contacted / Interested / Confirmed / Lost</td>
                    <td className="p-4">Custom Sales Stages + Reminders</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Invoicing & PDF Records</td>
                    <td className="p-4 text-gray-500">—</td>
                    <td className="p-4 text-gray-500 bg-purple-900/10">—</td>
                    <td className="p-4 text-emerald-400 font-bold">Deal values, payment logs & PDF invoices</td>
                  </tr>

                  <tr className="bg-white/[0.02]">
                    <td colSpan={4} className="p-3 text-[11px] font-bold uppercase tracking-wider text-pink-400">
                      2. Reels Video & Social Media (Monthly Retainer)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Monthly Reels (Up to 30s)</td>
                    <td className="p-4 font-bold text-white">4 Reels</td>
                    <td className="p-4 font-bold text-white bg-purple-900/10">8 Reels</td>
                    <td className="p-4 font-bold text-white">12 Reels</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Managed Platforms</td>
                    <td className="p-4">1 Platform</td>
                    <td className="p-4 bg-purple-900/10">2 Platforms</td>
                    <td className="p-4">3 Platforms</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Monthly Posts & Carousels</td>
                    <td className="p-4">8 Posts (No Carousels)</td>
                    <td className="p-4 bg-purple-900/10">12 Posts (Includes 2 Carousels)</td>
                    <td className="p-4">16 Posts (Includes 4 Carousels)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Story Designs</td>
                    <td className="p-4">4 Stories</td>
                    <td className="p-4 bg-purple-900/10">8 Stories</td>
                    <td className="p-4">12 Stories</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Community Engagement</td>
                    <td className="p-4 text-gray-500">—</td>
                    <td className="p-4 bg-purple-900/10">Once daily (working days)</td>
                    <td className="p-4">Twice daily (working days)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-white">Strategy Meetings & Reports</td>
                    <td className="p-4">Brief monthly report</td>
                    <td className="p-4 bg-purple-900/10">Detailed report + 1 meeting</td>
                    <td className="p-4">Detailed report, roadmap + 2 meetings</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Integrated Enquiry Form */}
        <section id="contact" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <LeadForm defaultService="Business Growth Packages" />
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

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
