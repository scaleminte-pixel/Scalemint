'use client';

import React from 'react';
import { ShieldCheck, Zap, TrendingUp, Layers } from 'lucide-react';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from './AnimateOnScroll';

interface FeatureItem {
  title: string;
  desc: string;
}

interface WhyChooseUsProps {
  title?: string | null;
  subtitle?: string | null;
  features?: FeatureItem[] | null;
}

export default function WhyChooseUs({
  title = 'Why Forward-Thinking Brands Partner With Scalemint',
  subtitle = 'No fragmented freelancers. No bloated corporate bureaucracy. Just one agile creative partner obsessed with your brand elevation and measurable ROI.',
  features,
}: WhyChooseUsProps) {
  const defaultFeatures: FeatureItem[] = [
    {
      title: 'One Unified Creative Partner',
      desc: 'Branding, web design, video editing, AI UGC, and Google Ads unified under one clear vision. Zero miscommunication.',
    },
    {
      title: 'High-Velocity Sprints',
      desc: 'We operate in focused sprint cadences with predictable delivery, transparent milestones, and direct Slack communication.',
    },
    {
      title: 'Conversion-First Philosophy',
      desc: 'Visual prestige backed by quantitative performance psychology, CRO principles, and ruthless ROAS focus.',
    },
    {
      title: '100% Asset Ownership',
      desc: 'You maintain absolute intellectual property ownership of your Figma systems, codebase, raw media, and ad accounts.',
    },
  ];

  const list = features && features.length > 0 ? features : defaultFeatures;

  const icons = [
    <Layers key="1" className="w-6 h-6 text-purple-400" />,
    <Zap key="2" className="w-6 h-6 text-blue-400" />,
    <TrendingUp key="3" className="w-6 h-6 text-amber-400" />,
    <ShieldCheck key="4" className="w-6 h-6 text-emerald-400" />,
  ];

  const hoverColors = [
    'hover:border-purple-500/50 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.2)]',
    'hover:border-blue-500/50 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.2)]',
    'hover:border-amber-500/50 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)]',
    'hover:border-emerald-500/50 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)]',
  ];

  return (
    <section id="why-us" className="py-14 sm:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fadeUp" className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <span>Competitive Advantage</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {subtitle}
          </p>
        </AnimateOnScroll>

        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((item, index) => (
            <StaggerItem key={index} variant="scaleUp">
              <div className={`glass-card rounded-2xl p-7 border border-agency-border flex flex-col justify-between space-y-4 transition-all duration-400 cursor-default h-full ${hoverColors[index % hoverColors.length]}`}>
                <div className="w-12 h-12 rounded-xl bg-agency-dark flex items-center justify-center border border-agency-border">
                  {icons[index % icons.length]}
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
