import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactCTA from '@/components/ContactCTA';
import prisma from '@/lib/prisma';
import { CreditCard, DollarSign, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Payment & Refund Policy — Scalemint Studio',
  description: 'Transparent milestone billing, accepted payment gateways, revision guarantees, cancellation terms, and refund policy for Scalemint Studio.',
};

export default async function PaymentPolicyPage() {
  const [settings, legalDoc] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'global' } }),
    prisma.legalPage.findUnique({ where: { slug: 'payment-policy' } }),
  ]);

  const paymentHighlights = [
    {
      title: 'Fixed Sprint Pricing',
      desc: 'Transparent fixed-scope fees. Zero hourly clock-watching, zero surprise bills.',
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: '100% Verified Gateways',
      desc: 'Stripe, Bank Wire, Wise, and Corporate ACH with automated VAT invoices.',
      icon: <CreditCard className="w-5 h-5 text-blue-400" />,
    },
    {
      title: '6-Month Pause Shield',
      desc: 'Pause or reschedule any sprint for up to 6 months with zero penalty fee.',
      icon: <RefreshCw className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Satisfaction Guarantee',
      desc: 'Structured revision rounds until deliverables match technical specifications.',
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
    },
  ];

  let policySections = [
    {
      id: 'billing-structure',
      title: '1. Billing Architecture & Sprint Structure',
      content: `Scalemint operates exclusively on fixed-scope, outcome-driven sprint models. Unlike traditional agency retainers that bill hundreds of hours without tangible deliverables, every Scalemint package or custom SOW establishes an unambiguous scope, fixed investment, and calendar delivery date. All prices are quoted in USD ($) unless explicitly contracted in EUR or GBP.`,
    },
    {
      id: 'milestone-schedule',
      title: '2. Payment Milestones & Scheduling',
      content: `Standard creative and engineering sprints follow a transparent 50/50 milestone schedule:
• Initial Sprint Deposit (50%): Due upon booking confirmation to secure dedicated senior talent allocation and initiate onboarding.
• Final Milestone Settlement (50%): Due upon final deliverable review and prior to the irrevocable transfer of production source code, vector master files, or live domain deployments.
• Expedited Sprints (under 7 days) or Turnkey UGC packs are invoiced at 100% upfront to initiate immediate same-day execution.`,
    },
    {
      id: 'payment-methods',
      title: '3. Accepted Payment Methods & Security',
      content: `We accept payments exclusively through secure, audited enterprise channels:
• Major Credit & Debit Cards (Visa, Mastercard, American Express) processed via Stripe with 256-bit SSL encryption.
• Direct Bank Wire (Fedwire / SWIFT) and Domestic ACH Transfers for enterprise contracts exceeding $5,000.
• Wise Global Multi-Currency Transfer for seamless cross-border international settlements.
• Verified Stablecoin (USDC / USDT via Ethereum/Polygon) available upon request for Web3 and decentralized tech founders.
Scalemint never stores or accesses raw credit card numbers directly on our internal servers.`,
    },
    {
      id: 'refund-policy',
      title: '4. Refund, Cancellation & Satisfaction Policy',
      content: `We pride ourselves on an industry-leading 98%+ client satisfaction rate. Our refund and cancellation terms are structured as follows:
• Cancellation Prior to Sprint Kickoff: If a client requests cancellation prior to the scheduled strategy kickoff and onboarding session, 100% of the deposit is refunded promptly within 5 to 7 business days.
• In-Sprint Revision Guarantee: If an initial creative draft requires adjustment, we do not issue generic cancellations. Instead, our senior craft team conducts structured correction rounds to revise the work until it conforms to the agreed creative brief and SOW guidelines.
• Non-Refundable Deliverables: Due to the bespoke nature of creative design, video post-production, custom Next.js engineering, and media ad spend, once final milestone deliverables, vector master files, or live production repositories are transferred to the client, those delivered services are final and non-refundable.`,
    },
    {
      id: 'pause-reschedule',
      title: '5. Sprint Pause & Reschedule Flexibility',
      content: `We understand that founder schedules and market timelines shift. If your internal team needs to pause a project (e.g. pending product launch or legal clearance), you may freeze your sprint for up to 6 months with zero penalty. Remaining milestone credits remain fully allocated to your account.`,
    },
    {
      id: 'chargeback-protection',
      title: '6. Chargeback & Dispute Protocol',
      content: `Clients agree to contact Scalemint management at billing@scalemint.com to resolve any invoice discrepancy or deliverable dispute before issuing a payment dispute or chargeback with their card provider. Engaging in chargebacks without prior mutual mediation forfeits all ongoing software support, intellectual property handover licenses, and guarantees.`,
    },
  ];

  if (legalDoc?.sections) {
    try {
      const parsed = JSON.parse(legalDoc.sections);
      if (Array.isArray(parsed) && parsed.length > 0) {
        policySections = parsed;
      }
    } catch (e) {
      console.error('Error parsing payment policy sections:', e);
    }
  }

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
        <div className="ambient-orb top-20 left-10 w-[600px] h-[600px] bg-emerald-600/10 pointer-events-none" />
        <div className="ambient-orb top-96 right-10 w-[500px] h-[500px] bg-purple-600/10 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-sm">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>FINANCIAL TRANSPARENCY</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Payment & <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Refund Policy</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Transparent milestone billing, secure payment gateways, structured revision commitments, and fair refund guidelines for high-velocity collaborations.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-mono text-gray-500 pt-1">
              <span>Effective: January 2026</span>
              <span>•</span>
              <span>Zero Hidden Retainers</span>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {paymentHighlights.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md flex items-start gap-4 hover:border-emerald-500/30 transition-colors"
              >
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 shrink-0">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-white text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Policy Sections */}
          <div className="space-y-8">
            {policySections.map((sec) => (
              <div
                key={sec.id}
                id={sec.id}
                className="rounded-3xl border border-white/10 bg-[#0A0D18]/85 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-3"
              >
                <h2 className="font-heading font-bold text-white text-lg sm:text-xl flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{sec.title}</span>
                </h2>
                <div className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line pl-4 border-l border-white/10">
                  {sec.content}
                </div>
              </div>
            ))}
          </div>

          {/* Terms Cross Link Banner */}
          <div className="mt-12 p-6 rounded-3xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="font-heading font-bold text-white text-base">
                Looking for Full Terms & Conditions?
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Review our Master Services Agreement, IP transfer rights, and confidentiality terms.
              </p>
            </div>
            <Link
              href="/terms"
              className="px-5 py-2.5 rounded-xl font-heading font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-black transition-all shrink-0 shadow-md shadow-emerald-900/30"
            >
              View Terms & Conditions
            </Link>
          </div>
        </div>

        {/* Lead Conversion CTA */}
        <section className="mt-16">
          <ContactCTA
            title="Have Custom Invoicing or Enterprise Billing Requirements?"
            subtitle="We support custom procurement processes, vendor onboarding forms, and enterprise Net-30 payment arrangements."
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
        logoUrl={settings?.logoUrl}
      />
    </div>
  );
}
