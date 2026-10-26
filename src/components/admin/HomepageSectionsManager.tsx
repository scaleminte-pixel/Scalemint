'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  RotateCw,
  Eye,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Compass,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface HomepageSectionsManagerProps {
  showNotification: (msg: string, isErr?: boolean) => void;
}

type SectionTab =
  | 'hero'
  | 'services_intro'
  | 'about'
  | 'why_us'
  | 'process'
  | 'final_cta';

export default function HomepageSectionsManager({
  showNotification,
}: HomepageSectionsManagerProps) {
  const [activeSubTab, setActiveSubTab] = useState<SectionTab>('hero');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Raw sections state mapped by sectionKey
  const [sectionsMap, setSectionsMap] = useState<Record<string, any>>({});

  // 1. Hero Section Form State
  const [heroForm, setHeroForm] = useState({
    title: 'The 360 Creative and Growth Engine',
    subtitle:
      'We unite strategic branding, web design, video editing, AI UGC, digital marketing, and Google Ads under one high-velocity squad.',
    badge: 'Accepting Select Q2/Q3 Growth Partners',
    ctaText: 'Start Your Project',
    ctaLink: '#contact',
    ctaSecondaryText: 'Explore Core Services',
    ctaSecondaryLink: '#services',
    livePill: 'Select Q2/Q3 Production Slots Active · Direct Senior Squad Access',
    trustBadges: [
      '100% Source Code & IP Ownership',
      'Sprint Delivery Timelines',
      'Strict Non-Disclosure Guarantee',
    ],
    orbitLabels: ['Branding', 'Web Dev', 'Video', 'Google Ads'],
    bentoCards: [
      {
        eyebrow: 'Full-Stack Synergy',
        value: '360°',
        title: 'Core Capabilities',
        desc: 'Branding, Next.js code, viral video, and Google Ads unified under one senior squad.',
      },
      {
        eyebrow: 'Sprint Velocity',
        value: '100%',
        title: 'Focus & Execution',
        desc: 'Rigorous sprint delivery cadences with transparent milestones and asynchronous Slack updates.',
      },
      {
        eyebrow: 'Asset Security',
        value: '1 Squad',
        title: 'Creative Partner',
        desc: 'Strict enterprise NDAs and 100% full intellectual property transfer on all deliverables.',
      },
    ],
  });

  // 2. Services Intro Form State
  const [servicesIntroForm, setServicesIntroForm] = useState({
    badge: 'Comprehensive 360° Disciplines',
    title: 'Six Specialized Pillars. One Unified Squad.',
    subtitle:
      'Every capability is executed with direct-response intent and aesthetic prestige so your brand commands authority and delivers commercial ROI.',
  });

  // 3. About Us ("Who We Are & Why We Exist") Form State
  const [aboutForm, setAboutForm] = useState({
    badge: 'Who We Are & Why We Exist',
    title: 'One Unified Growth Engine For Ambitious Business Leaders',
    paragraph1:
      'Most businesses waste months coordinating disconnected providers: web designers who ignore conversions, CRM tools left unconfigured, video editors delivering random clips, and social managers posting without commercial strategy.',
    paragraph2:
      'Scalemint was engineered as the all-in-one antidote. We combine custom high-speed websites, automated client management CRMs, monthly viral Reels, and complete social media management into one predictable, high-velocity growth engine.',
    checklist: [
      'Turnkey Website + CRM Setup',
      'Monthly High-Retention Reels',
      'Full Source & 100% IP Ownership',
      'Dedicated Growth Squad & Sprints',
    ],
    standardsBadge: 'Our Operating Standards',
    standardsTitle: 'Engineered for Absolute Commercial Growth',
    metrics: [
      { value: '360°', desc: 'All-In-One Suite (Web + CRM + Reels + Social)' },
      { value: '3x', desc: 'Faster Business Growth & Lead Conversion' },
      { value: '100%', desc: 'Full Asset, Code & Social Account Ownership' },
      { value: '24h', desc: 'Rapid Strategic Onboarding & Sprint Kickoff' },
    ],
    ndaText:
      'Strict enterprise non-disclosure agreements (NDAs) standard for all client engagements.',
  });

  // 4. Why Choose Us (Competitive Advantage) Form State
  const [whyUsForm, setWhyUsForm] = useState({
    badge: 'Competitive Advantage',
    title: 'Why Forward-Thinking Brands Partner With Scalemint',
    subtitle: 'Precision craft across branding, code, and paid channels.',
    features: [
      {
        title: 'One Unified Creative Partner',
        desc: 'Branding, web design, video, and paid acquisition aligned under one strategic vision with zero disconnect.',
      },
      {
        title: 'High-Velocity Sprints',
        desc: 'We move fast with dedicated design sprints, predictable delivery timelines, and transparent Slack communication.',
      },
      {
        title: 'Conversion-First Philosophy',
        desc: 'Aesthetic excellence backed by behavioral psychology, CRO principles, and performance ad testing.',
      },
      {
        title: 'Full Content Ownership',
        desc: 'You retain 100% ownership of your source files, Figma systems, code repositories, and ad creative assets.',
      },
    ],
  });

  // 5. 5-Step Process (Methodology) Form State
  const [processForm, setProcessForm] = useState({
    badge: 'Methodology',
    title: 'A Frictionless, Battle-Tested 5-Step Process',
    subtitle:
      'From initial strategy to live deployment and revenue scale, here is how we work together.',
    steps: [
      {
        step: '01',
        title: 'Discovery & Audit',
        desc: 'We dissect your market, ideal buyer persona, competitive gaps, and growth bottlenecks.',
      },
      {
        step: '02',
        title: 'Strategic Roadmap',
        desc: 'We blueprint the exact deliverables, visual style, technical stack, and KPI milestones.',
      },
      {
        step: '03',
        title: 'Sprint Production',
        desc: 'Our specialized squads execute branding, coding, video cutting, or ad campaign building.',
      },
      {
        step: '04',
        title: 'Review & Refinement',
        desc: 'Interactive feedback loops to polish every pixel, copy hook, and interaction state.',
      },
      {
        step: '05',
        title: 'Launch & Scale',
        desc: 'Deployment with verified tracking, QA verification, and post-launch optimization.',
      },
    ],
  });

  // 6. Final CTA Form State
  const [finalCtaForm, setFinalCtaForm] = useState({
    title: 'Scale Your Revenue Today With Our Dedicated Agency Squad',
    subtitle:
      'Book a discovery consultation or request a custom proposal today. Let’s build something extraordinary together.',
    ctaText: 'Schedule a Discovery Call',
    ctaLink: '#contact',
    ctaSecondaryText: 'Chat on WhatsApp',
    ctaSecondaryLink: 'https://wa.me/14158903412',
  });

  // Fetch sections from DB and populate state
  const loadSections = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sections');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const map: Record<string, any> = {};
        for (const s of data.data) {
          if (s.page === 'home') {
            map[s.sectionKey] = {
              ...s,
              metadata: s.metadata
                ? typeof s.metadata === 'string'
                  ? JSON.parse(s.metadata)
                  : s.metadata
                : null,
            };
          }
        }
        setSectionsMap(map);

        // Populate Hero
        const h = map['hero'];
        if (h) {
          setHeroForm((prev) => ({
            ...prev,
            title: h.title || prev.title,
            subtitle: h.subtitle || prev.subtitle,
            badge: h.metadata?.badge || prev.badge,
            ctaText: h.ctaText || prev.ctaText,
            ctaLink: h.ctaLink || prev.ctaLink,
            ctaSecondaryText: h.ctaSecondaryText || prev.ctaSecondaryText,
            ctaSecondaryLink: h.ctaSecondaryLink || prev.ctaSecondaryLink,
            livePill: h.metadata?.livePill || prev.livePill,
            trustBadges:
              Array.isArray(h.metadata?.trustBadges) && h.metadata.trustBadges.length > 0
                ? h.metadata.trustBadges
                : prev.trustBadges,
            orbitLabels:
              Array.isArray(h.metadata?.orbitLabels) && h.metadata.orbitLabels.length > 0
                ? h.metadata.orbitLabels
                : prev.orbitLabels,
            bentoCards:
              Array.isArray(h.metadata?.bentoCards) && h.metadata.bentoCards.length > 0
                ? h.metadata.bentoCards
                : prev.bentoCards,
          }));
        }

        // Populate Services Intro
        const si = map['services_intro'];
        if (si) {
          setServicesIntroForm((prev) => ({
            ...prev,
            badge: si.metadata?.badge || prev.badge,
            title: si.title || prev.title,
            subtitle: si.subtitle || prev.subtitle,
          }));
        }

        // Populate About
        const ab = map['about'];
        if (ab) {
          setAboutForm((prev) => ({
            ...prev,
            badge: ab.metadata?.badge || prev.badge,
            title: ab.title || prev.title,
            paragraph1: ab.subtitle || prev.paragraph1,
            paragraph2: ab.metadata?.paragraph2 || prev.paragraph2,
            checklist:
              Array.isArray(ab.metadata?.checklist) && ab.metadata.checklist.length > 0
                ? ab.metadata.checklist
                : prev.checklist,
            standardsBadge: ab.metadata?.standardsBadge || prev.standardsBadge,
            standardsTitle: ab.metadata?.standardsTitle || prev.standardsTitle,
            metrics:
              Array.isArray(ab.metadata?.metrics) && ab.metadata.metrics.length > 0
                ? ab.metadata.metrics
                : prev.metrics,
            ndaText: ab.metadata?.ndaText || prev.ndaText,
          }));
        }

        // Populate Why Choose Us
        const wc = map['why_choose_us'];
        if (wc) {
          setWhyUsForm((prev) => ({
            ...prev,
            badge: wc.metadata?.badge || prev.badge,
            title: wc.title || prev.title,
            subtitle: wc.subtitle || prev.subtitle,
            features:
              Array.isArray(wc.metadata?.features) && wc.metadata.features.length > 0
                ? wc.metadata.features
                : prev.features,
          }));
        }

        // Populate Process
        const pr = map['process'];
        if (pr) {
          setProcessForm((prev) => ({
            ...prev,
            badge: pr.metadata?.badge || prev.badge,
            title: pr.title || prev.title,
            subtitle: pr.subtitle || prev.subtitle,
            steps:
              Array.isArray(pr.metadata?.steps) && pr.metadata.steps.length > 0
                ? pr.metadata.steps
                : prev.steps,
          }));
        }

        // Populate Final CTA
        const fc = map['final_cta'];
        if (fc) {
          setFinalCtaForm((prev) => ({
            ...prev,
            title: fc.title || prev.title,
            subtitle: fc.subtitle || prev.subtitle,
            ctaText: fc.ctaText || prev.ctaText,
            ctaLink: fc.ctaLink || prev.ctaLink,
            ctaSecondaryText: fc.ctaSecondaryText || prev.ctaSecondaryText,
            ctaSecondaryLink: fc.ctaSecondaryLink || prev.ctaSecondaryLink,
          }));
        }
      }
    } catch (err) {
      showNotification('Failed to load page sections', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  // Generic Save Helper
  const saveSection = async (sectionKey: string, payload: any) => {
    setSavingKey(sectionKey);
    try {
      const body = {
        page: 'home',
        sectionKey,
        ...payload,
      };

      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`Homepage "${sectionKey}" section updated successfully!`);
        loadSections();
      } else {
        showNotification(data.error || 'Failed to update section', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving section', true);
    } finally {
      setSavingKey(null);
    }
  };

  // 1. Save Hero
  const handleSaveHero = () => {
    saveSection('hero', {
      title: heroForm.title,
      subtitle: heroForm.subtitle,
      ctaText: heroForm.ctaText,
      ctaLink: heroForm.ctaLink,
      ctaSecondaryText: heroForm.ctaSecondaryText,
      ctaSecondaryLink: heroForm.ctaSecondaryLink,
      metadata: {
        badge: heroForm.badge,
        livePill: heroForm.livePill,
        trustBadges: heroForm.trustBadges,
        orbitLabels: heroForm.orbitLabels,
        bentoCards: heroForm.bentoCards,
      },
    });
  };

  // 2. Save Services Intro
  const handleSaveServicesIntro = () => {
    saveSection('services_intro', {
      title: servicesIntroForm.title,
      subtitle: servicesIntroForm.subtitle,
      metadata: {
        badge: servicesIntroForm.badge,
      },
    });
  };

  // 3. Save About
  const handleSaveAbout = () => {
    saveSection('about', {
      title: aboutForm.title,
      subtitle: aboutForm.paragraph1,
      metadata: {
        badge: aboutForm.badge,
        paragraph2: aboutForm.paragraph2,
        checklist: aboutForm.checklist,
        standardsBadge: aboutForm.standardsBadge,
        standardsTitle: aboutForm.standardsTitle,
        metrics: aboutForm.metrics,
        ndaText: aboutForm.ndaText,
      },
    });
  };

  // 4. Save Why Choose Us
  const handleSaveWhyUs = () => {
    saveSection('why_choose_us', {
      title: whyUsForm.title,
      subtitle: whyUsForm.subtitle,
      metadata: {
        badge: whyUsForm.badge,
        features: whyUsForm.features,
      },
    });
  };

  // 5. Save Process
  const handleSaveProcess = () => {
    saveSection('process', {
      title: processForm.title,
      subtitle: processForm.subtitle,
      metadata: {
        badge: processForm.badge,
        steps: processForm.steps,
      },
    });
  };

  // 6. Save Final CTA
  const handleSaveFinalCta = () => {
    saveSection('final_cta', {
      title: finalCtaForm.title,
      subtitle: finalCtaForm.subtitle,
      ctaText: finalCtaForm.ctaText,
      ctaLink: finalCtaForm.ctaLink,
      ctaSecondaryText: finalCtaForm.ctaSecondaryText,
      ctaSecondaryLink: finalCtaForm.ctaSecondaryLink,
    });
  };

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        <span className="text-xs text-gray-400 font-mono">Loading homepage sections...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">Homepage Sections CMS</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Fully control hero typography, orbiting labels, credibility counters, process roadmap, and competitive advantages.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSections}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/[0.08]">
        {[
          { key: 'hero', label: '1. Hero & Orbiting Circles' },
          { key: 'services_intro', label: '2. 6 Pillars Services Header' },
          { key: 'about', label: '3. Who We Are (About & Stats)' },
          { key: 'why_us', label: '4. Competitive Advantage' },
          { key: 'process', label: '5. 5-Step Methodology' },
          { key: 'final_cta', label: '6. Final Conversion CTA' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveSubTab(tab.key as SectionTab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === tab.key
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md shadow-purple-900/30'
                : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO SECTION & ORBITING LABELS */}
      {activeSubTab === 'hero' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-agency-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agency-border/60 pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Hero Section, Orbiting Icons & Bento Telemetry</span>
              </h3>
              <p className="text-xs text-gray-400">
                Above-the-fold headline, buttons, trust badges, orbiting solar badges, and 3 high-impact bento cards.
              </p>
            </div>
            <button
              type="button"
              disabled={savingKey === 'hero'}
              onClick={handleSaveHero}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-heading shadow-md shadow-purple-900/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'hero' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Hero Section</span>
            </button>
          </div>

          <div className="space-y-5 text-xs">
            {/* Top Pill / Badge */}
            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">
                Top Announcement Pill
              </label>
              <input
                type="text"
                value={heroForm.badge}
                onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">
                Main Headline
              </label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-agency-dark border border-agency-border text-white text-base font-bold focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">
                Hero Subtitle Description
              </label>
              <textarea
                rows={3}
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Dual Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="font-bold text-purple-400 uppercase font-mono">Primary Button</span>
                <div className="space-y-1">
                  <label className="text-gray-400">Button Text</label>
                  <input
                    type="text"
                    value={heroForm.ctaText}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Button Target Link</label>
                  <input
                    type="text"
                    value={heroForm.ctaLink}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="font-bold text-blue-400 uppercase font-mono">Secondary Button</span>
                <div className="space-y-1">
                  <label className="text-gray-400">Button Text</label>
                  <input
                    type="text"
                    value={heroForm.ctaSecondaryText}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Button Target Link</label>
                  <input
                    type="text"
                    value={heroForm.ctaSecondaryLink}
                    onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 3 Trust Badges */}
            <div className="space-y-2 pt-2">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">
                Under-Button Trust Badges
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {heroForm.trustBadges.map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => {
                        const next = [...heroForm.trustBadges];
                        next[idx] = e.target.value;
                        setHeroForm({ ...heroForm, trustBadges: next });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Rotating Orbit Labels (Requested in video!) */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3 pt-4">
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-amber-400" />
                <h4 className="font-heading font-bold text-amber-300 text-xs uppercase tracking-wider">
                  4 Orbiting Circle Labels (Hero Right-Side 3D Animation)
                </h4>
              </div>
              <p className="text-[11px] text-gray-400">
                These correspond to the 4 floating labels rotating in orbit around the glowing sphere.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {heroForm.orbitLabels.map((lbl, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-mono">Orbit Item #{idx + 1}</label>
                    <input
                      type="text"
                      value={lbl}
                      onChange={(e) => {
                        const next = [...heroForm.orbitLabels];
                        next[idx] = e.target.value;
                        setHeroForm({ ...heroForm, orbitLabels: next });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-semibold text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Live Status Pill */}
            <div className="space-y-1.5 pt-2">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">
                Telemetry Deck Live Status Pill
              </label>
              <input
                type="text"
                value={heroForm.livePill}
                onChange={(e) => setHeroForm({ ...heroForm, livePill: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* 3 Bento Cards */}
            <div className="space-y-3 pt-2">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">
                3 Bento Telemetry Metric Cards
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {heroForm.bentoCards.map((card, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                    <span className="text-[10px] font-mono text-purple-300 font-bold uppercase">Card #{idx + 1}</span>
                    <div>
                      <label className="text-[10px] text-gray-400">Eyebrow Tag</label>
                      <input
                        type="text"
                        value={card.eyebrow}
                        onChange={(e) => {
                          const next = [...heroForm.bentoCards];
                          next[idx].eyebrow = e.target.value;
                          setHeroForm({ ...heroForm, bentoCards: next });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400">Hero Metric Value</label>
                      <input
                        type="text"
                        value={card.value}
                        onChange={(e) => {
                          const next = [...heroForm.bentoCards];
                          next[idx].value = e.target.value;
                          setHeroForm({ ...heroForm, bentoCards: next });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-sm font-bold font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400">Metric Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const next = [...heroForm.bentoCards];
                          next[idx].title = e.target.value;
                          setHeroForm({ ...heroForm, bentoCards: next });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400">Description</label>
                      <textarea
                        rows={2}
                        value={card.desc}
                        onChange={(e) => {
                          const next = [...heroForm.bentoCards];
                          next[idx].desc = e.target.value;
                          setHeroForm({ ...heroForm, bentoCards: next });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-[11px] leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES INTRO HEADER */}
      {activeSubTab === 'services_intro' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-agency-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agency-border/60 pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>6 Specialized Pillars Services Section Header</span>
              </h3>
              <p className="text-xs text-gray-400">
                Control the badge, main heading, and intro description text above the 6 service cards.
              </p>
            </div>
            <button
              type="button"
              disabled={savingKey === 'services_intro'}
              onClick={handleSaveServicesIntro}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-heading shadow-md shadow-purple-900/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'services_intro' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Services Header</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Section Badge</label>
              <input
                type="text"
                value={servicesIntroForm.badge}
                onChange={(e) => setServicesIntroForm({ ...servicesIntroForm, badge: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Main Section Heading</label>
              <input
                type="text"
                value={servicesIntroForm.title}
                onChange={(e) => setServicesIntroForm({ ...servicesIntroForm, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-agency-dark border border-agency-border text-white text-base font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Subtitle Paragraph</label>
              <textarea
                rows={3}
                value={servicesIntroForm.subtitle}
                onChange={(e) => setServicesIntroForm({ ...servicesIntroForm, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
              <span className="text-gray-400">Note: To add, edit, or remove individual service cards, use the Core Services manager in the left sidebar.</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ABOUT / WHO WE ARE & WHY WE EXIST */}
      {activeSubTab === 'about' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-agency-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agency-border/60 pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Who We Are & Why We Exist (About & Metrics)</span>
              </h3>
              <p className="text-xs text-gray-400">
                Left column story paragraphs & checklist + Right column 4 operating metrics and NDA banner.
              </p>
            </div>
            <button
              type="button"
              disabled={savingKey === 'about'}
              onClick={handleSaveAbout}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-heading shadow-md shadow-purple-900/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'about' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save About Section</span>
            </button>
          </div>

          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Section Badge</label>
                <input
                  type="text"
                  value={aboutForm.badge}
                  onChange={(e) => setAboutForm({ ...aboutForm, badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Main Heading</label>
                <input
                  type="text"
                  value={aboutForm.title}
                  onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Paragraph 1 (The Industry Problem)</label>
              <textarea
                rows={2}
                value={aboutForm.paragraph1}
                onChange={(e) => setAboutForm({ ...aboutForm, paragraph1: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Paragraph 2 (The Scalemint Solution)</label>
              <textarea
                rows={3}
                value={aboutForm.paragraph2}
                onChange={(e) => setAboutForm({ ...aboutForm, paragraph2: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed"
              />
            </div>

            {/* 4 Credibility Checklist */}
            <div className="space-y-2 pt-2">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">4 Credibility Checklist Bullets</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aboutForm.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const next = [...aboutForm.checklist];
                        next[idx] = e.target.value;
                        setAboutForm({ ...aboutForm, checklist: next });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Operating Standards & 4 Metrics */}
            <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-mono text-[10px]">Standards Card Eyebrow</label>
                  <input
                    type="text"
                    value={aboutForm.standardsBadge}
                    onChange={(e) => setAboutForm({ ...aboutForm, standardsBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-mono text-[10px]">Standards Card Heading</label>
                  <input
                    type="text"
                    value={aboutForm.standardsTitle}
                    onChange={(e) => setAboutForm({ ...aboutForm, standardsTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs font-bold"
                  />
                </div>
              </div>

              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider block">4 Operating Metrics Grid</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutForm.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-purple-400 font-bold">Metric #{idx + 1} Value:</span>
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) => {
                          const next = [...aboutForm.metrics];
                          next[idx].value = e.target.value;
                          setAboutForm({ ...aboutForm, metrics: next });
                        }}
                        className="px-3 py-1 rounded-lg bg-black border border-white/10 text-white font-mono font-bold text-sm w-28"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={m.desc}
                        onChange={(e) => {
                          const next = [...aboutForm.metrics];
                          next[idx].desc = e.target.value;
                          setAboutForm({ ...aboutForm, metrics: next });
                        }}
                        placeholder="Description..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-gray-300 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-gray-400 font-mono text-[10px]">Strict NDA Guarantee Notice Text</label>
                <input
                  type="text"
                  value={aboutForm.ndaText}
                  onChange={(e) => setAboutForm({ ...aboutForm, ndaText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WHY CHOOSE US (COMPETITIVE ADVANTAGE) */}
      {activeSubTab === 'why_us' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-agency-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agency-border/60 pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Competitive Advantage (Why Forward-Thinking Brands Partner)</span>
              </h3>
              <p className="text-xs text-gray-400">
                Badge, section heading, subtitle, and the 4 value proposition pillar cards.
              </p>
            </div>
            <button
              type="button"
              disabled={savingKey === 'why_choose_us'}
              onClick={handleSaveWhyUs}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-heading shadow-md shadow-purple-900/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'why_choose_us' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Why Us Section</span>
            </button>
          </div>

          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Badge Text</label>
                <input
                  type="text"
                  value={whyUsForm.badge}
                  onChange={(e) => setWhyUsForm({ ...whyUsForm, badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Section Heading</label>
                <input
                  type="text"
                  value={whyUsForm.title}
                  onChange={(e) => setWhyUsForm({ ...whyUsForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Subtitle Text</label>
              <textarea
                rows={2}
                value={whyUsForm.subtitle}
                onChange={(e) => setWhyUsForm({ ...whyUsForm, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed"
              />
            </div>

            <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider block pt-2">
              4 Value Proposition Pillar Cards
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whyUsForm.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">Card #{idx + 1}</span>
                  <div>
                    <label className="text-[10px] text-gray-400">Card Title</label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const next = [...whyUsForm.features];
                        next[idx].title = e.target.value;
                        setWhyUsForm({ ...whyUsForm, features: next });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-semibold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400">Description</label>
                    <textarea
                      rows={2}
                      value={feat.desc}
                      onChange={(e) => {
                        const next = [...whyUsForm.features];
                        next[idx].desc = e.target.value;
                        setWhyUsForm({ ...whyUsForm, features: next });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-gray-300 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 5-STEP PROCESS (METHODOLOGY) */}
      {activeSubTab === 'process' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-agency-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agency-border/60 pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>5-Step Battle-Tested Methodology Roadmap</span>
              </h3>
              <p className="text-xs text-gray-400">
                Control the badge, title, subtitle, and all 5 step phases from discovery to scale.
              </p>
            </div>
            <button
              type="button"
              disabled={savingKey === 'process'}
              onClick={handleSaveProcess}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-heading shadow-md shadow-blue-900/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'process' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Process Roadmap</span>
            </button>
          </div>

          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Badge Text</label>
                <input
                  type="text"
                  value={processForm.badge}
                  onChange={(e) => setProcessForm({ ...processForm, badge: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Roadmap Heading</label>
                <input
                  type="text"
                  value={processForm.title}
                  onChange={(e) => setProcessForm({ ...processForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">Subtitle</label>
              <textarea
                rows={2}
                value={processForm.subtitle}
                onChange={(e) => setProcessForm({ ...processForm, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed"
              />
            </div>

            <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider block pt-2">
              All 5 Sequential Roadmap Steps
            </label>
            <div className="space-y-3">
              {processForm.steps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-black text-lg flex items-center justify-center shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const next = [...processForm.steps];
                        next[idx].title = e.target.value;
                        setProcessForm({ ...processForm, steps: next });
                      }}
                      placeholder="Step Title..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-semibold text-xs"
                    />
                    <textarea
                      rows={2}
                      value={step.desc}
                      onChange={(e) => {
                        const next = [...processForm.steps];
                        next[idx].desc = e.target.value;
                        setProcessForm({ ...processForm, steps: next });
                      }}
                      placeholder="Step Description..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-gray-300 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FINAL CONVERSION CTA */}
      {activeSubTab === 'final_cta' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-agency-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-agency-border/60 pb-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <span>Final Conversion & Lead Capture CTA Banner</span>
              </h3>
              <p className="text-xs text-gray-400">
                Bottom of the homepage call-to-action banner, direct consultation link, and WhatsApp button.
              </p>
            </div>
            <button
              type="button"
              disabled={savingKey === 'final_cta'}
              onClick={handleSaveFinalCta}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-heading shadow-md shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {savingKey === 'final_cta' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Final CTA</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">CTA Banner Headline</label>
              <input
                type="text"
                value={finalCtaForm.title}
                onChange={(e) => setFinalCtaForm({ ...finalCtaForm, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-agency-dark border border-agency-border text-white text-sm font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold uppercase font-mono tracking-wider">CTA Subtitle</label>
              <textarea
                rows={2}
                value={finalCtaForm.subtitle}
                onChange={(e) => setFinalCtaForm({ ...finalCtaForm, subtitle: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="font-bold text-emerald-400 uppercase font-mono">Primary Action</span>
                <div className="space-y-1">
                  <label className="text-gray-400">Button Text</label>
                  <input
                    type="text"
                    value={finalCtaForm.ctaText}
                    onChange={(e) => setFinalCtaForm({ ...finalCtaForm, ctaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Target Link</label>
                  <input
                    type="text"
                    value={finalCtaForm.ctaLink}
                    onChange={(e) => setFinalCtaForm({ ...finalCtaForm, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <span className="font-bold text-blue-400 uppercase font-mono">Secondary Action (WhatsApp)</span>
                <div className="space-y-1">
                  <label className="text-gray-400">Button Text</label>
                  <input
                    type="text"
                    value={finalCtaForm.ctaSecondaryText}
                    onChange={(e) => setFinalCtaForm({ ...finalCtaForm, ctaSecondaryText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Target Link</label>
                  <input
                    type="text"
                    value={finalCtaForm.ctaSecondaryLink}
                    onChange={(e) => setFinalCtaForm({ ...finalCtaForm, ctaSecondaryLink: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
