'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, Sparkles, X, ChevronUp } from 'lucide-react';

interface ServiceFloatingDockProps {
  serviceName: string;
  startingPrice?: string | null;
  whatsappNumber?: string | null;
}

export default function ServiceFloatingDock({
  serviceName,
  startingPrice,
  whatsappNumber,
}: ServiceFloatingDockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible || isDismissed) return null;

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappClean = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, '') : '1234567890';
  const whatsappUrl = `https://wa.me/${whatsappClean}?text=${encodeURIComponent(`Hi Scalemint team! I am interested in initiating a ${serviceName} sprint.`)}`;

  return (
    <aside aria-label="Quick Action Floating Bar" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl animate-in slide-in-from-bottom-8 duration-400">
      <div className="relative rounded-full border border-white/15 bg-[#0D0A1C]/85 backdrop-blur-2xl px-4 py-3 sm:px-6 sm:py-3.5 shadow-2xl shadow-purple-950/50 flex items-center justify-between gap-4 ring-1 ring-white/10">
        {/* Left info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:flex w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-heading font-bold text-white truncate">
                {serviceName}
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                ACTIVE QUEUE
              </span>
            </div>
            {startingPrice && (
              <span className="text-[11px] text-purple-300 font-mono hidden sm:inline-block">
                {startingPrice}
              </span>
            )}
          </div>
        </div>

        {/* Right CTA buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/[0.06] hover:bg-emerald-600/20 text-emerald-400 border border-white/10 hover:border-emerald-500/40 transition-all active:scale-95"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <button
            onClick={scrollToContact}
            className="px-5 py-2.5 rounded-full font-heading font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Initiate Sprint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
            title="Dismiss quick dock"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
