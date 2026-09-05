'use client';

import React from 'react';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from './AnimateOnScroll';

interface StepItem {
  step: string;
  title: string;
  desc: string;
}

interface ProcessSectionProps {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  steps?: StepItem[] | null;
}

export default function ProcessSection({
  badge = 'Methodology',
  title = 'A Frictionless, Battle-Tested 5-Step Process',
  subtitle = 'From initial discovery to live production and revenue scale, here is how we partner with your team.',
  steps,
}: ProcessSectionProps) {
  const defaultSteps: StepItem[] = [
    { step: '01', title: 'Discovery & Audit', desc: 'We audit your market, ideal buyer persona, competitive gaps, and current conversion bottlenecks.' },
    { step: '02', title: 'Strategic Roadmap', desc: 'We blueprint the exact deliverables, design system, tech stack, and measurable KPI milestones.' },
    { step: '03', title: 'Sprint Production', desc: 'Our specialized squads execute branding, coding, video cutting, or ad campaign setups with velocity.' },
    { step: '04', title: 'Review & Refinement', desc: 'Iterative feedback rounds to polish every design token, copy hook, and interaction state.' },
    { step: '05', title: 'Launch & Scale', desc: 'Live deployment with verified tracking, speed audits, and continuous conversion optimization.' },
  ];

  const list = steps && steps.length > 0 ? steps : defaultSteps;

  const stepColors = [
    'group-hover:text-purple-400 group-hover:border-purple-500/40',
    'group-hover:text-blue-400 group-hover:border-blue-500/40',
    'group-hover:text-indigo-400 group-hover:border-indigo-500/40',
    'group-hover:text-amber-400 group-hover:border-amber-500/40',
    'group-hover:text-emerald-400 group-hover:border-emerald-500/40',
  ];

  const dotColors = [
    'group-hover:bg-purple-400',
    'group-hover:bg-blue-400',
    'group-hover:bg-indigo-400',
    'group-hover:bg-amber-400',
    'group-hover:bg-emerald-400',
  ];

  return (
    <section id="process" className="py-14 sm:py-16 relative overflow-hidden bg-agency-surface/50 border-t border-agency-border/60">
      {/* Gradient line separator at top */}
      <div className="absolute top-0 left-0 right-0 gradient-line" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fadeUp" className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
            <span>{badge || 'Methodology'}</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            {subtitle}
          </p>
        </AnimateOnScroll>

        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {list.map((item, index) => (
            <StaggerItem key={index} variant="slideUp">
              <div className={`glass-card rounded-2xl p-6 border border-agency-border relative flex flex-col justify-between group transition-all duration-300 h-full ${stepColors[index % stepColors.length]}`}>
                <div className="space-y-3">
                  <span className="font-heading font-black text-3xl text-purple-400/80 group-hover:text-current transition-colors">
                    {item.step}
                  </span>
                  <h3 className="font-heading text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Progress Connector */}
                <div className="mt-4 pt-3 border-t border-agency-border/60 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                  <span>Phase 0{index + 1}</span>
                  <span className={`w-2.5 h-2.5 rounded-full bg-purple-500/40 transition-colors ${dotColors[index % dotColors.length]}`} />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
