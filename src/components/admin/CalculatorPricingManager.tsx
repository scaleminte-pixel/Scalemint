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

export default function CalculatorPricingManager({ showNotification }: CalculatorPricingManagerProps) {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [basePrice, setBasePrice] = useState(1490);
  const [currency, setCurrency] = useState('USD');
  const [minPrice, setMinPrice] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [calculationRules, setCalculationRules] = useState('');

  const [tiers, setTiers] = useState<TierItem[]>([]);
  const [addOns, setAddOns] = useState<AddOnItem[]>([]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/calculator');
      const data = await res.json();
      if (data.success && data.data) {
        const c = data.data;
        setBasePrice(c.basePrice || 1490);
        setCurrency(c.currency || 'USD');
        setMinPrice(c.minPrice || 1000);
        setMaxPrice(c.maxPrice || 10000);
        setCalculationRules(c.calculationRules || '');

        if (c.tierPresets) {
          try {
            const parsed = typeof c.tierPresets === 'string' ? JSON.parse(c.tierPresets) : c.tierPresets;
            if (Array.isArray(parsed)) setTiers(parsed);
          } catch (e) {}
        }

        if (c.addOnOptions) {
          try {
            const parsed = typeof c.addOnOptions === 'string' ? JSON.parse(c.addOnOptions) : c.addOnOptions;
            if (Array.isArray(parsed)) setAddOns(parsed);
          } catch (e) {}
        }
      }
    } catch (err) {
      showNotification('Failed to load calculator configuration', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleUpdateTier = (idx: number, field: string, val: any) => {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: val } : t)));
  };

  const handleUpdateAddOn = (idx: number, field: string, val: any) => {
    setAddOns((prev) => prev.map((a, i) => (i === idx ? { ...a, [field]: val } : a)));
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

  const handleAddAddOn = () => {
    const id = `addon-${Date.now()}`;
    setAddOns([
      ...addOns,
      {
        id,
        name: 'New Custom Add-On',
        price: 500,
        desc: 'Accelerated turn-around and additional creative assets.',
      },
    ]);
  };

  const handleRemoveAddOn = (idx: number) => {
    setAddOns(addOns.filter((_, i) => i !== idx));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload = {
        basePrice,
        currency,
        minPrice,
        maxPrice,
        calculationRules,
        tierPresets: JSON.stringify(tiers),
        addOnOptions: JSON.stringify(addOns),
      };

      const res = await fetch('/api/admin/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showNotification('Calculator pricing rules saved & synchronized with frontend!');
      } else {
        showNotification(data.error || 'Failed to save calculator config', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving calculator', true);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="text-xs text-gray-400 font-mono">Loading calculator config...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">Automation Calculator Pricing Engine</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Configure default sprint scope pricing, tier presets, add-on enhancements, and dynamic estimation formulas.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold font-heading shadow-lg shadow-purple-900/30 active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Calculator Rules</span>
        </button>
      </div>

      {/* Global Bounds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 shadow-xl">
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
            Global Base Price ($)
          </label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
            Currency Code
          </label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500 uppercase"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
            Minimum Sprint Threshold ($)
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Tiers Presets Editor */}
      <div className="p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="font-heading font-bold text-white text-base">Production Scope Tiers (3 Primary Options)</h3>
            <p className="text-xs text-gray-400">Edit tier names, badge labels, base prices, and delivery days.</p>
          </div>
          <button
            type="button"
            onClick={handleAddTier}
            className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tier</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((tier, idx) => (
            <div
              key={tier.id || idx}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase">Tier #{idx + 1}</span>
                {tiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTier(idx)}
                    className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-gray-400">Tier Name</label>
                <input
                  type="text"
                  value={tier.name}
                  onChange={(e) => handleUpdateTier(idx, 'name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400">Base Price ($)</label>
                  <input
                    type="number"
                    value={tier.basePrice}
                    onChange={(e) => handleUpdateTier(idx, 'basePrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-gray-400">Turnaround</label>
                  <input
                    type="text"
                    value={tier.deliveryDays}
                    onChange={(e) => handleUpdateTier(idx, 'deliveryDays', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-gray-400">Badge Label (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Most Popular"
                  value={tier.badge || ''}
                  onChange={(e) => handleUpdateTier(idx, 'badge', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Add-Ons Section */}
      <div className="p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="font-heading font-bold text-white text-base">Strategic Add-Ons & Accelerators</h3>
            <p className="text-xs text-gray-400">Manage client-selectable add-on features and extra cost charges.</p>
          </div>
          <button
            type="button"
            onClick={handleAddAddOn}
            className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Accelerator</span>
          </button>
        </div>

        <div className="space-y-3">
          {addOns.map((addon, idx) => (
            <div
              key={addon.id || idx}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Add-on Name"
                    value={addon.name}
                    onChange={(e) => handleUpdateAddOn(idx, 'name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="Extra Price ($)"
                    value={addon.price}
                    onChange={(e) => handleUpdateAddOn(idx, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Short Description"
                    value={addon.desc}
                    onChange={(e) => handleUpdateAddOn(idx, 'desc', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveAddOn(idx)}
                className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 cursor-pointer shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
