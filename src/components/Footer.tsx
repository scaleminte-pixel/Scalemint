'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin, MessageCircle, ArrowUpRight, Lock, ShieldCheck, FileText, CreditCard } from 'lucide-react';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from './AnimateOnScroll';

interface FooterProps {
  siteName?: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string | null;
  whatsappNumber?: string | null;
  address?: string | null;
  footerText?: string | null;
  logoUrl?: string | null;
}

export default function Footer({
  siteName = 'Scalemint',
  tagline = '360° Creative & Digital Growth Partner',
  contactEmail = 'growth@scalemint.com',
  contactPhone = '+1 (415) 890-3412',
  whatsappNumber = '+14158903412',
  address = 'San Francisco, CA & Global Hubs',
  footerText = '© 2026 Scalemint Studio. All rights reserved. High-velocity creative & growth engine.',
  logoUrl,
}: FooterProps) {
  const services = [
    { name: 'Branding Design', href: '/services/branding-design' },
    { name: 'Website Design', href: '/services/website-design' },
    { name: 'Video Editing', href: '/services/video-editing' },
    { name: 'AI UGC Video Editing', href: '/services/ai-ugc-video-editing' },
    { name: 'Digital Marketing', href: '/services/digital-marketing' },
    { name: 'Google Ads Service', href: '/services/google-ads' },
  ];

  return (
    <footer className="bg-agency-surface border-t border-agency-border/60 relative overflow-hidden pt-16 pb-12">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 gradient-line" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-agency-border/60">
          {/* Col 1: Brand Info */}
          <StaggerItem variant="fadeUp" className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName || 'Scalemint'}
                  className="h-9 max-w-[160px] object-contain"
                />
              ) : (
                <>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-blue-500 flex items-center justify-center shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                    {siteName}
                  </span>
                </>
              )}
            </Link>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              {tagline}
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Unrestricted IP Handover</span>
            </div>
          </StaggerItem>

          {/* Col 2: Services */}
          <StaggerItem variant="fadeUp" className="space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-wider uppercase text-purple-400">
              Capabilities
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-white hover:underline transition-colors flex items-center gap-1 group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          {/* Col 3: Navigation */}
          <StaggerItem variant="fadeUp" className="space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-wider uppercase text-purple-400">
              Agency
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Scalemint
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Portfolio & Cases
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing & Sprints
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Studio Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Initiate Sprint
                </Link>
              </li>
            </ul>
          </StaggerItem>

          {/* Col 4: Legal & Policies */}
          <StaggerItem variant="fadeUp" className="space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-wider uppercase text-purple-400">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/payment-policy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Payment & Refund Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li className="pt-1 text-[11px] text-gray-500 font-mono">
                Mutual NDA Protected
              </li>
            </ul>
          </StaggerItem>

          {/* Col 5: Connect info */}
          <StaggerItem variant="fadeUp" className="space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-wider uppercase text-purple-400">
              Connect
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors truncate">
                  {contactEmail}
                </a>
              </li>
              {contactPhone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                  <a href={`tel:${contactPhone}`} className="hover:text-white transition-colors">
                    {contactPhone}
                  </a>
                </li>
              )}
              {whatsappNumber && (
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-300 transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2 pt-1 text-xs text-gray-500">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
            </ul>
          </StaggerItem>
        </StaggerContainer>

        {/* Bottom bar with legal links and Admin Portal */}
        <AnimateOnScroll variant="fadeIn" delay={0.2}>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>{footerText}</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
              <Link href="/terms" className="hover:text-gray-300 transition-colors">
                Terms
              </Link>
              <Link href="/payment-policy" className="hover:text-gray-300 transition-colors">
                Payment Policy
              </Link>
              <Link href="/privacy" className="hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <span className="text-gray-700 hidden sm:inline">•</span>
              <Link
                href="/admin/login"
                className="flex items-center gap-1 text-gray-600 hover:text-purple-400 transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </footer>
  );
}
