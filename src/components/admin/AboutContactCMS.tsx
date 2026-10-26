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
  Building2,
  PhoneCall,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AboutContactCMSProps {
  showNotification: (msg: string, isErr?: boolean) => void;
}

export default function AboutContactCMS({ showNotification }: AboutContactCMSProps) {
  const [activePage, setActivePage] = useState<'about' | 'contact'>('about');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // About State
  const [aboutHero, setAboutHero] = useState({
    badge: '360° CREATIVE & GROWTH ENGINE',
    title: 'Engineered for Radical Momentum. Obsessed with Flawless Craft.',
    subtitle: 'We exist because high-growth brands are tired of fragmented agencies that pass the buck. We unite strategic brand design, high-performance web development, viral video production, and performance marketing into a single high-velocity squad.',
    stats: [
      { value: '360°', label: 'Full Spectrum', sub: 'Brand + Web + Ads' },
      { value: '99+', label: 'Net Promoter', sub: 'Client Satisfaction' },
      { value: '100%', label: 'IP Ownership', sub: 'Transferred to You' },
      { value: '6 Wks', label: 'Average Sprint', sub: 'Kickoff to Live' },
    ],
  });

  const [aboutThesis, setAboutThesis] = useState({
    badge: 'THE SCALEMINT THESIS',
    title: 'The Agency Model is Broken. We Built the Antidote.',
    desc: 'Traditional agencies sell you on their senior partners, then hand your account to junior interns who have never run a business. They bill you for hours, not outcomes. They move at the speed of bureaucracy.',
    nonNegotiablesTitle: 'Our Studio Non-Negotiables',
    nonNegotiables: [
      { title: 'Zero B.S. Transparency', desc: 'No smoke and mirrors. You get real-time access to our production dashboards and honest, unvarnished performance data.' },
      { title: 'Speed As a Competitive Advantage', desc: 'We operate in high-velocity sprints. What traditional agencies take 6 months to deliberate, we deploy, test, and optimize in weeks.' },
      { title: 'Extreme Craft Obsession', desc: 'Every pixel, line of code, and frame of video is scrutinized. We do not ship "good enough" — we ship work that commands category authority.' },
    ],
  });

  const [aboutProcess, setAboutProcess] = useState({
    badge: 'OUR 5-STAGE SPRINT ENGINE',
    title: 'How We Move From Zero to Velocity',
    subtitle: 'A battle-tested operational framework refined across 100+ high-growth engagements. No fluff, no endless committee meetings — just precision execution.',
    steps: [
      { step: '01', phase: 'Immersion & Strategy Blueprint', title: 'Strategic Discovery & Architecture', desc: 'We deconstruct your market positioning, conversion psychology, and unit economics before touching Figma or writing code.', deliverables: ['Positioning Matrix', 'Sprint Roadmap', 'Conversion Blueprints'] },
      { step: '02', phase: 'Design & Visual Systems', title: 'High-Fidelity Creative Architecture', desc: 'We build stunning, bespoke visual systems that position your brand as the undisputed premium leader in your category.', deliverables: ['Component Design Systems', 'Interactive Prototypes', 'Production Assets'] },
      { step: '03', phase: 'Engineering & Production', title: 'Next-Gen Full-Stack Execution', desc: 'Clean, performant Next.js 15 architectures, GSAP micro-animations, and viral video assets engineered for speed and conversion.', deliverables: ['Clean Source Code', '4K Video Cuts', 'Conversion Tracking'] },
      { step: '04', phase: 'Rigorous QA & Testing', title: 'Cross-Platform Quality Assurance', desc: 'Every screen size, browser, and network condition is stress-tested. 95+ Google PageSpeed benchmarks guaranteed.', deliverables: ['Lighthouse Audits', 'Responsive Validation', 'Security Hardening'] },
      { step: '05', phase: 'Launch & Growth Handoff', title: 'Live Deployment & Asset Transfer', desc: 'Zero-downtime DNS routing, comprehensive team onboarding, and 100% intellectual property transfer to your organization.', deliverables: ['100% Source Handover', 'Admin Training Session', '30-Day Hypercare'] },
    ],
  });

  // Contact State
  const [contactHero, setContactHero] = useState({
    badge: 'DIRECT SENIOR PARTNER INQUIRY · ZERO RED TAPE',
    title: 'Let’s Build Something Exceptional Together.',
    subtitle: 'Connect directly with our leadership. We review your growth objectives, define your sprint scope, and provide a fixed-price roadmap within 24 hours.',
  });

  const [contactGuarantees, setContactGuarantees] = useState({
    items: [
      { title: '24-Hour Proposal Commitment', desc: 'No endless intake queues. A Senior Principal reviews your roadmap and provides a clear milestone scope within 1 business day.' },
      { title: 'Standard Enterprise NDA', desc: 'All communications, proprietary codebase specs, and commercial strategies are strictly confidential under mutual NDA.' },
      { title: '100% IP & Source Ownership', desc: 'You retain complete ownership of all Figma designs, Next.js code, vector assets, and media buy accounts from kickoff.' },
    ],
  });

  // Load Sections
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sections');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // About Hero
        const abHero = data.data.find((s: any) => s.page === 'about' && s.sectionKey === 'hero');
        if (abHero) {
          let c: any = {};
          if (abHero.content) {
            try {
              c = typeof abHero.content === 'string' ? JSON.parse(abHero.content) : abHero.content;
            } catch {
              c = {};
            }
          }
          let m: any = {};
          if (abHero.metadata) {
            try {
              m = typeof abHero.metadata === 'string' ? JSON.parse(abHero.metadata) : abHero.metadata;
            } catch {
              m = {};
            }
          }
          setAboutHero({
            badge: m.badge || c.badge || aboutHero.badge,
            title: abHero.title || c.title || aboutHero.title,
            subtitle: abHero.subtitle || c.subtitle || aboutHero.subtitle,
            stats: Array.isArray(m.stats) && m.stats.length > 0 ? m.stats : Array.isArray(c.stats) && c.stats.length > 0 ? c.stats : aboutHero.stats,
          });
        }

        // About Thesis
        const abThesis = data.data.find((s: any) => s.page === 'about' && s.sectionKey === 'thesis');
        if (abThesis) {
          let c: any = {};
          if (abThesis.content) {
            try {
              c = typeof abThesis.content === 'string' ? JSON.parse(abThesis.content) : abThesis.content;
            } catch {
              c = { desc: abThesis.content };
            }
          }
          let m: any = {};
          if (abThesis.metadata) {
            try {
              m = typeof abThesis.metadata === 'string' ? JSON.parse(abThesis.metadata) : abThesis.metadata;
            } catch {
              m = {};
            }
          }
          setAboutThesis({
            badge: m.badge || c.badge || aboutThesis.badge,
            title: abThesis.title || c.title || aboutThesis.title,
            desc: abThesis.subtitle || c.desc || (typeof abThesis.content === 'string' ? abThesis.content : '') || aboutThesis.desc,
            nonNegotiablesTitle: m.nonNegotiablesTitle || c.nonNegotiablesTitle || aboutThesis.nonNegotiablesTitle,
            nonNegotiables: Array.isArray(m.nonNegotiables) && m.nonNegotiables.length > 0 ? m.nonNegotiables : Array.isArray(c.nonNegotiables) && c.nonNegotiables.length > 0 ? c.nonNegotiables : aboutThesis.nonNegotiables,
          });
        }

        // About Process
        const abProcess = data.data.find((s: any) => s.page === 'about' && s.sectionKey === 'process');
        if (abProcess) {
          let c: any = {};
          if (abProcess.content) {
            try {
              c = typeof abProcess.content === 'string' ? JSON.parse(abProcess.content) : abProcess.content;
            } catch {
              c = {};
            }
          }
          let m: any = {};
          if (abProcess.metadata) {
            try {
              m = typeof abProcess.metadata === 'string' ? JSON.parse(abProcess.metadata) : abProcess.metadata;
            } catch {
              m = {};
            }
          }
          setAboutProcess({
            badge: m.badge || c.badge || aboutProcess.badge,
            title: abProcess.title || c.title || aboutProcess.title,
            subtitle: abProcess.subtitle || c.subtitle || aboutProcess.subtitle,
            steps: Array.isArray(m.steps) && m.steps.length > 0 ? m.steps : Array.isArray(c.steps) && c.steps.length > 0 ? c.steps : aboutProcess.steps,
          });
        }

        // Contact Hero
        const ctHero = data.data.find((s: any) => s.page === 'contact' && s.sectionKey === 'hero');
        if (ctHero) {
          let c: any = {};
          if (ctHero.content) {
            try {
              c = typeof ctHero.content === 'string' ? JSON.parse(ctHero.content) : ctHero.content;
            } catch {
              c = {};
            }
          }
          let m: any = {};
          if (ctHero.metadata) {
            try {
              m = typeof ctHero.metadata === 'string' ? JSON.parse(ctHero.metadata) : ctHero.metadata;
            } catch {
              m = {};
            }
          }
          setContactHero({
            badge: m.badge || c.badge || contactHero.badge,
            title: ctHero.title || c.title || contactHero.title,
            subtitle: ctHero.subtitle || c.subtitle || contactHero.subtitle,
          });
        }

        // Contact Guarantees
        const ctGuar = data.data.find((s: any) => s.page === 'contact' && s.sectionKey === 'guarantees');
        if (ctGuar) {
          let c: any = {};
          if (ctGuar.content) {
            try {
              c = typeof ctGuar.content === 'string' ? JSON.parse(ctGuar.content) : ctGuar.content;
            } catch {
              c = {};
            }
          }
          let m: any = {};
          if (ctGuar.metadata) {
            try {
              m = typeof ctGuar.metadata === 'string' ? JSON.parse(ctGuar.metadata) : ctGuar.metadata;
            } catch {
              m = {};
            }
          }
          setContactGuarantees({
            items: Array.isArray(m.items) && m.items.length > 0 ? m.items : Array.isArray(c.items) && c.items.length > 0 ? c.items : contactGuarantees.items,
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveSection = async (page: string, sectionKey: string, payload: any) => {
    setSavingKey(`${page}_${sectionKey}`);
    try {
      let body: any = { page, sectionKey };
      if (page === 'about' && sectionKey === 'hero') {
        body.title = payload.title;
        body.subtitle = payload.subtitle;
        body.metadata = {
          badge: payload.badge,
          stats: payload.stats,
        };
      } else if (page === 'about' && sectionKey === 'thesis') {
        body.title = payload.title;
        body.subtitle = payload.desc;
        body.content = payload.desc;
        body.metadata = {
          badge: payload.badge,
          nonNegotiablesTitle: payload.nonNegotiablesTitle,
          nonNegotiables: payload.nonNegotiables,
        };
      } else if (page === 'about' && sectionKey === 'process') {
        body.title = payload.title;
        body.subtitle = payload.subtitle;
        body.metadata = {
          badge: payload.badge,
          steps: payload.steps,
        };
      } else if (page === 'contact' && sectionKey === 'hero') {
        body.title = payload.title;
        body.subtitle = payload.subtitle;
        body.metadata = { badge: payload.badge };
      } else if (page === 'contact' && sectionKey === 'guarantees') {
        body.metadata = { items: payload.items };
      } else {
        body.content = payload;
      }

      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Saved ${page} ${sectionKey} section!`);
        await loadData();
      } else {
        showNotification(data.error || 'Failed to save', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving', true);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Dedicated Page CMS</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            About Us & Contact Page Sections
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Direct control over the About Page manifesto, 4 key metrics, studio non-negotiables, and Contact Page guarantees.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-agency-surface border border-agency-border text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActivePage('about')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activePage === 'about'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-agency-surface/80 text-gray-400 hover:text-white border border-agency-border'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>About Page CMS</span>
        </button>

        <button
          onClick={() => setActivePage('contact')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activePage === 'contact'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-agency-surface/80 text-gray-400 hover:text-white border border-agency-border'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Contact Page CMS</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
          <span className="text-xs text-gray-400 font-mono">Loading CMS content...</span>
        </div>
      ) : (
        <>
          {activePage === 'about' && (
            <div className="space-y-8">
              {/* 1. About Hero & Stats */}
              <div className="glass-card rounded-2xl p-6 border border-agency-border space-y-6">
                <div className="flex items-center justify-between border-b border-agency-border pb-4">
                  <div>
                    <h2 className="font-heading font-bold text-sm text-white">About Hero & Key Stats (360°, 99+, 100%, 6 Wks)</h2>
                    <p className="text-[11px] text-gray-400">Manage headline and quantitative proof pills.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveSection('about', 'hero', aboutHero)}
                    disabled={savingKey === 'about_hero'}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                  >
                    {savingKey === 'about_hero' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save About Hero</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Badge</label>
                    <input
                      type="text"
                      value={aboutHero.badge}
                      onChange={(e) => setAboutHero({ ...aboutHero, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Headline Title</label>
                    <input
                      type="text"
                      value={aboutHero.title}
                      onChange={(e) => setAboutHero({ ...aboutHero, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium">Intro Subtitle</label>
                  <textarea
                    rows={2}
                    value={aboutHero.subtitle}
                    onChange={(e) => setAboutHero({ ...aboutHero, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-gray-300 focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>

                {/* 4 Stats Cards */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-mono uppercase text-gray-400 block font-bold">4 Strategic Metrics</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {aboutHero.stats.map((stat, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-agency-dark border border-agency-border space-y-2">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...aboutHero.stats];
                            newStats[idx].value = e.target.value;
                            setAboutHero({ ...aboutHero, stats: newStats });
                          }}
                          className="w-full px-2 py-1 rounded bg-agency-surface border border-purple-500/30 text-base font-black text-purple-400 text-center focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...aboutHero.stats];
                            newStats[idx].label = e.target.value;
                            setAboutHero({ ...aboutHero, stats: newStats });
                          }}
                          className="w-full px-2 py-1 rounded bg-agency-surface border border-agency-border text-[11px] text-white font-bold text-center focus:outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={stat.sub}
                          onChange={(e) => {
                            const newStats = [...aboutHero.stats];
                            newStats[idx].sub = e.target.value;
                            setAboutHero({ ...aboutHero, stats: newStats });
                          }}
                          className="w-full px-2 py-1 rounded bg-agency-surface border border-agency-border text-[10px] text-gray-400 text-center focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Studio Thesis & Non-Negotiables */}
              <div className="glass-card rounded-2xl p-6 border border-agency-border space-y-6">
                <div className="flex items-center justify-between border-b border-agency-border pb-4">
                  <div>
                    <h2 className="font-heading font-bold text-sm text-white">Studio Thesis & 3 Non-Negotiables</h2>
                    <p className="text-[11px] text-gray-400">Positioning manifesto explaining why Scalemint exists.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveSection('about', 'thesis', aboutThesis)}
                    disabled={savingKey === 'about_thesis'}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                  >
                    {savingKey === 'about_thesis' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Thesis Section</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Badge</label>
                    <input
                      type="text"
                      value={aboutThesis.badge}
                      onChange={(e) => setAboutThesis({ ...aboutThesis, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Thesis Heading</label>
                    <input
                      type="text"
                      value={aboutThesis.title}
                      onChange={(e) => setAboutThesis({ ...aboutThesis, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium">Manifesto Copy</label>
                  <textarea
                    rows={3}
                    value={aboutThesis.desc}
                    onChange={(e) => setAboutThesis({ ...aboutThesis, desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-gray-300 focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>

                {/* Non-negotiables list */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-mono uppercase text-gray-400 block font-bold">Studio Non-Negotiables</label>
                  <div className="space-y-3">
                    {aboutThesis.nonNegotiables.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-agency-dark border border-agency-border space-y-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...aboutThesis.nonNegotiables];
                            newItems[idx].title = e.target.value;
                            setAboutThesis({ ...aboutThesis, nonNegotiables: newItems });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-agency-surface border border-agency-border text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                        />
                        <textarea
                          rows={2}
                          value={item.desc}
                          onChange={(e) => {
                            const newItems = [...aboutThesis.nonNegotiables];
                            newItems[idx].desc = e.target.value;
                            setAboutThesis({ ...aboutThesis, nonNegotiables: newItems });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-agency-surface border border-agency-border text-xs text-gray-300 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'contact' && (
            <div className="space-y-8">
              {/* Contact Hero */}
              <div className="glass-card rounded-2xl p-6 border border-agency-border space-y-6">
                <div className="flex items-center justify-between border-b border-agency-border pb-4">
                  <div>
                    <h2 className="font-heading font-bold text-sm text-white">Contact Page Hero Copy</h2>
                    <p className="text-[11px] text-gray-400">Direct senior inquiry headline and conversion copy.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveSection('contact', 'hero', contactHero)}
                    disabled={savingKey === 'contact_hero'}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                  >
                    {savingKey === 'contact_hero' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Contact Hero</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Badge</label>
                    <input
                      type="text"
                      value={contactHero.badge}
                      onChange={(e) => setContactHero({ ...contactHero, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-300 font-medium">Headline Title</label>
                    <input
                      type="text"
                      value={contactHero.title}
                      onChange={(e) => setContactHero({ ...contactHero, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-white font-bold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-300 font-medium">Subtitle Description</label>
                  <textarea
                    rows={2}
                    value={contactHero.subtitle}
                    onChange={(e) => setContactHero({ ...contactHero, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-xs text-gray-300 focus:outline-none focus:border-purple-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* 3 Guarantees */}
              <div className="glass-card rounded-2xl p-6 border border-agency-border space-y-6">
                <div className="flex items-center justify-between border-b border-agency-border pb-4">
                  <div>
                    <h2 className="font-heading font-bold text-sm text-white">Client Guarantees & Terms (3 Cards)</h2>
                    <p className="text-[11px] text-gray-400">24-hour proposal, Enterprise NDA, 100% IP ownership.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => saveSection('contact', 'guarantees', contactGuarantees)}
                    disabled={savingKey === 'contact_guarantees'}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                  >
                    {savingKey === 'contact_guarantees' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Guarantees</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {contactGuarantees.items.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-agency-dark border border-agency-border space-y-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const newItems = [...contactGuarantees.items];
                          newItems[idx].title = e.target.value;
                          setContactGuarantees({ items: newItems });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-agency-surface border border-agency-border text-xs font-bold text-white focus:outline-none focus:border-purple-500"
                      />
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => {
                          const newItems = [...contactGuarantees.items];
                          newItems[idx].desc = e.target.value;
                          setContactGuarantees({ items: newItems });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-agency-surface border border-agency-border text-xs text-gray-300 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
