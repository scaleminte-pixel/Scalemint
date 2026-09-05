'use client';

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  DollarSign,
  ShieldCheck,
  Flame,
  Palette,
  Layout,
  Film,
  TrendingUp,
  Target,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface TierItem {
  id: string;
  name: string;
  badge?: string;
  basePrice: number;
  deliveryDays: string;
  features: string[];
}

interface AddOnItem {
  id: string;
  name: string;
  price: number;
  desc: string;
}

interface CalculatorPricingManagerProps {
  showNotification: (msg: string, isErr?: boolean) => void;
}

const SERVICES_LIST = [
  { slug: 'global', name: 'Global Default', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10' },
  { slug: 'branding-design', name: 'Branding Design', icon: Palette, color: 'text-purple-400 bg-purple-500/10' },
  { slug: 'website-design', name: 'Website Design', icon: Layout, color: 'text-blue-400 bg-blue-500/10' },
  { slug: 'video-editing', name: 'Video Editing', icon: Film, color: 'text-indigo-400 bg-indigo-500/10' },
  { slug: 'ai-ugc-video-editing', name: 'AI UGC Video Editing', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10' },
  { slug: 'digital-marketing', name: 'Digital Marketing', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10' },
  { slug: 'google-ads', name: 'Google Ads Service', icon: Target, color: 'text-cyan-400 bg-cyan-500/10' },
];

export default function CalculatorPricingManager({ showNotification }: CalculatorPricingManagerProps) {
  const [selectedService, setSelectedService] = useState('branding-design');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [basePrice, setBasePrice] = useState(1490);
  const [currency, setCurrency] = useState('USD');
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(10000);

  const [tiers, setTiers] = useState<TierItem[]>([]);
  const [addOns, setAddOns] = useState<AddOnItem[]>([]);

  const fetchConfig = async (serviceSlug: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/calculator?service=${serviceSlug}`);
      const data = await res.json();
      if (data.success && data.data) {
        const c = data.data;
        setBasePrice(c.basePrice || 1490);
        setCurrency(c.currency || 'USD');
        setMinPrice(c.minPrice || 1000);
        setMaxPrice(c.maxPrice || 10000);

        if (Array.isArray(c.tierPresets) && c.tierPresets.length > 0) {
          setTiers(c.tierPresets);
        } else {
          // Defaults
          setTiers([
            {
              id: 'essential',
              name: 'Sprint Essential',
              basePrice: 1490,
              deliveryDays: '5-7 Days',
              features: ['Core Production Deliverables', 'Direct Senior Designer/Lead', '2 Review Cycles', 'Full Commercial License'],
            },
            {
              id: 'growth',
              name: 'Growth Flagship',
              badge: 'Most Popular',
              basePrice: 2990,
              deliveryDays: '10-14 Days',
              features: ['Complete End-to-End Architecture', 'Dedicated Senior Director', 'Interactive Components', 'Unlimited Sprints Scope', 'Private Slack Channel'],
            },
            {
              id: 'scale',
              name: 'Enterprise Scale',
              badge: 'Max Velocity',
              basePrice: 4890,
              deliveryDays: '14-21 Days',
              features: ['Full Multi-Discipline Ecosystem', 'Principal Lead Oversight', 'Multi-Platform Adaptations', 'Advanced Analytics & Telemetry', '30-Day SLA & Support'],
            },
          ]);
        }

        if (Array.isArray(c.addOnOptions) && c.addOnOptions.length > 0) {
          setAddOns(c.addOnOptions);
        } else {
          setAddOns([
            { id: 'expedited', name: '48h Rapid Velocity Fast-Track', price: 650, desc: 'Jump the queue with around-the-clock priority sprint cycles.' },
            { id: 'source-handover', name: 'Full Token Library & Git System', price: 400, desc: 'Automated design tokens to CSS/JSON variables and Git branch.' },
            { id: 'retainer-warroom', name: '30-Day Post-Launch War Room Support', price: 850, desc: 'Continuous troubleshooting, minor tweaks, and live performance monitoring.' },
            { id: 'ab-testing', name: 'Multi-Variant A/B Creative Testing Pack', price: 500, desc: 'Additional high-contrast variations to test winning conversion angles.' },
          ]);
        }
      }
    } catch (err) {
      showNotification('Failed to load calculator configuration', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig(selectedService);
  }, [selectedService]);

  const handleUpdateTier = (idx: number, field: string, val: any) => {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: val } : t)));
  };

  const handleUpdateFeature = (tierIdx: number, featIdx: number, val: string) => {
    setTiers((prev) =>
      prev.map((t, i) => {
        if (i !== tierIdx) return t;
        const feats = [...t.features];
        feats[featIdx] = val;
        return { ...t, features: feats };
      })
    );
  };

  const handleAddFeature = (tierIdx: number) => {
    setTiers((prev) =>
      prev.map((t, i) => (i === tierIdx ? { ...t, features: [...t.features, 'New Deliverable / Feature'] } : t))
    );
  };

  const handleRemoveFeature = (tierIdx: number, featIdx: number) => {
    setTiers((prev) =>
      prev.map((t, i) => (i === tierIdx ? { ...t, features: t.features.filter((_, fi) => fi !== featIdx) } : t))
    );
  };

  const handleAddTier = () => {
    const id = `tier-${Date.now()}`;
    setTiers([
      ...tiers,
      {
        id,
        name: 'Custom Tier',
        basePrice: 2000,
        deliveryDays: '7-10 Days',
        features: ['Core production deliverables', 'Full source code ownership'],
      },
    ]);
  };

  const handleRemoveTier = (idx: number) => {
    setTiers(tiers.filter((_, i) => i !== idx));
  };

  const handleUpdateAddOn = (idx: number, field: string, val: any) => {
    setAddOns((prev) => prev.map((a, i) => (i === idx ? { ...a, [field]: val } : a)));
  };

  const handleAddAddOn = () => {
    const id = `addon-${Date.now()}`;
    setAddOns([
      ...addOns,
      {
        id,
        name: 'New Custom Add-On Accelerator',
        price: 500,
        desc: 'Short deliverable description and value proposition.',
      },
    ]);
  };

  const handleRemoveAddOn = (idx: number) => {
    setAddOns(addOns.filter((_, i) => i !== idx));
  };

  const handleSaveServiceCalculator = async () => {
    setIsSaving(true);
    try {
      const payload = {
        serviceSlug: selectedService,
        basePrice,
        currency,
        minPrice,
        maxPrice,
        tierPresets: tiers,
        addOnOptions: addOns,
      };

      const res = await fetch('/api/admin/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showNotification(`Calculator pricing for "${selectedService}" saved live to database!`);
      } else {
        showNotification(data.error || 'Failed to save calculator config', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving calculator', true);
    } finally {
      setIsSaving(false);
    }
  };

  const activeServiceObj = SERVICES_LIST.find((s) => s.slug === selectedService) || SERVICES_LIST[0];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white">Interactive Sprint Scope Calculator</h1>
          </div>
          <p className="text-xs text-gray-400">
            Configure dynamic pricing tiers, turnaround delivery cadences, and custom add-on accelerators for each specific service or globally.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveServiceCalculator}
          disabled={isSaving || loading}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save [{activeServiceObj.name}] Pricing</span>
        </button>
      </div>

      {/* Service Selector Tabs Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Select Service To Configure:</span>
          </label>
          <span className="text-[11px] text-gray-500">Each service maintains its own isolated price matrix</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {SERVICES_LIST.map((svc) => {
            const Icon = svc.icon;
            const isSelected = selectedService === svc.slug;
            return (
              <button
                key={svc.slug}
                type="button"
                onClick={() => setSelectedService(svc.slug)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 shrink-0 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
                    : 'bg-[#0E0B1A]/80 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
                <span>{svc.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <span className="text-xs text-gray-400 font-mono">Loading pricing for {activeServiceObj.name}...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Base Parameters Card */}
          <div className="p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Base Parameters ({activeServiceObj.name})</span>
              </h3>
              <span className="text-[11px] font-mono text-gray-500">Live frontend currency formatting</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Global Base Price ({currency})</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Currency Code</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Min Spend Threshold ({currency})</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Max Ceiling Threshold ({currency})</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Scope Tiers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-white">Production Scope Tiers (Sprint Options)</h2>
                <p className="text-xs text-gray-400">Configure tier names, prices, turnaround days, and included deliverables.</p>
              </div>

              <button
                type="button"
                onClick={handleAddTier}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier, tIdx) => (
                <div
                  key={tier.id || tIdx}
                  className="p-5 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                        Tier #{tIdx + 1}
                      </span>
                      {tiers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTier(tIdx)}
                          className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Tier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Tier Name</label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => handleUpdateTier(tIdx, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white font-semibold text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Base Price ($)</label>
                        <input
                          type="number"
                          value={tier.basePrice}
                          onChange={(e) => handleUpdateTier(tIdx, 'basePrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Turnaround</label>
                        <input
                          type="text"
                          value={tier.deliveryDays}
                          placeholder="e.g. 5-7 Days"
                          onChange={(e) => handleUpdateTier(tIdx, 'deliveryDays', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Badge Label (Optional)</label>
                      <input
                        type="text"
                        value={tier.badge || ''}
                        placeholder="e.g. Most Popular"
                        onChange={(e) => handleUpdateTier(tIdx, 'badge', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-purple-300 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Features list */}
                    <div className="pt-2 border-t border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-gray-400 uppercase">Included Deliverables:</span>
                        <button
                          type="button"
                          onClick={() => handleAddFeature(tIdx)}
                          className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      </div>

                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {tier.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => handleUpdateFeature(tIdx, fIdx, e.target.value)}
                              className="flex-1 px-2.5 py-1 rounded-lg bg-black/30 border border-white/5 text-[11px] text-gray-300 focus:outline-none focus:border-purple-500"
                            />
                            {tier.features.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(tIdx, fIdx)}
                                className="text-gray-500 hover:text-red-400 p-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add-On Accelerators Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-white">Strategic Add-Ons & Accelerators</h2>
                <p className="text-xs text-gray-400">Optional customization checkboxes for fast-track turnaround or extra deliverables.</p>
              </div>

              <button
                type="button"
                onClick={handleAddAddOn}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Accelerator</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addOns.map((addon, aIdx) => (
                <div
                  key={addon.id || aIdx}
                  className="p-4 rounded-2xl bg-[#0E0B1A]/80 border border-white/10 space-y-3 shadow-lg flex items-start justify-between gap-3"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={addon.name}
                        onChange={(e) => handleUpdateAddOn(aIdx, 'name', e.target.value)}
                        placeholder="Accelerator Name"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white font-semibold text-xs focus:outline-none focus:border-purple-500"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs text-emerald-400 font-mono">+${addon.price}</span>
                        <input
                          type="number"
                          value={addon.price}
                          onChange={(e) => handleUpdateAddOn(aIdx, 'price', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500 text-right"
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      value={addon.desc}
                      onChange={(e) => handleUpdateAddOn(aIdx, 'desc', e.target.value)}
                      placeholder="Description of what is included..."
                      className="w-full px-3 py-1.5 rounded-xl bg-black/30 border border-white/5 text-[11px] text-gray-300 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveAddOn(aIdx)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 transition-colors shrink-0"
                    title="Delete Add-On"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-purple-950/20 border border-purple-500/20">
            <div>
              <span className="font-semibold text-white text-xs block">Ready to deploy changes for {activeServiceObj.name}?</span>
              <span className="text-[11px] text-gray-400">Updates are published immediately to the live service page estimator.</span>
            </div>
            <button
              type="button"
              onClick={handleSaveServiceCalculator}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save & Publish Live</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
