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
                  className="h-8 max-w-[150px] object-contain group-hover:scale-105 transition-transform"
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
              {/* Interactive Services Dropdown */}
              <div
                ref={dropdownRef}
                className="relative group/menu"
                onMouseEnter={() => setServicesDropdownOpen(true)}
              >
                <button
                  type="button"
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className={`flex items-center gap-1.5 text-[14px] font-semibold tracking-normal transition-colors py-1 cursor-pointer ${
                    servicesDropdownOpen ? 'text-purple-400' : 'text-gray-200 hover:text-white'
                  }`}
                  aria-expanded={servicesDropdownOpen}
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      servicesDropdownOpen ? 'rotate-180 text-purple-400' : 'text-gray-400 group-hover/menu:text-white'
                    }`}
                  />
                </button>

                {/* Dropdown Menu Window */}
                <div
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                  className={`absolute top-full -left-28 mt-3 w-[620px] rounded-3xl bg-[#0C091A]/95 backdrop-blur-3xl border border-white/15 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-1 ring-white/10 transition-all duration-200 z-50 ${
                    servicesDropdownOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto block'
                      : 'opacity-0 translate-y-2 pointer-events-none hidden lg:group-hover/menu:opacity-100 lg:group-hover/menu:translate-y-0 lg:group-hover/menu:pointer-events-auto lg:group-hover/menu:block'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
                    <span className="text-xs uppercase tracking-wider text-purple-400 font-bold font-mono">
                      The 6 Core Disciplines
                    </span>
                    <Link
                      href="/#services"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="text-xs text-gray-300 hover:text-white flex items-center gap-1 group"
                    >
                      <span>View all overview</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {coreServices.map((service) => {
                      const Icon = service.icon;
                      return (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={() => setServicesDropdownOpen(false)}
                          className="p-3 rounded-2xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.1] transition-all flex items-start gap-3 group"
                        >
                          <div className={`p-2.5 rounded-xl border ${service.color} shrink-0 group-hover:scale-105 transition-transform`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5 truncate">
                            <span className="font-heading font-bold text-sm text-white group-hover:text-purple-300 transition-colors block truncate">
                              {service.name}
                            </span>
                            <span className="text-[12px] text-gray-400 line-clamp-1 block">
                              {service.desc}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Portfolio Link */}
              <Link
                href="/portfolio"
                className="text-[14px] font-semibold tracking-normal text-gray-200 hover:text-purple-300 transition-colors relative group py-1"
              >
                <span>Portfolio</span>
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

              {/* Pricing */}
              <Link
                href="/pricing"
                className="text-[14px] font-semibold tracking-normal text-gray-200 hover:text-purple-300 transition-colors relative group py-1"
              >
                <span>Pricing</span>
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
            {/* Services Group */}
            <div>
              <span className="text-xs uppercase tracking-wider text-purple-400 font-bold font-mono block mb-2">
                Services
              </span>
              <div className="grid grid-cols-1 gap-1 pl-2 border-l border-white/10">
                {coreServices.map((s) => (
                  <Link
                    key={s.name}
                    href={s.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-gray-300 hover:text-purple-300 py-1.5 transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Other links */}
            <div className="space-y-1 pt-3 border-t border-white/10">
              <Link
                href="/portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-200 hover:text-purple-300 block py-1.5 transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-200 hover:text-purple-300 block py-1.5 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-200 hover:text-purple-300 block py-1.5 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-200 hover:text-purple-300 block py-1.5 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-gray-200 hover:text-purple-300 block py-1.5 transition-colors"
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
