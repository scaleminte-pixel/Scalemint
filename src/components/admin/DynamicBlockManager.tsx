'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Type,
  Eye,
  CheckCircle2,
  XCircle,
  Save,
  Loader2,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import MediaSelectModal from '@/components/MediaSelectModal';

interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'video';
  text?: string;
  imageUrl?: string;
  caption?: string;
  alt?: string;
  videoUrl?: string;
}

interface DynamicBlockItem {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  bodyText?: string | null;
  images?: string | null;
  videoUrl?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  location: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface DynamicBlockManagerProps {
  showNotification: (msg: string, isErr?: boolean) => void;
}

export default function DynamicBlockManager({ showNotification }: DynamicBlockManagerProps) {
  const [blocks, setBlocks] = useState<DynamicBlockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewingBlock, setPreviewingBlock] = useState<any>(null);
  const [editingBlock, setEditingBlock] = useState<DynamicBlockItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    bodyText: '',
    location: 'homepage',
    ctaText: '',
    ctaLink: '',
    videoUrl: '',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    displayOrder: 0,
  });

  // Visual Multi-Section Builder State
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [mediaPickerTargetIdx, setMediaPickerTargetIdx] = useState<number | null>(null);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/blocks');
      const data = await res.json();
      if (data.success) {
        setBlocks(data.data || []);
      }
    } catch (err) {
      showNotification('Failed to load dynamic blocks', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleOpenAdd = () => {
    setEditingBlock(null);
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      bodyText: '',
      location: 'homepage',
      ctaText: '',
      ctaLink: '',
      videoUrl: '',
      status: 'PUBLISHED',
      displayOrder: blocks.length,
    });
    setContentSections([
      { id: 'sec-1', type: 'text', text: 'Enter your introductory paragraph here...' },
    ]);
    setModalOpen(true);
  };

  const handleOpenEdit = (b: DynamicBlockItem) => {
    setEditingBlock(b);
    setFormData({
      title: b.title,
      slug: b.slug,
      subtitle: b.subtitle || '',
      bodyText: b.bodyText || '',
      location: b.location || 'homepage',
      ctaText: b.ctaText || '',
      ctaLink: b.ctaLink || '',
      videoUrl: b.videoUrl || '',
      status: b.status || 'PUBLISHED',
      displayOrder: b.displayOrder,
    });

    let sections: ContentSection[] = [];
    if (b.images) {
      try {
        const parsed = JSON.parse(b.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          sections = parsed;
        }
      } catch (e) {
        console.error('Error parsing block sections:', e);
      }
    }

    if (sections.length === 0) {
      sections = [
        { id: 'sec-1', type: 'text', text: b.bodyText || '' },
      ];
    }

    setContentSections(sections);
    setModalOpen(true);
  };

  // Section Builders
  const addTextSection = () => {
    setContentSections((prev) => [
      ...prev,
      { id: `sec-${Date.now()}`, type: 'text', text: '' },
    ]);
  };

  const addImageSection = () => {
    const newId = `sec-${Date.now()}`;
    setContentSections((prev) => [
      ...prev,
      { id: newId, type: 'image', imageUrl: '', caption: '', alt: '' },
    ]);
  };

  const removeSection = (idx: number) => {
    setContentSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveSection = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === contentSections.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...contentSections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setContentSections(updated);
  };

  const updateSection = (idx: number, field: string, val: any) => {
    setContentSections((prev) =>
      prev.map((sec, i) => (i === idx ? { ...sec, [field]: val } : sec))
    );
  };

  const handlePickMediaForSection = (idx: number) => {
    setMediaPickerTargetIdx(idx);
    setMediaModalOpen(true);
  };

  const handleMediaSelected = (asset: any) => {
    if (mediaPickerTargetIdx !== null) {
      updateSection(mediaPickerTargetIdx, 'imageUrl', asset.publicUrl);
      if (!contentSections[mediaPickerTargetIdx]?.alt) {
        updateSection(mediaPickerTargetIdx, 'alt', asset.altText || asset.title || '');
      }
    }
    setMediaModalOpen(false);
    setMediaPickerTargetIdx(null);
  };

  const handleSave = async (publishStatus?: 'DRAFT' | 'PUBLISHED') => {
    if (!formData.title.trim()) {
      showNotification('Block title is required', true);
      return;
    }

    const firstTextSection = contentSections.find((s) => s.type === 'text');
    const primaryBody = firstTextSection ? firstTextSection.text : formData.bodyText;

    const payload = {
      ...formData,
      status: publishStatus || formData.status,
      bodyText: primaryBody,
      images: JSON.stringify(contentSections),
    };

    setIsSaving(true);
    try {
      const url = editingBlock ? `/api/admin/blocks/${editingBlock.id}` : '/api/admin/blocks';
      const method = editingBlock ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showNotification(
          editingBlock
            ? 'Block updated successfully!'
            : publishStatus === 'PUBLISHED'
            ? 'New Block created & published live!'
            : 'New Block saved as Draft!'
        );
        setModalOpen(false);
        fetchBlocks();
      } else {
        showNotification(data.error || 'Failed to save block', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving block', true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return;
    try {
      const res = await fetch(`/api/admin/blocks/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Block deleted successfully');
        setBlocks((prev) => prev.filter((b) => b.id !== id));
      } else {
        showNotification(data.error || 'Failed to delete block', true);
      }
    } catch (err) {
      showNotification('Error deleting block', true);
    }
  };

  const handlePreview = () => {
    setPreviewingBlock({
      ...formData,
      contentSections,
    });
    setPreviewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">Dynamic Content Block System</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Create visual story blocks with alternating text, image galleries, video embeds, and CTA buttons.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold font-heading shadow-lg shadow-purple-900/30 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Block</span>
        </button>
      </div>

      {/* Block List */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <span className="text-xs text-gray-400 font-mono">Loading dynamic blocks...</span>
        </div>
      ) : blocks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-gray-500">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-base font-bold text-white">No Dynamic Blocks Created Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click &quot;Add New Block&quot; to build rich multi-section articles, banners, and promotional showcases.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((b) => {
            let sectionCount = 0;
            try {
              if (b.images) {
                const parsed = JSON.parse(b.images);
                sectionCount = Array.isArray(parsed) ? parsed.length : 0;
              }
            } catch (e) {}

            return (
              <div
                key={b.id}
                className="p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 hover:border-purple-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        b.status === 'PUBLISHED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-xs font-mono text-gray-500 uppercase">
                      Location: {b.location} · Order: #{b.displayOrder}
                    </span>
                    {sectionCount > 0 && (
                      <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {sectionCount} Sections
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg">{b.title}</h3>
                  {b.subtitle && <p className="text-xs text-purple-300 font-medium">{b.subtitle}</p>}
                  {b.bodyText && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{b.bodyText}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(b)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Block</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                    title="Delete Block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Block Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#0F0B1E] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {editingBlock ? 'Edit Content Block' : 'Add New Content Block'}
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

            {/* Form Fields */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Block Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next-Gen Design & Tech Acceleration"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Subtitle / Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Architectural Engineering"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Multi-Section Content Visual Builder */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 block">
                      Visual Content Builder (Text & Image Sections)
                    </label>
                    <span className="text-[11px] text-gray-400">
                      Assemble your block using alternating text and image sections.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addTextSection}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Type className="w-3.5 h-3.5" />
                      <span>+ Add Text Section</span>
                    </button>
                    <button
                      type="button"
                      onClick={addImageSection}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>+ Add Image Section</span>
                    </button>
                  </div>
                </div>

                {/* Sections Stack */}
                <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                  {contentSections.map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative group/sec"
                    >
                      {/* Section Header Bar */}
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-purple-600/30 text-purple-300 text-[10px] font-mono flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-mono font-bold uppercase text-gray-300">
                            {sec.type === 'text' ? 'Text Block' : 'Image Block'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveSection(idx, 'up')}
                            className="p-1.5 rounded-lg bg-white/[0.04] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === contentSections.length - 1}
                            onClick={() => moveSection(idx, 'down')}
                            className="p-1.5 rounded-lg bg-white/[0.04] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSection(idx)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer ml-1"
                            title="Remove Section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Section Content Field */}
                      {sec.type === 'text' ? (
                        <textarea
                          rows={3}
                          placeholder="Type paragraph body content here..."
                          value={sec.text || ''}
                          onChange={(e) => updateSection(idx, 'text', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      ) : (
                        <div className="space-y-3">
                          {sec.imageUrl ? (
                            <div className="flex items-start gap-4">
                              <img
                                src={sec.imageUrl}
                                alt="Selected asset"
                                className="w-28 h-20 rounded-xl object-cover border border-white/15 shrink-0 bg-black"
                              />
                              <div className="space-y-2 flex-grow">
                                <input
                                  type="text"
                                  placeholder="Image Caption (optional)"
                                  value={sec.caption || ''}
                                  onChange={(e) => updateSection(idx, 'caption', e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-purple-500"
                                />
                                <input
                                  type="text"
                                  placeholder="Alt Text for SEO"
                                  value={sec.alt || ''}
                                  onChange={(e) => updateSection(idx, 'alt', e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-purple-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handlePickMediaForSection(idx)}
                                  className="text-xs text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer"
                                >
                                  Change Image from Media Library
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handlePickMediaForSection(idx)}
                              className="w-full py-6 rounded-xl border border-dashed border-white/20 hover:border-purple-500/60 bg-white/[0.02] hover:bg-purple-500/5 text-gray-400 hover:text-white transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
                            >
                              <ImageIcon className="w-6 h-6 text-purple-400" />
                              <span className="text-xs font-semibold">Choose Image from Central Media Library</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional CTA & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule Strategy Call"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    CTA Link
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /contact or /pricing"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Location Target
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0B1E] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="homepage">Homepage Block</option>
                    <option value="about">About Page Block</option>
                    <option value="services">Services Block</option>
                    <option value="portfolio">Portfolio Block</option>
                    <option value="global">Global Shared Block</option>
                  </select>
                </div>
              </div>

              {/* Status & Actions Footer */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSave('DRAFT')}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSave('PUBLISHED')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold font-heading shadow-md shadow-purple-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingBlock ? 'Update & Publish' : 'Publish Live'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewModalOpen && previewingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#090614] border border-purple-500/30 p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Live Frontend Block Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-2 rounded-xl bg-white/[0.05] text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                {previewingBlock.subtitle && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {previewingBlock.subtitle}
                  </span>
                )}
                <h2 className="font-heading text-3xl font-extrabold text-white">{previewingBlock.title}</h2>
              </div>

              {/* Render Sections */}
              <div className="space-y-6 max-w-2xl mx-auto">
                {previewingBlock.contentSections?.map((sec: any, i: number) => (
                  <div key={i}>
                    {sec.type === 'text' && (
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{sec.text}</p>
                    )}
                    {sec.type === 'image' && sec.imageUrl && (
                      <div className="space-y-1.5">
                        <img
                          src={sec.imageUrl}
                          alt={sec.alt || 'Visual'}
                          className="rounded-2xl w-full max-h-96 object-cover border border-white/10 shadow-xl"
                        />
                        {sec.caption && (
                          <span className="text-[11px] text-gray-400 text-center block font-mono">
                            {sec.caption}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {previewingBlock.ctaText && (
                <div className="text-center pt-4">
                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold font-heading inline-flex items-center gap-2 shadow-glow-purple">
                    <span>{previewingBlock.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Central Media Picker Modal */}
      <MediaSelectModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={handleMediaSelected}
        title="Select Block Media Asset"
      />
    </div>
  );
}
