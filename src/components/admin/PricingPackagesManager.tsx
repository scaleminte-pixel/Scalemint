'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Star,
  CheckCircle2,
  Clock,
  Loader2,
  Tag,
  Flame,
} from 'lucide-react';

interface ServicePackageItem {
  id: string;
  serviceId: string;
  name: string;
  bestFor?: string | null;
  tier?: string | null;
  price: string | number;
  currency: string;
  originalPrice?: string | number | null;
  discount?: string | null;
  billingType?: string | null;
  deliveryDays?: string | null;
  timeline?: string | null;
  shortDesc?: string | null;
  badge?: string | null;
  guaranteeText?: string | null;
  features?: string | string[] | null;
  deliverables?: string | string[] | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  isPopular: boolean;
  status: 'PUBLISHED' | 'DRAFT' | string;
  displayOrder: number;
  service?: { id: string; name?: string; title?: string; slug?: string };
}

interface PricingPackagesManagerProps {
  services: any[];
  showNotification: (msg: string, isErr?: boolean) => void;
}

// Helper to format currency values safely
function formatPriceDisplay(val?: string | number | null, currency: string = 'USD'): string {
  if (val === undefined || val === null || val === '') return 'Custom';
  const str = String(val).trim();
  // If user already specified symbol or unit (e.g. $990, €990, BDT 10000, $990 / mo), show as-is
  return str;
}

// Helper to parse deliverables / features list
function parseDeliverables(pkg: ServicePackageItem): string[] {
  const raw = pkg.deliverables !== undefined && pkg.deliverables !== null ? pkg.deliverables : pkg.features;
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
      return [raw];
    } catch {
      return raw.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export default function PricingPackagesManager({
  services,
  showNotification,
}: PricingPackagesManagerProps) {
  const [packages, setPackages] = useState<ServicePackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackageItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCloning, setIsCloning] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    serviceId: '',
    name: '',
    bestFor: '',
    tier: 'STARTER',
    price: '1490',
    currency: 'USD',
    originalPrice: '1990',
    discount: '25% OFF',
    billingType: 'Fixed Sprint Milestone',
    timeline: '7-10 Days',
    badge: '',
    guaranteeText: '100% Complete IP Handover Guarantee',
    ctaText: 'Get Started',
    ctaLink: '#contact',
    isPopular: false,
    status: 'PUBLISHED' as 'PUBLISHED' | 'DRAFT',
    displayOrder: 0,
  });

  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/packages');
      const data = await res.json();
      if (data.success) {
        const list = data.packages || data.data || [];
        setPackages(list);
      } else {
        showNotification(data.error || 'Failed to load packages', true);
      }
    } catch (err) {
      showNotification('Failed to load packages', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenAdd = () => {
    setEditingPackage(null);
    const defaultServiceId =
      selectedServiceFilter !== 'all'
        ? selectedServiceFilter
        : services[0]?.id || '';

    setFormData({
      serviceId: defaultServiceId,
      name: '',
      bestFor: 'High-growth brands seeking full turnkey delivery',
      tier: 'GROWTH',
      price: '2490',
      currency: 'USD',
      originalPrice: '3200',
      discount: '20% OFF',
      billingType: 'Fixed Sprint Milestone',
      timeline: '10-14 Days',
      badge: 'Most Popular',
      guaranteeText: '100% Unrestricted IP Handover & Code Ownership',
      ctaText: 'Get Started',
      ctaLink: '#contact',
      isPopular: false,
      status: 'PUBLISHED',
      displayOrder: packages.length + 1,
    });

    setFeaturesList([
      'End-to-End Production Deliverables',
      'Direct Senior Craft Lead Oversight',
      'Structured Revision & QA Rounds',
      'Full Master Vector & Code Repositories Handover',
    ]);
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg: ServicePackageItem) => {
    setEditingPackage(pkg);

    // Clean prices for form fields
    const rawPrice = pkg.price !== undefined && pkg.price !== null ? String(pkg.price).replace(/^\$/, '') : '1490';
    const rawOrig = pkg.originalPrice !== undefined && pkg.originalPrice !== null ? String(pkg.originalPrice).replace(/^\$/, '') : '';

    setFormData({
      serviceId: pkg.serviceId,
      name: pkg.name,
      bestFor: pkg.bestFor || pkg.shortDesc || '',
      tier: pkg.tier || 'GROWTH',
      price: rawPrice,
      currency: pkg.currency || 'USD',
      originalPrice: rawOrig,
      discount: pkg.discount || '',
      billingType: pkg.billingType || 'Fixed Sprint Milestone',
      timeline: pkg.timeline || pkg.deliveryDays || '7-10 Days',
      badge: pkg.badge || '',
      guaranteeText: pkg.guaranteeText || '',
      ctaText: pkg.ctaText || 'Get Started',
      ctaLink: pkg.ctaLink || '#contact',
      isPopular: Boolean(pkg.isPopular),
      status: (pkg.status as 'PUBLISHED' | 'DRAFT') || 'PUBLISHED',
      displayOrder: pkg.displayOrder ?? 0,
    });

    setFeaturesList(parseDeliverables(pkg));
    setModalOpen(true);
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeaturesList([...featuresList, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showNotification('Package name is required', true);
      return;
    }
    if (!formData.serviceId) {
      showNotification('Please select a service discipline', true);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        deliverables: featuresList,
        features: featuresList,
        price: formData.price.startsWith('$') ? formData.price : `$${formData.price}`,
        originalPrice: formData.originalPrice
          ? formData.originalPrice.startsWith('$')
            ? formData.originalPrice
            : `$${formData.originalPrice}`
          : null,
      };

      const url = editingPackage ? `/api/admin/packages/${editingPackage.id}` : '/api/admin/packages';
      const method = editingPackage ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showNotification(
          editingPackage ? 'Package updated successfully!' : 'New Package created successfully!'
        );
        setModalOpen(false);
        fetchPackages();
      } else {
        showNotification(data.error || 'Failed to save package', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving package', true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async (pkgId: string) => {
    setIsCloning(pkgId);
    try {
      const res = await fetch(`/api/admin/packages/${pkgId}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('Package duplicated successfully in Draft mode!');
        fetchPackages();
      } else {
        showNotification(data.error || 'Failed to duplicate package', true);
      }
    } catch (err) {
      showNotification('Error duplicating package', true);
    } finally {
      setIsCloning(null);
    }
  };

  const handleDelete = async (pkgId: string) => {
    if (!confirm('Are you sure you want to delete this pricing package?')) return;
    try {
      const res = await fetch(`/api/admin/packages/${pkgId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Package deleted successfully');
        setPackages((prev) => prev.filter((p) => p.id !== pkgId));
      } else {
        showNotification(data.error || 'Failed to delete package', true);
      }
    } catch (err) {
      showNotification('Error deleting package', true);
    }
  };

  const filteredPackages =
    selectedServiceFilter === 'all'
      ? packages
      : packages.filter((p) => p.serviceId === selectedServiceFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">Dynamic Pricing & Packages</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Control service packages, deliverables chips, discount badges, 1-click clone, and commercial rates.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-extrabold font-heading shadow-lg shadow-amber-900/30 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Package</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs by Service */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/[0.08]">
        <button
          onClick={() => setSelectedServiceFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedServiceFilter === 'all'
              ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-900/20'
              : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/10'
          }`}
        >
          All Services ({packages.length})
        </button>
        {services.map((s) => {
          const serviceName = s.name || s.title || 'Service';
          const count = packages.filter((p) => p.serviceId === s.id).length;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedServiceFilter(s.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedServiceFilter === s.id
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-900/20'
                  : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {serviceName} ({count})
            </button>
          );
        })}
      </div>

      {/* Package Cards Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <span className="text-xs text-gray-400 font-mono">Loading packages...</span>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-gray-500">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-base font-bold text-white">No Packages in this Discipline</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click &quot;Create New Package&quot; to configure pricing tiers for your clients.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Package</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const features = parseDeliverables(pkg);
            const associatedService =
              pkg.service?.name ||
              pkg.service?.title ||
              services.find((s) => s.id === pkg.serviceId)?.name ||
              'Service';

            return (
              <div
                key={pkg.id}
                className={`rounded-3xl border p-6 backdrop-blur-xl flex flex-col justify-between transition-all relative ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-[#1E140C] via-[#120B06] to-[#0A0704] border-amber-500/50 shadow-[0_0_40px_-10px_rgba(245,158,11,0.25)]'
                    : 'bg-[#0B0816]/90 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular or Custom Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{pkg.badge}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs font-mono text-gray-400">
                      <span className="text-amber-400 font-bold uppercase truncate">
                        {associatedService}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          pkg.status === 'PUBLISHED'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </div>
                    <h3 className="font-heading font-extrabold text-white text-xl mt-1">{pkg.name}</h3>
                    {(pkg.bestFor || pkg.shortDesc) && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {pkg.bestFor || pkg.shortDesc}
                      </p>
                    )}
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-black text-3xl text-white">
                        {formatPriceDisplay(pkg.price)}
                      </span>
                      <span className="text-xs text-gray-400 font-mono uppercase">{pkg.currency || 'USD'}</span>
                      {pkg.originalPrice && (
                        <span className="text-xs text-gray-500 line-through font-mono ml-auto">
                          {formatPriceDisplay(pkg.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-1 border-t border-white/[0.06]">
                      <span className="text-emerald-400">{pkg.discount || pkg.billingType || 'Fixed Scope'}</span>
                      <span className="text-purple-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {pkg.timeline || pkg.deliveryDays || 'Turnkey'}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-gray-400 font-bold">
                      Included Sprint Scope ({features.length}):
                    </span>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      {features.slice(0, 5).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{f}</span>
                        </li>
                      ))}
                      {features.length > 5 && (
                        <li className="text-[11px] text-gray-500 italic pl-5">
                          + {features.length - 5} more deliverables
                        </li>
                      )}
                      {features.length === 0 && (
                        <li className="text-[11px] text-gray-500 italic pl-2">
                          No deliverables listed yet.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(pkg)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      disabled={isCloning === pkg.id}
                      onClick={() => handleDuplicate(pkg.id)}
                      className="p-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 border border-purple-500/20 transition-colors cursor-pointer"
                      title="1-Click Duplicate Package"
                    >
                      {isCloning === pkg.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(pkg.id)}
                    className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                    title="Delete Package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Package Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#0F0B1E] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {editingPackage ? 'Edit Pricing Package' : 'Create New Pricing Package'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-white/[0.05] text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Package Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Growth Flagship Sprint"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Service Discipline <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1E] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name || s.title || 'Service'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Original Price, Discount, Turnaround */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Price ($) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1490"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Original Price ($)
                  </label>
                  <input
                    type="text"
                    placeholder="1990"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Discount Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25% OFF"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Delivery Timeline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 7-10 Business Days"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Best For / Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                  Target Audience / Best For
                </label>
                <input
                  type="text"
                  placeholder="e.g. Early-stage ventures needing foundational branding"
                  value={formData.bestFor}
                  onChange={(e) => setFormData({ ...formData, bestFor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Individual Features / Deliverables Manager */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                  Deliverables & Scope Included ({featuresList.length})
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type new deliverable (e.g. Complete Design Token Library)..."
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-grow px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shrink-0 cursor-pointer"
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto p-3 rounded-2xl bg-black/40 border border-white/10">
                  {featuresList.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {featuresList.length === 0 && (
                    <p className="text-xs text-gray-500 italic p-2 text-center">
                      No deliverables added yet. Type above and click &quot;+ Add Feature&quot;.
                    </p>
                  )}
                </div>
              </div>

              {/* Badge & Guarantee Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular / High Velocity"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Guarantee Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% IP Handover & Code Ownership"
                    value={formData.guaranteeText}
                    onChange={(e) => setFormData({ ...formData, guaranteeText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Toggles & Footer */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 bg-white/10 border-white/20"
                    />
                    <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Mark Popular Card</span>
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status === 'PUBLISHED'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.checked ? 'PUBLISHED' : 'DRAFT',
                        })
                      }
                      className="w-4 h-4 rounded text-emerald-500 bg-white/10 border-white/20"
                    />
                    <span className="text-xs font-semibold text-white">Live on Frontend</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-extrabold font-heading shadow-md shadow-amber-900/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingPackage ? 'Update Package' : 'Create Package'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
