'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  RotateCw,
  Scale,
  GitCommit,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ServicePagesCMSProps {
  showNotification: (msg: string, isErr?: boolean) => void;
}

interface ServiceTab {
  slug: string;
  name: string;
  shortDesc: string;
}

const SERVICES_LIST: ServiceTab[] = [
  { slug: 'branding-design', name: 'Branding & Identity', shortDesc: 'Visual systems & brand positioning' },
  { slug: 'website-design', name: 'Web Design & Code', shortDesc: 'Next.js 15 conversion-focused web apps' },
  { slug: 'video-editing', name: 'Video Production', shortDesc: 'Short-form & high-retention commercial cuts' },
  { slug: 'ai-ugc-ads', name: 'AI UGC Ads', shortDesc: 'Viral hyper-realistic AI creator assets' },
  { slug: 'digital-marketing', name: 'Digital Marketing', shortDesc: 'Multi-channel acquisition & funnel scaling' },
  { slug: 'google-ads', name: 'Google Ads & SEM', shortDesc: 'High-intent search & remarketing campaigns' },
];

export default function ServicePagesCMS({ showNotification }: ServicePagesCMSProps) {
  const [selectedService, setSelectedService] = useState<string>('branding-design');
  const [activeSubSection, setActiveSubSection] = useState<'comparison' | 'process' | 'hero'>('comparison');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Comparison State
  const [comparisonForm, setComparisonForm] = useState({
    badge: 'Direct Value Comparison',
    title: 'Traditional Agencies vs Scalemint Dedicated Squad',
    subtitle: 'Why high-growth ventures replace bloated agency retainers with our streamlined execution model.',
    items: [
      { feature: 'Squad Composition', traditional: 'Account managers & junior interns', scalemint: 'Direct access to senior principals & specialists' },
      { feature: 'Turnaround Time', traditional: 'Weeks of bureaucracy & delay', scalemint: 'Rapid 1-3 week fixed sprint delivery' },
      { feature: 'Pricing Transparency', traditional: 'Hidden billable hours & vague overages', scalemint: '100% fixed transparent sprint milestones' },
      { feature: 'Source Code & IP', traditional: 'Withheld or held hostage behind contracts', scalemint: 'Full 100% intellectual property transfer on day 1' },
      { feature: 'Revisions & Iterations', traditional: 'Nickel-and-dimed change orders', scalemint: 'Collaborative agile revisions until launch' },
    ],
  });

  // Process / Roadmap State
  const [processForm, setProcessForm] = useState({
    badge: 'Our Execution Methodology',
    title: 'How We Execute Your High-Impact Sprint',
    subtitle: 'A battle-tested four-phase sprint roadmap engineered for velocity, transparency, and flawless delivery.',
    steps: [
      {
        step: '01',
        phase: 'Sprint 01',
        time: 'Days 1–3',
        title: 'Strategic Immersion & Direction Alignment',
        desc: 'Deep discovery into your market positioning, target audience conversion psychology, and project benchmarks.',
        bullets: ['Stakeholder alignment call', 'Competitor visual audit', 'Sprint milestones established'],
      },
      {
        step: '02',
        phase: 'Sprint 02',
        time: 'Days 4–7',
        title: 'Wireframing & Core Creative Architecture',
        desc: 'Rapid exploratory design concepts, structural mockups, and high-fidelity prototypes for feedback.',
        bullets: ['Interactive prototypes', 'Directional review session', 'Sprint refinement loop'],
      },
      {
        step: '03',
        phase: 'Sprint 03',
        time: 'Days 8–12',
        title: 'Production, Coding & Rigorous Testing',
        desc: 'Precision implementation, responsive testing, and performance optimization for extreme conversion speed.',
        bullets: ['Production-grade build', 'Cross-browser QA testing', 'Speed and SEO validation'],
      },
      {
        step: '04',
        phase: 'Sprint 04',
        time: 'Days 13–14',
        title: 'Deployment & Full Asset Handover',
        desc: 'Seamless live launch, domain routing, asset packaging, and 100% source code / Figma handover.',
        bullets: ['Public launch sign-off', '100% IP transfer', 'Post-launch monitoring'],
      },
    ],
  });

  // Hero State
  const [heroForm, setHeroForm] = useState({
    badge: 'High-Velocity Dedicated Sprint',
    title: '',
    subtitle: '',
    startingPrice: '2,500',
    livePill: 'Select Q2/Q3 Production Slots Active · Direct Senior Squad Access',
    trustBadges: [
      '100% Source Code & IP Ownership',
      'Sprint Delivery Timelines',
      'Strict Non-Disclosure Guarantee',
    ],
  });

  // Load sections for the selected service
  const loadServiceSections = async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sections');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const serviceSections = data.data.filter((s: any) => s.page === slug);
        
        // Comparison
        const comp = serviceSections.find((s: any) => s.sectionKey === 'comparison');
        if (comp && comp.content) {
          const c = typeof comp.content === 'string' ? JSON.parse(comp.content) : comp.content;
          setComparisonForm({
            badge: c.badge || 'Direct Value Comparison',
            title: c.title || 'Traditional Agencies vs Scalemint Dedicated Squad',
            subtitle: c.subtitle || 'Why high-growth ventures replace bloated agency retainers with our streamlined execution model.',
            items: Array.isArray(c.items) && c.items.length > 0 ? c.items : comparisonForm.items,
          });
        }

        // Process
        const proc = serviceSections.find((s: any) => s.sectionKey === 'process');
        if (proc && proc.content) {
          const p = typeof proc.content === 'string' ? JSON.parse(proc.content) : proc.content;
          setProcessForm({
            badge: p.badge || 'Our Execution Methodology',
            title: p.title || 'How We Execute Your High-Impact Sprint',
            subtitle: p.subtitle || 'A battle-tested four-phase sprint roadmap engineered for velocity, transparency, and flawless delivery.',
            steps: Array.isArray(p.steps) && p.steps.length > 0 ? p.steps : processForm.steps,
          });
        }

        // Hero
        const hero = serviceSections.find((s: any) => s.sectionKey === 'hero');
        if (hero && hero.content) {
          const h = typeof hero.content === 'string' ? JSON.parse(hero.content) : hero.content;
          setHeroForm({
            badge: h.badge || 'High-Velocity Dedicated Sprint',
            title: h.title || '',
            subtitle: h.subtitle || '',
            startingPrice: h.startingPrice || '2,500',
            livePill: h.livePill || 'Select Q2/Q3 Production Slots Active · Direct Senior Squad Access',
            trustBadges: Array.isArray(h.trustBadges) && h.trustBadges.length > 0 ? h.trustBadges : heroForm.trustBadges,
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to load service sections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceSections(selectedService);
  }, [selectedService]);

  // Save helper
  const saveSection = async (sectionKey: string, content: any) => {
    setSavingKey(sectionKey);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: selectedService,
          sectionKey,
          content,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(`Saved "${sectionKey}" for ${selectedService} successfully!`);
        await loadServiceSections(selectedService);
      } else {
        showNotification(data.error || 'Failed to save section', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving section', true);
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveComparison = () => saveSection('comparison', comparisonForm);
  const handleSaveProcess = () => saveSection('process', processForm);
  const handleSaveHero = () => saveSection('hero', heroForm);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Service Pages Isolated CMS</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Service Detail Pages CMS
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Independently manage the <strong>Comparison Matrix</strong>, <strong>4-Stage Sprint Roadmap</strong>, and <strong>Hero Copy</strong> for each of your 6 core disciplines.
          </p>
        </div>

        <button
          onClick={() => loadServiceSections(selectedService)}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-agency-surface border border-agency-border text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Content</span>
        </button>
      </div>

      {/* Service Selector Tabs (6 Disciplines) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {SERVICES_LIST.map((srv) => {
          const isSelected = selectedService === srv.slug;
          return (
            <button
              key={srv.slug}
              onClick={() => setSelectedService(srv.slug)}
              className={`p-3 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                  : 'bg-agency-surface/60 border-white/[0.06] text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              <span className={`text-[11px] font-mono font-bold block ${isSelected ? 'text-purple-300' : 'text-gray-500'}`}>
                {srv.slug}
              </span>
              <span className="font-heading font-bold text-xs text-white block mt-0.5 truncate">
                {srv.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section Sub-Tabs (Comparison Matrix vs Sprint Roadmap vs Hero) */}
      <div className="flex items-center gap-2 border-b border-agency-border/80 pb-3">
        <button
          onClick={() => setActiveSubSection('comparison')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubSection === 'comparison'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-agency-card'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Agency Comparison Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubSection('process')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubSection === 'process'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-agency-card'
          }`}
        >
          <GitCommit className="w-3.5 h-3.5" />
          <span>How We Execute Sprint (Roadmap)</span>
        </button>

        <button
          onClick={() => setActiveSubSection('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubSection === 'hero'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-agency-card'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hero Copy & Starting Price</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
          <span className="text-xs text-gray-400 font-mono">Loading service CMS data...</span>
        </div>
      ) : (
        <>
          {/* 1. COMPARISON MATRIX TAB */}
          {activeSubSection === 'comparison' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-agency-surface/80 border border-agency-border">
                <div>
                  <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                    <Scale className="w-4 h-4 text-purple-400" />
                    <span>Traditional Agencies vs Scalemint Matrix</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Live at <code className="text-purple-300">/services/{selectedService}</code> — highlight your unfair advantage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveComparison}
                  disabled={savingKey === 'comparison'}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all shrink-0"
                >
                  {savingKey === 'comparison' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Comparison Matrix</span>
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="glass-card rounded-2xl p-6 border border-agency-border space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Badge Text</label>
                    <input
                      type="text"
                      value={comparisonForm.badge}
                      onChange={(e) => setComparisonForm({ ...comparisonForm, badge: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Section Heading</label>
                    <input
                      type="text"
                      value={comparisonForm.title}
                      onChange={(e) => setComparisonForm({ ...comparisonForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium">Subtitle / Manifesto</label>
                  <textarea
                    rows={2}
                    value={comparisonForm.subtitle}
                    onChange={(e) => setComparisonForm({ ...comparisonForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* Comparison Rows */}
              <div className="glass-card rounded-2xl p-6 border border-agency-border space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white">Comparison Rows ({comparisonForm.items.length})</h3>
                    <p className="text-[11px] text-gray-400">Add or edit points comparing traditional agency retainers against your dedicated squad.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setComparisonForm({
                        ...comparisonForm,
                        items: [
                          ...comparisonForm.items,
                          { feature: 'New Metric', traditional: 'Slow traditional approach', scalemint: 'Scalemint fast transparent standard' },
                        ],
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-white flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-purple-400" />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {comparisonForm.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-agency-dark/90 border border-agency-border grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                    >
                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[10px] font-mono uppercase text-gray-400">Evaluation Dimension</label>
                        <input
                          type="text"
                          value={item.feature}
                          onChange={(e) => {
                            const newItems = [...comparisonForm.items];
                            newItems[idx].feature = e.target.value;
                            setComparisonForm({ ...comparisonForm, items: newItems });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-agency-surface border border-agency-border text-xs text-white font-bold focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="md:col-span-4 space-y-1">
                        <label className="text-[10px] font-mono uppercase text-red-400">Traditional Agency</label>
                        <input
                          type="text"
                          value={item.traditional}
                          onChange={(e) => {
                            const newItems = [...comparisonForm.items];
                            newItems[idx].traditional = e.target.value;
                            setComparisonForm({ ...comparisonForm, items: newItems });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-agency-surface border border-red-500/20 text-xs text-gray-300 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div className="md:col-span-4 space-y-1">
                        <label className="text-[10px] font-mono uppercase text-emerald-400">Scalemint Squad</label>
                        <input
                          type="text"
                          value={item.scalemint}
                          onChange={(e) => {
                            const newItems = [...comparisonForm.items];
                            newItems[idx].scalemint = e.target.value;
                            setComparisonForm({ ...comparisonForm, items: newItems });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-agency-surface border border-emerald-500/30 text-xs text-emerald-200 font-medium focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="md:col-span-1 flex justify-end pt-3 md:pt-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (comparisonForm.items.length <= 1) return;
                            const newItems = comparisonForm.items.filter((_, i) => i !== idx);
                            setComparisonForm({ ...comparisonForm, items: newItems });
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-agency-card transition-colors"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. SPRINT EXECUTION ROADMAP TAB */}
          {activeSubSection === 'process' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-agency-surface/80 border border-agency-border">
                <div>
                  <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-purple-400" />
                    <span>How We Execute Your Sprint (4-Stage Roadmap)</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Displayed on <code className="text-purple-300">/services/{selectedService}</code> — shows high-velocity milestone transparency.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProcess}
                  disabled={savingKey === 'process'}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all shrink-0"
                >
                  {savingKey === 'process' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Sprint Roadmap</span>
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="glass-card rounded-2xl p-6 border border-agency-border space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Badge Text</label>
                    <input
                      type="text"
                      value={processForm.badge}
                      onChange={(e) => setProcessForm({ ...processForm, badge: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Section Heading</label>
                    <input
                      type="text"
                      value={processForm.title}
                      onChange={(e) => setProcessForm({ ...processForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium">Subtitle / Overview</label>
                  <textarea
                    rows={2}
                    value={processForm.subtitle}
                    onChange={(e) => setProcessForm({ ...processForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* Steps (Phases) */}
              <div className="space-y-4">
                {processForm.steps.map((step, sIdx) => (
                  <div key={sIdx} className="glass-card rounded-2xl p-6 border border-agency-border space-y-4">
                    <div className="flex items-center justify-between border-b border-agency-border pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">
                          Phase {step.step || `0${sIdx + 1}`}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {step.phase}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={step.time}
                          placeholder="e.g. Days 1–3"
                          onChange={(e) => {
                            const newSteps = [...processForm.steps];
                            newSteps[sIdx].time = e.target.value;
                            setProcessForm({ ...processForm, steps: newSteps });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-agency-dark border border-agency-border text-[11px] font-mono text-purple-300 focus:outline-none focus:border-purple-500 w-28 text-center"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-medium">Phase Title</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const newSteps = [...processForm.steps];
                            newSteps[sIdx].title = e.target.value;
                            setProcessForm({ ...processForm, steps: newSteps });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white font-bold focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-300 font-medium">Phase Description</label>
                        <textarea
                          rows={2}
                          value={step.desc}
                          onChange={(e) => {
                            const newSteps = [...processForm.steps];
                            newSteps[sIdx].desc = e.target.value;
                            setProcessForm({ ...processForm, steps: newSteps });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-gray-300 focus:outline-none focus:border-purple-500 leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono uppercase text-gray-400 block">
                        Deliverable Checkpoints (Comma-separated or individual items)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(step.bullets) ? step.bullets.join(', ') : ''}
                        onChange={(e) => {
                          const newSteps = [...processForm.steps];
                          newSteps[sIdx].bullets = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                          setProcessForm({ ...processForm, steps: newSteps });
                        }}
                        placeholder="Checkpoint 1, Checkpoint 2, Checkpoint 3"
                        className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. HERO COPY TAB */}
          {activeSubSection === 'hero' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-agency-surface/80 border border-agency-border">
                <div>
                  <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Hero Copy & Starting Price</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Customize the top hero banner, trust pill, and entry-level investment tier for <code className="text-purple-300">{selectedService}</code>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveHero}
                  disabled={savingKey === 'hero'}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all shrink-0"
                >
                  {savingKey === 'hero' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Hero Section</span>
                </button>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-agency-border space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Hero Badge</label>
                    <input
                      type="text"
                      value={heroForm.badge}
                      onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                      placeholder="e.g. HIGH-VELOCITY DEDICATED SPRINT"
                      className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Starting Investment ($ USD)</label>
                    <input
                      type="text"
                      value={heroForm.startingPrice}
                      onChange={(e) => setHeroForm({ ...heroForm, startingPrice: e.target.value })}
                      placeholder="2,500"
                      className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Live Production Pill</label>
                    <input
                      type="text"
                      value={heroForm.livePill}
                      onChange={(e) => setHeroForm({ ...heroForm, livePill: e.target.value })}
                      placeholder="e.g. Select Q2/Q3 Production Slots Active"
                      className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium">Custom Hero Title (Leave blank to use default)</label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    placeholder="e.g. World-Class Brand Systems Engineered to Convert"
                    className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium">Custom Hero Subtitle (Leave blank to use default)</label>
                  <textarea
                    rows={2}
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    placeholder="Leave blank to use the default service description..."
                    className="w-full px-3.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-gray-300 focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
