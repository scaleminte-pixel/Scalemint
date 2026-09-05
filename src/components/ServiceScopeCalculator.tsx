'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Check, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Plus,
  Sliders,
  Flame
} from 'lucide-react';

interface TierOption {
  id: string;
  name: string;
  badge?: string;
  basePrice: number;
  deliveryDays: string;
  features: string[];
}

interface AddOnOption {
  id: string;
  name: string;
  price: number;
  desc: string;
  daysDiff?: string;
}

interface ServiceScopeCalculatorProps {
  serviceName: string;
  serviceSlug: string;
  config?: any;
}

const defaultTierPresets: Record<string, TierOption[]> = {
  default: [
    {
      id: 'essential',
      name: 'Sprint Essential',
      basePrice: 1490,
      deliveryDays: '5-7 Days',
      features: [
        'Core Production Deliverables',
        'Direct Senior Designer/Engineer',
        '2 Iteration & Review Cycles',
        'Full Source Files & Commercial License',
      ],
    },
    {
      id: 'growth',
      name: 'Growth Flagship',
      badge: 'Most Popular',
      basePrice: 2990,
      deliveryDays: '10-14 Days',
      features: [
        'Complete End-to-End System Architecture',
        'Dedicated Senior Production Director',
        'Interactive Prototype & Component Library',
        'Unlimited Iterations within Sprint Period',
        'Direct Slack Channel Communication',
        'Priority Production Queue Allocation',
      ],
    },
    {
      id: 'scale',
      name: 'Enterprise Scale',
      badge: 'Max Velocity',
      basePrice: 4890,
      deliveryDays: '14-21 Days',
      features: [
        'Full Multi-Discipline Ecosystem Deployment',
        'Co-Founders & Principal Lead Direct Oversight',
        'Multi-Platform Adaptations & Responsive Variants',
        'Advanced Analytics & Telemetry Tracking Integration',
        '30-Day Post-Launch SLA & Optimization Support',
      ],
    },
  ],
};

const defaultAddOnOptions: AddOnOption[] = [
  {
    id: 'expedited',
    name: '48h Rapid Velocity Fast-Track',
    price: 650,
    desc: 'Jump the queue with dedicated around-the-clock priority sprint cycles.',
  },
  {
    id: 'source-handover',
    name: 'Full Token Library & Git System',
    price: 400,
    desc: 'Automated Figma tokens to CSS/JSON variables and production Git branch.',
  },
  {
    id: 'retainer-warroom',
    name: '30-Day Post-Launch War Room Support',
    price: 850,
    desc: 'Continuous real-time troubleshooting, minor tweak requests, and live performance monitoring.',
  },
  {
    id: 'ab-testing',
    name: 'Multi-Variant A/B Creative Testing Pack',
    price: 500,
    desc: 'Additional high-contrast variations to test and identify winning commercial conversion angles.',
  },
];

export default function ServiceScopeCalculator({
  serviceName,
  serviceSlug,
  config,
}: ServiceScopeCalculatorProps) {
  let customTiers = defaultTierPresets[serviceSlug] || defaultTierPresets.default;
  let customAddOns = defaultAddOnOptions;

  if (config) {
    if (config.tierPresets) {
      try {
        const parsed = typeof config.tierPresets === 'string' ? JSON.parse(config.tierPresets) : config.tierPresets;
        if (Array.isArray(parsed) && parsed.length > 0) {
          customTiers = parsed;
        }
      } catch (e) {
        console.error('Error parsing config tiers:', e);
      }
    }
    if (config.addOnOptions) {
      try {
        const parsed = typeof config.addOnOptions === 'string' ? JSON.parse(config.addOnOptions) : config.addOnOptions;
        if (Array.isArray(parsed) && parsed.length > 0) {
          customAddOns = parsed;
        }
      } catch (e) {
        console.error('Error parsing config addons:', e);
      }
    }
  }

  const tiers = customTiers;
  const addOnOptions = customAddOns;
  const [selectedTierId, setSelectedTierId] = useState<string>(tiers[1]?.id || tiers[0]?.id || 'growth');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([addOnOptions[1]?.id || addOnOptions[0]?.id || 'source-handover']);

  const selectedTier = tiers.find((t) => t.id === selectedTierId) || tiers[0] || {
    id: 'custom',
    name: 'Custom Scope',
    basePrice: 1500,
    deliveryDays: '7-10 Days',
    features: ['Custom deliverables'],
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addOnsTotal = selectedAddOns.reduce((acc, currId) => {
    const found = addOnOptions.find((a) => a.id === currId);
    return acc + (found ? found.price : 0);
  }, 0);

  const grandTotal = selectedTier.basePrice + addOnsTotal;

  const handleLockIn = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#130E26] via-[#0D0A1C] to-[#070512] shadow-2xl p-6 sm:p-10 backdrop-blur-2xl overflow-hidden">
      {/* Ambient Accent Aura */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-2xl mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3">
          <Calculator className="w-3.5 h-3.5 text-purple-400" />
          <span>Interactive Sprint Estimator</span>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Configure Your {serviceName} Sprint
        </h3>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Select your desired scope and enterprise add-ons. 100% transparent pricing with zero surprise billings or bloated agency markups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column: Tiers & Add-ons Selection (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Sprint Scope Tier */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
                01. Select Production Tier
              </span>
              <span className="text-xs text-gray-400">Fixed-Price Sprint</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tiers.map((tier) => {
                const isSelected = selectedTierId === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/20 ring-1 ring-purple-500'
                        : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    {tier.badge && (
                      <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" />
                        <span>{tier.badge}</span>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {tier.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-purple-300 font-medium mb-3">
                        <Clock className="w-3 h-3 text-purple-400" />
                        <span>{tier.deliveryDays}</span>
                      </div>
                    </div>
                    <div className="text-lg font-heading font-black text-white">
                      ${tier.basePrice.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Strategic Add-Ons */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
                02. Optional Production Accelerators
              </span>
              <span className="text-xs text-gray-400">Custom Enhancements</span>
            </div>

            <div className="space-y-2.5">
              {addOnOptions.map((addon) => {
                const isChecked = selectedAddOns.includes(addon.id);
                return (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddOn(addon.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isChecked
                        ? 'bg-purple-900/20 border-purple-500/60 shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.07] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/[0.06] border border-white/20'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {addon.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {addon.desc}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-heading font-bold text-purple-300 shrink-0">
                      +${addon.price}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry & Grand Total Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 p-6 flex flex-col justify-between h-full space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  Sprint Summary
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  GUARANTEED SCOPE
                </span>
              </div>

              {/* Tier Details */}
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300 font-medium">{selectedTier.name}</span>
                  <span className="text-white font-mono font-bold">
                    ${selectedTier.basePrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Guaranteed Turnaround:</span>
                  <span className="text-purple-300 font-medium">
                    {selectedTier.deliveryDays}
                  </span>
                </div>

                {selectedAddOns.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                    <div className="text-[11px] font-mono uppercase text-gray-400">
                      Selected Accelerators ({selectedAddOns.length}):
                    </div>
                    {selectedAddOns.map((id) => {
                      const item = addOnOptions.find((a) => a.id === id);
                      if (!item) return null;
                      return (
                        <div key={id} className="flex items-center justify-between text-xs text-gray-300">
                          <span className="truncate pr-2">• {item.name}</span>
                          <span className="font-mono text-purple-300 shrink-0">
                            +${item.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* What is included in this tier */}
              <div className="pt-4 border-t border-white/[0.08] space-y-2">
                <span className="text-[11px] font-mono uppercase text-gray-400">
                  Included In Selected Sprint:
                </span>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {selectedTier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Total & CTA */}
            <div className="pt-4 border-t border-white/[0.08] space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-400 block font-mono">ESTIMATED INVESTMENT</span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    Zero Hidden Fees
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-heading text-3xl sm:text-4xl font-black text-white tracking-tight">
                    ${grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLockIn}
                className="w-full py-4 rounded-xl font-heading font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Initiate This Configuration</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
