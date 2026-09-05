'use client';

import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Star,
  Eye,
  Save,
  Loader2,
  Video,
  AlertCircle,
  Play,
} from 'lucide-react';
import { parseYouTubeUrl } from '@/lib/youtube';

interface YouTubeVideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  embedUrl: string;
  description?: string | null;
  category: string;
  tags?: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
}

interface YouTubeVideoManagerProps {
  showNotification: (msg: string, isErr?: boolean) => void;
}

export default function YouTubeVideoManager({ showNotification }: YouTubeVideoManagerProps) {
  const [videos, setVideos] = useState<YouTubeVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YouTubeVideoItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    category: 'video',
    tags: '',
    isFeatured: false,
    isPublished: true,
    displayOrder: 0,
  });

  const [urlPreviewId, setUrlPreviewId] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/videos');
      const data = await res.json();
      if (data.success) {
        setVideos(data.data || []);
      }
    } catch (err) {
      showNotification('Failed to load YouTube videos', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, youtubeUrl: url }));
    const parsed = parseYouTubeUrl(url);
    setUrlPreviewId(parsed.videoId);
  };

  const handleOpenAdd = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      youtubeUrl: '',
      description: '',
      category: 'video',
      tags: '',
      isFeatured: false,
      isPublished: true,
      displayOrder: videos.length,
    });
    setUrlPreviewId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (v: YouTubeVideoItem) => {
    setEditingVideo(v);
    setFormData({
      title: v.title,
      youtubeUrl: v.youtubeUrl,
      description: v.description || '',
      category: v.category || 'video',
      tags: v.tags || '',
      isFeatured: v.isFeatured,
      isPublished: v.isPublished,
      displayOrder: v.displayOrder,
    });
    setUrlPreviewId(v.youtubeId);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.youtubeUrl.trim()) {
      showNotification('Please provide a valid YouTube URL', true);
      return;
    }
    if (!formData.title.trim()) {
      showNotification('Please provide a video title', true);
      return;
    }

    setIsSaving(true);
    try {
      const url = editingVideo ? `/api/admin/videos/${editingVideo.id}` : '/api/admin/videos';
      const method = editingVideo ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        showNotification(
          editingVideo ? 'YouTube video updated successfully!' : 'New YouTube video added successfully!'
        );
        setModalOpen(false);
        fetchVideos();
      } else {
        showNotification(data.error || 'Failed to save YouTube video', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving video', true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this YouTube video?')) return;
    try {
      const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Video removed successfully');
        setVideos((prev) => prev.filter((v) => v.id !== id));
      } else {
        showNotification(data.error || 'Failed to delete video', true);
      }
    } catch (err) {
      showNotification('Error deleting video', true);
    }
  };

  const handleTogglePublish = async (v: YouTubeVideoItem) => {
    try {
      const res = await fetch(`/api/admin/videos/${v.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !v.isPublished }),
      });
      const data = await res.json();
      if (data.success) {
        setVideos((prev) =>
          prev.map((item) => (item.id === v.id ? { ...item, isPublished: !v.isPublished } : item))
        );
        showNotification(`Video ${!v.isPublished ? 'published' : 'unpublished'}`);
      }
    } catch (err) {
      showNotification('Failed to toggle publish status', true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <Youtube className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">YouTube Video Management</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Easily manage, feature, and embed YouTube videos without uploading heavy media files to your server.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold font-heading shadow-lg shadow-red-900/30 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New YouTube Video</span>
        </button>
      </div>

      {/* Videos List Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <span className="text-xs text-gray-400 font-mono">Loading YouTube videos...</span>
        </div>
      ) : videos.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-gray-500">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-base font-bold text-white">No YouTube Videos Added Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click the button above to paste any standard YouTube URL (e.g. youtube.com/watch?v=... or youtu.be/...)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v) => (
            <div
              key={v.id}
              className={`rounded-3xl border transition-all overflow-hidden flex flex-col justify-between ${
                v.isPublished
                  ? 'bg-[#0E0B1A]/80 border-white/10 hover:border-red-500/40 shadow-xl'
                  : 'bg-white/[0.01] border-white/[0.06] opacity-75'
              }`}
            >
              <div>
                {/* 16:9 Thumbnail Embed Preview */}
                <div className="relative aspect-video w-full bg-black overflow-hidden group">
                  <iframe
                    src={v.embedUrl}
                    title={v.title}
                    className="w-full h-full border-0 pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md text-white border border-white/20 uppercase">
                      {v.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {v.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-black shadow-sm flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Featured</span>
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          v.isPublished
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {v.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-2">
                  <h3 className="font-heading font-bold text-white text-base line-clamp-1">{v.title}</h3>
                  {v.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{v.description}</p>
                  )}
                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-gray-500 border-t border-white/[0.06]">
                    <span>Order: #{v.displayOrder}</span>
                    <a
                      href={v.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <span>Watch</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    v.isPublished
                      ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
                      : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  {v.isPublished ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{v.isPublished ? 'Live' : 'Draft'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(v)}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="Edit Video"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors cursor-pointer"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Video Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0F0B1E] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  <Youtube className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">
                  {editingVideo ? 'Edit YouTube Video' : 'Add New YouTube Video'}
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
              {/* YouTube URL Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                  YouTube Video Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  value={formData.youtubeUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
                <span className="text-[11px] text-gray-400 block">
                  Supports standard watch links, short URLs, and YouTube embed URLs.
                </span>
              </div>

              {/* Live Embed Preview */}
              {urlPreviewId && (
                <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live Embed Preview (ID: {urlPreviewId})
                  </span>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${urlPreviewId}`}
                      title="Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                  Video Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lumina 4K Brand Anthem Commercial"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Category & Display Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1E] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="video">Cinematic Video Editing</option>
                    <option value="ai-ugc">AI UGC Video</option>
                    <option value="branding">Branding & Logo Reel</option>
                    <option value="web">Website Walkthrough</option>
                    <option value="marketing">Digital Marketing Ad</option>
                    <option value="general">General Agency Showcase</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                  Optional Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the production scope, cameras used, or client results..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-white/10">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 bg-white/10 border-white/20 focus:ring-red-500"
                  />
                  <span className="text-xs font-semibold text-white">Publish on Frontend</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-white/10 border-white/20 focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Featured Video</span>
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold font-heading shadow-md shadow-red-900/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingVideo ? 'Update Video' : 'Save & Publish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
