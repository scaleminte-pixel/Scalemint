'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Star, ArrowRight, Zap } from 'lucide-react';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from './AnimateOnScroll';

interface PackageItem {
  id: string;
  name: string;
  bestFor?: string | null;
  price: string;
  currency: string;
  deliverables?: string[] | string | null;
  revisions?: string | null;
  timeline?: string | null;
  isPopular: boolean;
  ctaText?: string | null;
}

interface ServiceWithPackages {
  id: string;
  name: string;
  slug: string;
  packages: PackageItem[];
}

interface PricingSectionProps {
  services: ServiceWithPackages[];
}

export default function PricingSection({ services }: PricingSectionProps) {
  const servicesWithPackages = services.filter(
    (s) => s.packages && s.packages.length > 0
  );

  const [activeTab, setActiveTab] = useState<string>(
    servicesWithPackages[0]?.slug || ''
  );

  const activeService = servicesWithPackages.find((s) => s.slug === activeTab);

  return (
    <section id="pricing" className="py-14 sm:py-16 relative bg-agency-surface/40 border-y border-agency-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fadeUp" className="text-center max-w-3xl mx-auto space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Transparent Investment</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Predictable Packages Built for High ROI
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            No hidden retainers or opaque hourly bills. Transparent sprint scopes and growth packages engineered to deliver maximum commercial return.
          </p>
        </AnimateOnScroll>

        {/* Service Switcher Tabs */}
        {servicesWithPackages.length > 1 && (
          <AnimateOnScroll variant="fadeUp" delay={0.15} className="flex items-center justify-center flex-wrap gap-2 mb-8">
            {servicesWithPackages.map((s) => (
              <button
                key={s.slug}
                onClick={() => setActiveTab(s.slug)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  activeTab === s.slug
                    ? 'bg-purple-600 text-white shadow-glow-purple scale-105'
                    : 'bg-agency-card text-gray-400 hover:text-white border border-agency-border hover:border-purple-500/30'
                }`}
              >
                {s.name}
              </button>
            ))}
          </AnimateOnScroll>
        )}

        {/* Packages Grid */}
        {activeService && activeService.packages.length > 0 ? (
          <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {activeService.packages.map((pkg) => {
              const deliverablesList = Array.isArray(pkg.deliverables)
                ? pkg.deliverables
                : typeof pkg.deliverables === 'string'
                ? JSON.parse(pkg.deliverables)
                : [];

              return (
                <StaggerItem key={pkg.id} variant="scaleUp">
                  <div
                    className={`rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-400 h-full ${
                      pkg.isPopular
                        ? 'bg-gradient-to-b from-[#1E1438] to-[#121226] border-2 border-purple-500 shadow-glow-purple lg:-translate-y-2'
                        : 'glass-card border border-agency-border hover:border-purple-500/30'
                    }`}
                  >
                    {/* Popular Badge */}
                    {pkg.isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Most Popular</span>
                      </div>
                    )}

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-heading text-2xl font-bold text-white">
                          {pkg.name}
                        </h3>
                        {pkg.bestFor && (
                          <p className="text-xs text-purple-300/80 mt-1 font-medium">
                            Best for: {pkg.bestFor}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="pt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="font-heading text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                            {pkg.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1">
                          {pkg.timeline ? `Estimated Timeline: ${pkg.timeline}` : 'Sprint Delivery'}
                        </p>
                      </div>

                      {/* Deliverables */}
                      <div className="space-y-3 pt-4 border-t border-agency-border/60">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                          Deliverables & Scope
                        </span>
                        <ul className="space-y-2.5 text-sm text-gray-300">
                          {deliverablesList.map((del: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                              <span className="leading-snug">{del}</span>
                            </li>
                          ))}
                          {pkg.revisions && (
                            <li className="flex items-start gap-2.5 pt-1 text-xs text-purple-300 font-medium">
                              <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                              <span>Revisions: {pkg.revisions}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-8 mt-8 border-t border-agency-border/60">
                      <Link
                        href={`#contact?service=${encodeURIComponent(
                          activeService.name
                        )}&packageId=${encodeURIComponent(pkg.id)}&package=${encodeURIComponent(pkg.name)}`}
                        className={`w-full py-3.5 rounded-xl font-heading font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                          pkg.isPopular
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-glow-purple hover:scale-[1.02]'
                            : 'bg-agency-card text-white hover:bg-purple-900/30 border border-agency-border hover:border-purple-500/40 hover:scale-[1.02]'
                        }`}
                      >
                        <span>{pkg.ctaText || 'Get Started Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            Select a service above to explore custom scopes and transparent packages.
          </div>
        )}
      </div>
    </section>
  );
}
