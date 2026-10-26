'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  Calendar,
  Palette,
  Layout,
  Film,
  TrendingUp,
  Target,
} from 'lucide-react';
import BookingModal from './BookingModal';

interface HeaderProps {
  siteName?: string | null;
  tagline?: string | null;
  whatsappNumber?: string | null;
  logoUrl?: string | null;
}

export default function Header({
  siteName = 'Scalemint',
  whatsappNumber,
  logoUrl,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const coreServices = [
    {
      name: 'Branding Design',
      href: '/services/branding-design',
      desc: 'Distinctive visual identity & typography systems',
      icon: Palette,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      name: 'Website Design',
      href: '/services/website-design',
      desc: 'High-speed Next.js flagships engineered for CRO',
      icon: Layout,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      name: 'Video Editing',
      href: '/services/video-editing',
      desc: 'Cinematic pacing & high-retention social films',
      icon: Film,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      name: 'AI UGC Video Editing',
      href: '/services/ai-ugc-video-editing',
      desc: 'Direct-response viral ad hooks for TikTok & Meta',
      icon: Sparkles,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      name: 'Digital Marketing Service',
      href: '/services/digital-marketing',
      desc: 'Omnichannel growth funnels & automated email flows',
      icon: TrendingUp,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      name: 'Google Ads Service',
      href: '/services/google-ads',
      desc: 'High-intent PPC, Shopping & Performance Max ROAS',
      icon: Target,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2.5 sm:py-3' : 'py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-500 ${
              scrolled
                ? 'apple-glass shadow-2xl'
                : 'bg-black/40 backdrop-blur-xl border border-white/[0.08] shadow-lg'
            }`}
          >
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName || 'Scalemint'}
                  className="h-9 sm:h-10 md:h-11 max-w-[220px] w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-md"
                />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-glow-purple/40 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors leading-none">
                      {siteName || 'Scalemint'}
                    </span>
                    <span className="text-[9px] tracking-widest text-purple-400 uppercase font-bold mt-0.5">
                      Studio
                    </span>
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {/* Direct Consolidated Services & Packages Link */}
              <Link
                href="/services"
                className="text-[14px] font-semibold tracking-normal text-gray-200 hover:text-purple-300 transition-colors relative group py-1"
              >
                <span>Services & Packages</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-400 rounded-full group-hover:w-full transition-all duration-300" />
              </Link>

              {/* About Us */}
              <Link
                href="/about"
                className="text-[14px] font-semibold tracking-normal text-gray-200 hover:text-purple-300 transition-colors relative group py-1"
              >
                <span>About</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-400 rounded-full group-hover:w-full transition-all duration-300" />
              </Link>

              {/* Blog Link */}
              <Link
                href="/blog"
                className="text-[14px] font-semibold tracking-normal text-gray-200 hover:text-purple-300 transition-colors relative group py-1"
              >
                <span>Blog</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-400 rounded-full group-hover:w-full transition-all duration-300" />
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className="text-[14px] font-semibold tracking-normal text-gray-200 hover:text-purple-300 transition-colors relative group py-1"
              >
                <span>Contact</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-purple-400 rounded-full group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>

            {/* Actions: WhatsApp + Radiant Book a Call Button */}
            <div className="hidden lg:flex items-center gap-3">
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 transition-all text-xs font-mono font-medium shadow-sm hover:scale-105 active:scale-95"
                  title="Direct WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              )}

              {/* Book a Call Primary Button */}
              <button
                type="button"
                onClick={() => setBookingModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-heading font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-md shadow-purple-900/30 hover:shadow-glow-purple transition-all duration-300 active:scale-95 border border-white/15 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span>Book a Call</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.05] text-gray-200 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mx-4 mt-2 bg-[#0C091A]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 space-y-4 shadow-2xl animate-fadeIn">
            {/* Direct Links */}
            <div className="space-y-1">
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-200 hover:text-purple-300 block py-2 transition-colors border-b border-white/[0.06]"
              >
                Services & Packages
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-200 hover:text-purple-300 block py-2 transition-colors border-b border-white/[0.06]"
              >
                About Us
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-200 hover:text-purple-300 block py-2 transition-colors border-b border-white/[0.06]"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-200 hover:text-purple-300 block py-2 transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setBookingModalOpen(true);
                }}
                className="w-full py-3 rounded-2xl font-heading font-bold text-xs text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center gap-2 shadow-glow-purple cursor-pointer active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Call</span>
              </button>

              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2.5 rounded-2xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Interactive Meeting Scheduler Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </>
  );
}
