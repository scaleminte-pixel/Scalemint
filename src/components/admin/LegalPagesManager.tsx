'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  ShieldCheck,
  CreditCard,
  Lock,
  Scale,
  Loader2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface PolicySection {
  id: string;
  title: string;
  content: string;
}

interface LegalDoc {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  sections?: string | null;
  isPublished: boolean;
  lastUpdated: string;
}

interface LegalPagesManagerProps {
  showNotification: (msg: string, isErr?: boolean) => void;
}

export default function LegalPagesManager({ showNotification }: LegalPagesManagerProps) {
  const [selectedDocSlug, setSelectedDocSlug] = useState<'terms' | 'privacy' | 'payment-policy'>('terms');
  const [docs, setDocs] = useState<Record<string, LegalDoc>>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Active form state
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [isPublished, setIsPublished] = useState(true);

  const fetchLegalDocs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/legal');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const map: Record<string, LegalDoc> = {};
        for (const d of data.data) {
          map[d.slug] = d;
        }
        setDocs(map);
        loadDocIntoForm(map[selectedDocSlug]);
      }
    } catch (err) {
      showNotification('Failed to load legal pages', true);
    } finally {
      setLoading(false);
    }
  };

  const loadDocIntoForm = (doc?: LegalDoc) => {
    if (!doc) {
      setTitle('');
      setSummary('');
      setSections([]);
      setIsPublished(true);
      return;
    }

    setTitle(doc.title);
    setSummary(doc.summary || '');
    setIsPublished(doc.isPublished);

    if (doc.sections) {
      try {
        const parsed = JSON.parse(doc.sections);
        setSections(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setSections([]);
      }
    } else {
      setSections([]);
    }
  };

  useEffect(() => {
    fetchLegalDocs();
  }, []);

  const handleSelectTab = (slug: 'terms' | 'privacy' | 'payment-policy') => {
    setSelectedDocSlug(slug);
    loadDocIntoForm(docs[slug]);
  };

  const handleAddSection = () => {
    const id = `section-${Date.now()}`;
    setSections([
      ...sections,
      {
        id,
        title: `${sections.length + 1}. New Policy Clause`,
        content: 'Enter the legal terms and operational obligations for this section...',
      },
    ]);
  };

  const handleRemoveSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sections.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
  };

  const handleUpdateSection = (idx: number, field: 'title' | 'content', val: string) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showNotification('Page title is required', true);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        slug: selectedDocSlug,
        title,
        summary,
        isPublished,
        sections: JSON.stringify(sections),
      };

      const res = await fetch('/api/admin/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showNotification(`${title} saved and updated on frontend!`);
        fetchLegalDocs();
      } else {
        showNotification(data.error || 'Failed to save legal page', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving legal document', true);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="text-xs text-gray-400 font-mono">Loading legal documents...</span>
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
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">Legal & Compliance Policy Pages</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Control Terms & Conditions, Privacy Policy, and Payment & Refund guidelines dynamically.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold font-heading shadow-lg shadow-purple-900/30 active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes Live</span>
        </button>
      </div>

      {/* Doc Selection Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleSelectTab('terms')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
            selectedDocSlug === 'terms'
              ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg ring-1 ring-purple-500'
              : 'bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-white">Terms & Conditions</h4>
            <span className="text-[11px] text-gray-400">MSA & IP handover rights</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('privacy')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
            selectedDocSlug === 'privacy'
              ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg ring-1 ring-purple-500'
              : 'bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-white">Privacy Policy</h4>
            <span className="text-[11px] text-gray-400">Data retention & security</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectTab('payment-policy')}
          className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
            selectedDocSlug === 'payment-policy'
              ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg ring-1 ring-purple-500'
              : 'bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-white">Payment & Refund Policy</h4>
            <span className="text-[11px] text-gray-400">Milestone billing & guarantees</span>
          </div>
        </button>
      </div>

      {/* Editor Main Card */}
      <div className="p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 space-y-5 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              Page Main Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              Executive Summary / Hero Subtitle
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Structured Sections */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h3 className="font-heading font-bold text-white text-sm">
                Policy Sections & Clauses ({sections.length})
              </h3>
              <p className="text-[11px] text-gray-400">Add, edit, or reorder legal clauses on this page.</p>
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Clause Section</span>
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 relative group"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                    Clause #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'up')}
                      className="p-1 rounded bg-white/[0.04] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMoveSection(idx, 'down')}
                      className="p-1 rounded bg-white/[0.04] text-gray-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(idx)}
                      className="p-1 rounded text-red-400 hover:bg-red-500/10 cursor-pointer ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                    placeholder="Section Title (e.g. 1. Intellectual Property & Ownership)"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-purple-500"
                  />
                  <textarea
                    rows={4}
                    value={sec.content}
                    onChange={(e) => handleUpdateSection(idx, 'content', e.target.value)}
                    placeholder="Body legal text..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-gray-200 text-xs leading-relaxed focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
