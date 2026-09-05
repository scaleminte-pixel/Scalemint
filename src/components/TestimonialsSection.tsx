'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';

export interface TestimonialItem {
  id?: string;
  clientName: string;
  clientRole?: string | null;
  companyName?: string | null;
  quote: string;
  rating?: number;
  photoMedia?: { publicUrl: string; altText?: string | null } | null;
}

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
  title?: string;
  subtitle?: string;
}

const defaultTestimonials: TestimonialItem[] = [
  {
    clientName: 'Jonathan Ellis',
    clientRole: 'CEO & Founder',
    companyName: 'Apex Ventures',
    quote: 'Scalemint completely transformed our digital presence. Their 360° approach meant our branding, website, and ads worked in perfect harmony. Our pipeline value tripled in 90 days.',
    rating: 5,
  },
  {
    clientName: 'Sarah Chen',
    clientRole: 'CMO',
    companyName: 'NovaTech Solutions',
    quote: 'Working with Scalemint felt like having an elite in-house team. The sprint velocity, design precision, and strategic thinking were unmatched. Our Google Ads ROAS jumped from 2.1x to 7.4x.',
    rating: 5,
  },
  {
    clientName: 'Marcus Rivera',
    clientRole: 'Head of Growth',
    companyName: 'Lumina Health',
    quote: 'The video content they produced was cinematic quality. Our social engagement increased 5x and the AI UGC ads became our highest-performing creative assets ever.',
    rating: 5,
  },
  {
    clientName: 'Emily Dawson',
    clientRole: 'Brand Director',
    companyName: 'Elevate Studios',
    quote: 'From brand identity to full website launch, Scalemint delivered everything in under 6 weeks. The craft and attention to detail rival agencies that charge 10x more.',
    rating: 5,
  },
  {
    clientName: 'David Okoye',
    clientRole: 'Founder & CEO',
    companyName: 'Pulse Commerce',
    quote: 'The commercial impact was immediate. Scalemint built our entire digital ecosystem — branding, high-speed Next.js storefront, and performance funnels. Revenue grew 280% year over year.',
    rating: 5,
  },
  {
    clientName: 'Elena Rostova',
    clientRole: 'VP of Marketing',
    companyName: 'Hyperion AI',
    quote: 'Scalemint is the only partner we trust with both creative and performance. Zero disconnect, lightning turnaround, and complete IP ownership. Absolutely indispensable.',
    rating: 5,
  },
];

const avatarColors = [
  'from-purple-500 to-indigo-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600',
  'from-violet-500 to-purple-600',
];

export default function TestimonialsSection({
  testimonials,
  title = 'Trusted by Category Leaders Worldwide',
  subtitle = 'Real commercial results delivered for ambitious founders, CMOs, and venture-backed scale-ups.',
}: TestimonialsSectionProps) {
  const items = testimonials && testimonials.length > 0 ? testimonials : defaultTestimonials;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(3);

  const totalItems = items.length;

  useEffect(() => {
    const updateCards = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };
    updateCards();
    window.addEventListener('resize', updateCards);
    return () => window.removeEventListener('resize', updateCards);
  }, []);

  const maxIndex = Math.max(0, totalItems - cardsPerView);

  // Auto-play sliding every 4.5 seconds smoothly
  useEffect(() => {
    if (!isAutoPlaying || totalItems <= cardsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalItems, cardsPerView, maxIndex]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section className="py-14 sm:py-16 relative overflow-hidden bg-agency-dark border-t border-white/[0.06]">
      {/* Ambient background light orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <AnimateOnScroll variant="fadeUp" className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Client Impact</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-gray-400 text-base sm:text-lg">
              {subtitle}
            </p>
          </AnimateOnScroll>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Testimonial"
              className="w-11 h-11 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Testimonial"
              className="w-11 h-11 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Smooth Horizontal Sliding Carousel Track */}
        <div
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="relative overflow-hidden w-full pb-4"
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {/* Render slides: on lg screens 3 items per view, on sm 2, on mobile 1 */}
            {items.map((item, idx) => {
              const colorClass = avatarColors[idx % avatarColors.length];
              const initials = item.clientName
                ? item.clientName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()
                : 'CL';

              return (
                <div
                  key={item.id || `${item.clientName}-${idx}`}
                  className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="h-full rounded-2xl glass-card p-7 sm:p-8 flex flex-col justify-between border border-white/[0.08] hover:border-purple-500/40 hover:shadow-card-hover transition-all duration-300 relative group">
                    <Quote className="absolute top-6 right-6 w-8 h-8 text-white/[0.05] group-hover:text-purple-500/20 transition-colors pointer-events-none" />

                    <div className="space-y-4">
                      {/* 5-Star Rating */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>

                      {/* Quote text */}
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal italic">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Client Author Details */}
                    <div className="pt-6 mt-6 border-t border-white/[0.07] flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-tr ${colorClass} flex items-center justify-center font-heading font-black text-xs text-white shadow-md shrink-0`}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-sm text-white truncate">
                          {item.clientName}
                        </h4>
                        <p className="text-xs text-purple-300 font-medium truncate">
                          {item.clientRole}
                          {item.companyName && (
                            <span className="text-gray-400 font-normal"> · {item.companyName}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel indicator dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(i);
              }}
              aria-label={`Jump to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-8 bg-purple-500' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
