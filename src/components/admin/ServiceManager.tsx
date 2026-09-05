'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase, Plus, Trash2, Edit3, Save, Loader2,
  Image as ImageIcon, Upload, ExternalLink, Check, X,
  ChevronDown, ChevronUp, Sparkles, RefreshCw,
} from 'lucide-react';
import MediaSelectModal from '@/components/MediaSelectModal';

const ICON_OPTIONS = ['sparkles', 'palette', 'globe', 'video', 'zap', 'barChart3', 'target', 'briefcase'];

interface ServiceItem {
  id: string; slug: string; name: string; tagline?: string | null;
  shortDesc: string; fullDesc?: string | null; iconName?: string | null;
  startingPrice?: string | null; displayOrder: number; status: string;
  coverMediaId?: string | null;
  coverMedia?: { id: string; publicUrl: string; originalFilename: string } | null;
  whatIsIncluded?: string | null; benefits?: string | null;
  seoTitle?: string | null; seoDescription?: string | null; packages?: any[];
}

interface Props { showNotification: (msg: string, isErr?: boolean) => void; }

function parseArr(str?: string | null): string[] {
  if (!str) return [];
  try { const p = JSON.parse(str); return Array.isArray(p) ? p.map(String) : []; }
  catch { return str.split('\n').map(s => s.trim()).filter(Boolean); }
}

const EMPTY_FORM = {
  name: '', slug: '', tagline: '', shortDesc: '', fullDesc: '',
  iconName: 'sparkles', startingPrice: '', status: 'PUBLISHED',
  displayOrder: 0, seoTitle: '', seoDescription: '',
};

export default function ServiceManager({ showNotification }: Props) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSvc, setEditingSvc] = useState<ServiceItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [included, setIncluded] = useState<string[]>(['']);
  const [bens, setBens] = useState<string[]>(['']);
  const [coverAsset, setCoverAsset] = useState<any>(null);
  const [mediaOpen, setMediaOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/services');
      const d = await r.json();
      if (d.success) setServices(d.data || []);
    } catch { showNotification('Failed to load services', true); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingSvc(null);
    setForm({ ...EMPTY_FORM, displayOrder: services.length });
    setIncluded(['']); setBens(['']); setCoverAsset(null); setModalOpen(true);
  };

  const openEdit = (s: ServiceItem) => {
    setEditingSvc(s);
    setForm({
      name: s.name, slug: s.slug, tagline: s.tagline || '', shortDesc: s.shortDesc,
      fullDesc: s.fullDesc || '', iconName: s.iconName || 'sparkles',
      startingPrice: s.startingPrice || '', status: s.status,
      displayOrder: s.displayOrder, seoTitle: s.seoTitle || '', seoDescription: s.seoDescription || '',
    });
    const inc = parseArr(s.whatIsIncluded);
    const ben = parseArr(s.benefits);
    setIncluded(inc.length > 0 ? inc : ['']);
    setBens(ben.length > 0 ? ben : ['']);
    setCoverAsset(s.coverMedia || null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditingSvc(null); setCoverAsset(null); };

  const setField = (k: string, v: any) => {
    setForm(prev => ({
      ...prev, [k]: v,
      ...(k === 'name' && !editingSvc
        ? { slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
        : {}),
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.shortDesc) { showNotification('Name and short description required', true); return; }
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        coverMediaId: coverAsset?.id || null,
        whatIsIncluded: JSON.stringify(included.filter(Boolean)),
        benefits: JSON.stringify(bens.filter(Boolean)),
      };
      const url = editingSvc ? `/api/admin/services/${editingSvc.id}` : '/api/admin/services';
      const res = await fetch(url, {
        method: editingSvc ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) { showNotification(editingSvc ? 'Service updated!' : 'Service created!'); closeModal(); load(); }
      else throw new Error(data.error);
    } catch (e: any) { showNotification(e.message, true); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (s: ServiceItem) => {
    if (!confirm(`Delete "${s.name}"? All packages will also be deleted.`)) return;
    const res = await fetch(`/api/admin/services/${s.id}`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) { setServices(prev => prev.filter(x => x.id !== s.id)); showNotification('Deleted'); }
    else showNotification(d.error, true);
  };

  const addItem = (list: string[], set: (v: string[]) => void) => set([...list, '']);
  const setItem = (list: string[], set: (v: string[]) => void, i: number, v: string) => {
    const n = [...list]; n[i] = v; set(n);
  };
  const remItem = (list: string[], set: (v: string[]) => void, i: number) => set(list.filter((_, idx) => idx !== i));

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-6 h-6 animate-spin text-purple-400 mr-2" />
      <span className="text-gray-400 text-sm">Loading services...</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Core Services Manager</h1>
          <p className="text-xs text-gray-400 mt-1">Edit service descriptions, icons, images, pricing, deliverables, and SEO metadata.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="px-3.5 py-2 rounded-xl bg-agency-card border border-agency-border text-xs text-gray-300 hover:text-white flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /><span>Refresh</span>
          </button>
          <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /><span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map(svc => {
          const isExp = expandedId === svc.id;
          const inc = parseArr(svc.whatIsIncluded);
          const ben = parseArr(svc.benefits);
          return (
            <div key={svc.id} className="glass-card rounded-2xl border border-agency-border overflow-hidden">
              <div className="p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-agency-dark border border-agency-border overflow-hidden shrink-0">
                  {svc.coverMedia?.publicUrl
                    ? <img src={svc.coverMedia.publicUrl} alt={svc.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon className="w-6 h-6" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-bold text-white text-sm">{svc.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">/{svc.slug}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${svc.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>{svc.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{svc.shortDesc}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                    <span>{svc.packages?.length || 0} packages</span>
                    {svc.startingPrice && <span>From {svc.startingPrice}</span>}
                    {inc.length > 0 && <span>{inc.length} deliverables</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={`/services/${svc.slug}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-agency-card" title="Preview"><ExternalLink className="w-4 h-4" /></a>
                  <button onClick={() => openEdit(svc)} className="px-3 py-1.5 rounded-lg bg-agency-card hover:bg-purple-600/30 text-purple-300 border border-agency-border text-xs flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" /><span>Edit</span>
                  </button>
                  <button onClick={() => setExpandedId(isExp ? null : svc.id)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-agency-card">
                    {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(svc)} className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-agency-card"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {isExp && (
                <div className="border-t border-agency-border/60 p-5 bg-agency-dark/40 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {svc.tagline && <div><span className="text-gray-500 font-semibold block mb-1">Tagline</span><p className="text-gray-300">{svc.tagline}</p></div>}
                  {inc.length > 0 && (
                    <div><span className="text-gray-500 font-semibold block mb-1">What's Included ({inc.length})</span>
                      <ul className="space-y-1">{inc.slice(0, 5).map((x, i) => <li key={i} className="flex items-center gap-1.5 text-gray-300"><Check className="w-3 h-3 text-emerald-400 shrink-0" />{x}</li>)}{inc.length > 5 && <li className="text-gray-500">+{inc.length - 5} more</li>}</ul>
                    </div>
                  )}
                  {ben.length > 0 && <div><span className="text-gray-500 font-semibold block mb-1">Benefits</span><ul>{ben.slice(0, 4).map((b, i) => <li key={i} className="text-gray-300">• {b}</li>)}</ul></div>}
                  {svc.fullDesc && <div className="sm:col-span-2"><span className="text-gray-500 font-semibold block mb-1">Full Description</span><p className="text-gray-300 leading-relaxed line-clamp-3">{svc.fullDesc}</p></div>}
                </div>
              )}
            </div>
          );
        })}
        {services.length === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center">
            <Briefcase className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white mb-1">No Services Found</p>
            <p className="text-xs text-gray-500">Add your first service using the button above.</p>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D0D18] border border-agency-border rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-[#0D0D18] border-b border-agency-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white">{editingSvc ? `Edit: ${editingSvc.name}` : 'Add New Service'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-agency-card"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-5 text-xs">

              {/* Cover Image Picker */}
              <div>
                <label className="block text-gray-300 font-semibold mb-2">Cover Image</label>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-agency-dark border border-agency-border">
                  <div className="w-20 h-16 rounded-lg bg-agency-card overflow-hidden flex items-center justify-center border border-agency-border shrink-0">
                    {coverAsset?.publicUrl ? <img src={coverAsset.publicUrl} alt="Cover" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-gray-600" />}
                  </div>
                  <div className="flex-1"><p className="text-white text-xs font-medium truncate">{coverAsset?.originalFilename || 'No image selected'}</p><p className="text-[10px] text-gray-500">Select from library or upload directly</p></div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => setMediaOpen(true)} className="px-3 py-2 rounded-xl bg-agency-card text-purple-300 border border-agency-border text-xs font-semibold flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /><span>Library</span>
                    </button>
                    <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /><span>Upload</span>
                      <input type="file" accept="image/*,.webp,.svg" className="hidden" onChange={async e => {
                        const file = e.target.files?.[0]; if (!file) return;
                        const fd = new FormData(); fd.append('file', file); fd.append('category', 'service');
                        const r = await fetch('/api/admin/media', { method: 'POST', body: fd });
                        const d = await r.json();
                        if (d.success) { setCoverAsset(d.data); showNotification('Uploaded!'); }
                        else showNotification(d.error || 'Upload failed', true);
                        e.target.value = '';
                      }} />
                    </label>
                    {coverAsset && <button type="button" onClick={() => setCoverAsset(null)} className="p-2 rounded-xl text-red-400 border border-agency-border hover:bg-agency-card"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                </div>
              </div>

              {/* Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Service Name *</label>
                  <input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Branding Design" className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">URL Slug *</label>
                  <input value={form.slug} onChange={e => setField('slug', e.target.value)} placeholder="branding-design" className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500 font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Tagline</label>
                <input value={form.tagline} onChange={e => setField('tagline', e.target.value)} placeholder="e.g. Visual Identity That Commands Markets" className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Short Description * <span className="text-gray-500 font-normal">(on service cards)</span></label>
                <textarea rows={2} value={form.shortDesc} onChange={e => setField('shortDesc', e.target.value)} placeholder="2-3 sentence summary" className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500" />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Full Description <span className="text-gray-500 font-normal">(service detail page)</span></label>
                <textarea rows={4} value={form.fullDesc} onChange={e => setField('fullDesc', e.target.value)} placeholder="Detailed description for the service page..." className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Starting Price</label>
                  <input value={form.startingPrice} onChange={e => setField('startingPrice', e.target.value)} placeholder="From $990" className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Icon</label>
                  <select value={form.iconName} onChange={e => setField('iconName', e.target.value)} className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500">
                    {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Status</label>
                  <select value={form.status} onChange={e => setField('status', e.target.value)} className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500">
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="HIDDEN">Hidden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Order</label>
                  <input type="number" value={form.displayOrder} onChange={e => setField('displayOrder', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                </div>
              </div>

              {/* What's Included */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300 font-semibold">What's Included (Deliverables)</label>
                  <button type="button" onClick={() => addItem(included, setIncluded)} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Item</button>
                </div>
                <div className="space-y-2">
                  {included.map((x, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <input value={x} onChange={e => setItem(included, setIncluded, i, e.target.value)} placeholder={`Deliverable ${i + 1}...`} className="flex-1 px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                      <button type="button" onClick={() => remItem(included, setIncluded, i)} className="p-1.5 text-red-400 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-300 font-semibold">Key Benefits</label>
                  <button type="button" onClick={() => addItem(bens, setBens)} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"><Plus className="w-3 h-3" /> Add Benefit</button>
                </div>
                <div className="space-y-2">
                  {bens.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                      <input value={b} onChange={e => setItem(bens, setBens, i, e.target.value)} placeholder={`Benefit ${i + 1}...`} className="flex-1 px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                      <button type="button" onClick={() => remItem(bens, setBens, i)} className="p-1.5 text-red-400 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO */}
              <div className="p-4 rounded-xl border border-agency-border/60 bg-agency-dark/50 space-y-3">
                <p className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider">SEO Metadata (Optional)</p>
                <div>
                  <label className="block text-gray-400 mb-1">SEO Title</label>
                  <input value={form.seoTitle} onChange={e => setField('seoTitle', e.target.value)} placeholder="Custom title for search engines" className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">SEO Description</label>
                  <textarea rows={2} value={form.seoDescription} onChange={e => setField('seoDescription', e.target.value)} placeholder="Meta description (max 160 chars)..." className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500" />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-agency-border">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl bg-white/[0.05] text-gray-300 text-xs font-semibold">Cancel</button>
                <button type="button" disabled={isSaving} onClick={handleSave} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{editingSvc ? 'Save Changes' : 'Create Service'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MediaSelectModal isOpen={mediaOpen} onClose={() => setMediaOpen(false)} onSelect={asset => { setCoverAsset(asset); setMediaOpen(false); }} />
    </div>
  );
}
