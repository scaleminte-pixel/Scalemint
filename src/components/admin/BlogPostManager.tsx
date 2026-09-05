'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Type,
  Heading,
  ListCheck,
  Quote,
  Eye,
  CheckCircle2,
  Save,
  Loader2,
  ExternalLink,
  Upload,
  X,
} from 'lucide-react';
import MediaSelectModal from '@/components/MediaSelectModal';

export interface BlogBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'list' | 'callout';
  text?: string;
  level?: 'h2' | 'h3';
  imageUrl?: string;
  caption?: string;
  altText?: string;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole?: string | null;
  readTime?: string | null;
  coverUrl?: string | null;
  coverMediaId?: string | null;
  coverMedia?: { id: string; publicUrl: string; originalFilename: string } | null;
  displayOrder: number;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string;
}

interface BlogPostManagerProps {
  showNotification: (msg: string, isErr?: boolean) => void;
}

const CATEGORIES = [
  'Strategy',
  'Website Engineering',
  'Branding & Design',
  'Video & Motion',
  'AI & Growth',
  'Case Study',
];

// Helper: Parse markdown content into structured blocks for visual editing
function parseContentToBlocks(content: string): BlogBlock[] {
  if (!content) {
    return [
      { id: '1', type: 'paragraph', text: 'Write your introductory paragraph here...' },
    ];
  }

  const paragraphs = content.split('\n\n');
  const blocks: BlogBlock[] = [];

  paragraphs.forEach((p, idx) => {
    const trimmed = p.trim();
    if (!trimmed) return;

    // Heading ## or ###
    if (trimmed.startsWith('### ')) {
      blocks.push({
        id: `block-${idx}`,
        type: 'heading',
        level: 'h3',
        text: trimmed.replace('### ', ''),
      });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({
        id: `block-${idx}`,
        type: 'heading',
        level: 'h2',
        text: trimmed.replace('## ', ''),
      });
    }
    // Image ![caption](url)
    else if (trimmed.startsWith('![') && trimmed.includes('](')) {
      const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
      if (match) {
        blocks.push({
          id: `block-${idx}`,
          type: 'image',
          caption: match[1],
          imageUrl: match[2],
          altText: match[1],
        });
      } else {
        blocks.push({ id: `block-${idx}`, type: 'paragraph', text: trimmed });
      }
    }
    // Callout ```
    else if (trimmed.startsWith('```')) {
      const cleaned = trimmed.replace(/```/g, '').trim();
      blocks.push({
        id: `block-${idx}`,
        type: 'callout',
        text: cleaned,
      });
    }
    // Bullet lists
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed
        .split('\n')
        .map((it) => it.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean);
      blocks.push({
        id: `block-${idx}`,
        type: 'list',
        text: items.join('\n'),
      });
    }
    // Regular paragraph
    else {
      blocks.push({
        id: `block-${idx}`,
        type: 'paragraph',
        text: trimmed,
      });
    }
  });

  return blocks.length > 0
    ? blocks
    : [{ id: '1', type: 'paragraph', text: content }];
}

// Helper: Serialize structured blocks back into markdown content
function serializeBlocksToContent(blocks: BlogBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'heading':
          return b.level === 'h3' ? `### ${b.text || ''}` : `## ${b.text || ''}`;
        case 'image':
          return `![${b.caption || b.altText || ''}](${b.imageUrl || ''})`;
        case 'callout':
          return `\`\`\`\n${b.text || ''}\n\`\`\``;
        case 'list': {
          const lines = (b.text || '')
            .split('\n')
            .filter((l) => l.trim().length > 0)
            .map((l) => `- ${l.trim()}`);
          return lines.join('\n');
        }
        case 'paragraph':
        default:
          return b.text || '';
      }
    })
    .join('\n\n');
}

export default function BlogPostManager({ showNotification }: BlogPostManagerProps) {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('Scalemint Studio');
  const [authorRole, setAuthorRole] = useState('Principal Strategist');
  const [readTime, setReadTime] = useState('5 min read');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverMediaId, setCoverMediaId] = useState<string | null>(null);
  const [coverOriginalName, setCoverOriginalName] = useState('');
  const [blocks, setBlocks] = useState<BlogBlock[]>([]);

  // Media Picker state for blog cover or inline images
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'cover' | { blockId: string } | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openNewArticle = () => {
    setEditingBlog(null);
    setTitle('');
    setSlug('');
    setCategory(CATEGORIES[0]);
    setExcerpt('');
    setAuthor('Scalemint Studio');
    setAuthorRole('Principal Strategist');
    setReadTime('5 min read');
    setStatus('PUBLISHED');
    setCoverUrl('');
    setCoverMediaId(null);
    setCoverOriginalName('');
    setBlocks([
      { id: 'b1', type: 'paragraph', text: 'Write the introduction to this article...' },
      { id: 'b2', type: 'heading', level: 'h2', text: 'Key Architectural Insights' },
      { id: 'b3', type: 'paragraph', text: 'Explore the core principles and data-driven methods behind high growth.' },
    ]);
    setModalOpen(true);
  };

  const openEditArticle = (blog: BlogPostItem) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setCategory(blog.category || CATEGORIES[0]);
    setExcerpt(blog.excerpt);
    setAuthor(blog.author || 'Scalemint Studio');
    setAuthorRole(blog.authorRole || 'Principal Strategist');
    setReadTime(blog.readTime || '5 min read');
    setStatus(blog.status || 'PUBLISHED');
    setCoverUrl(blog.coverMedia?.publicUrl || blog.coverUrl || '');
    setCoverMediaId(blog.coverMediaId || null);
    setCoverOriginalName(blog.coverMedia?.originalFilename || '');
    setBlocks(parseContentToBlocks(blog.content));
    setModalOpen(true);
  };

  const handleSlugGenerate = () => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generated);
  };

  // Block management
  const addBlock = (type: BlogBlock['type'], extraProps: Partial<BlogBlock> = {}) => {
    const newBlock: BlogBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      text: type === 'list' ? 'Deliverable 1\nDeliverable 2\nDeliverable 3' : '',
      level: type === 'heading' ? 'h2' : undefined,
      ...extraProps,
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, patch: Partial<BlogBlock>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) {
      showNotification('At least one block is required in the article', true);
      return;
    }
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    setBlocks(copy);
  };

  // Media selection
  const handleMediaSelected = (asset: any) => {
    if (mediaPickerTarget === 'cover') {
      setCoverUrl(asset.publicUrl);
      setCoverMediaId(asset.id);
      setCoverOriginalName(asset.originalFilename);
    } else if (mediaPickerTarget && typeof mediaPickerTarget === 'object') {
      updateBlock(mediaPickerTarget.blockId, {
        imageUrl: asset.publicUrl,
        caption: asset.altText || asset.originalFilename,
      });
    }
    setMediaPickerOpen(false);
    setMediaPickerTarget(null);
  };

  // Save Blog
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !excerpt.trim()) {
      showNotification('Title, slug, and excerpt are required', true);
      return;
    }

    const content = serializeBlocksToContent(blocks);
    if (!content.trim()) {
      showNotification('Article body content cannot be empty', true);
      return;
    }

    setIsSaving(true);

    const payload = {
      title,
      slug,
      category,
      excerpt,
      content,
      author,
      authorRole,
      readTime,
      status,
      coverUrl: coverUrl || null,
      coverMediaId: coverMediaId || null,
    };

    try {
      let res;
      if (editingBlog) {
        res = await fetch('/api/admin/blogs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingBlog.id, ...payload }),
        });
      } else {
        res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save blog post');
      }

      showNotification(editingBlog ? 'Article updated successfully!' : 'New article published!');
      setModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      showNotification(err.message || 'Save failed', true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlog = async (id: string, blogTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${blogTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter((b) => b.id !== id));
        showNotification('Article deleted successfully');
      } else {
        showNotification(data.error || 'Failed to delete article', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Delete failed', true);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>THOUGHT LEADERSHIP & EDITORIAL SUITE</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Customizable Blog Posts & Articles
          </h1>
          <p className="text-xs text-gray-400">
            Create, customize, and edit thought leadership articles with custom multi-block sections (headings, paragraphs, media library image inserts, checklists).
          </p>
        </div>

        <button
          onClick={openNewArticle}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-glow-purple shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
          <span className="text-xs">Loading articles...</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-gray-400 space-y-3">
          <BookOpen className="w-8 h-8 text-gray-600 mx-auto" />
          <p className="text-sm font-semibold text-white">No Articles Published Yet</p>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Click '+ New Article' above to write your first thought leadership piece.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="glass-card rounded-2xl border border-agency-border overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all duration-300"
            >
              <div>
                {/* Cover Image */}
                <div className="aspect-[16/9] w-full bg-agency-dark overflow-hidden relative border-b border-agency-border">
                  {b.coverMedia?.publicUrl || b.coverUrl ? (
                    <img
                      src={b.coverMedia?.publicUrl || b.coverUrl || ''}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-agency-card text-gray-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/80 text-purple-300 border border-purple-500/30 backdrop-blur-md uppercase">
                    {b.category}
                  </span>
                  <span
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      b.status === 'PUBLISHED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>{b.readTime || '5 min read'}</span>
                    <span className="truncate max-w-[140px]">{b.author}</span>
                  </div>

                  <h3 className="font-heading font-bold text-sm sm:text-base text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {b.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-agency-dark/80 border-t border-agency-border flex items-center justify-between gap-2">
                <a
                  href={`/blog/${b.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditArticle(b)}
                    className="px-3 py-1.5 rounded-lg bg-agency-card hover:bg-purple-600/30 text-purple-300 border border-agency-border text-xs flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Article</span>
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(b.id, b.title)}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-agency-card transition-colors"
                    title="Delete Article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Customization Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0B0B14] border border-agency-border rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-agency-border flex items-center justify-between bg-[#0E0E1A]">
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  {editingBlog ? 'Edit & Customize Blog Article' : 'Write & Publish New Article'}
                </h3>
                <p className="text-xs text-gray-400">
                  Fully customizable block-based editorial engine. Add headings, text, and rich image inserts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-agency-card hover:bg-agency-cardHover text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Meta Settings Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => {
                      if (!slug && title) handleSlugGenerate();
                    }}
                    placeholder="e.g. The 2026 High-Conversion Landing Page Blueprint"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-300 font-semibold">URL Slug *</label>
                    <button
                      type="button"
                      onClick={handleSlugGenerate}
                      className="text-[10px] text-purple-400 hover:underline"
                    >
                      Generate from title
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. high-conversion-landing-page-blueprint"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  >
                    <option value="PUBLISHED">Published (Visible on site)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="e.g. 6 min read"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div className="p-4 rounded-2xl bg-agency-dark border border-agency-border space-y-3">
                <label className="block text-gray-300 font-semibold">
                  Article Cover Image *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-32 h-20 rounded-xl bg-agency-card overflow-hidden flex items-center justify-center border border-agency-border shrink-0">
                    {coverUrl ? (
                      <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs text-white font-medium truncate">
                      {coverOriginalName || coverUrl ? 'Cover image attached' : 'No cover image selected'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Choose from Central Media Library or directly upload an image from your computer.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Choose from Library */}
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerTarget('cover');
                        setMediaPickerOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-agency-card hover:bg-agency-cardHover text-purple-300 border border-agency-border text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Choose from Library</span>
                    </button>

                    {/* Direct Upload */}
                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Direct Upload</span>
                      <input
                        type="file"
                        accept="image/*,.svg,.webp,.png,.jpg,.jpeg,.avif"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append('file', file);
                          fd.append('category', 'blog');
                          try {
                            const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
                            const data = await res.json();
                            if (data.success) {
                              setCoverUrl(data.data.publicUrl);
                              setCoverMediaId(data.data.id);
                              setCoverOriginalName(data.data.originalFilename);
                              showNotification('Cover image uploaded successfully!');
                            } else {
                              showNotification(data.error || 'Upload failed', true);
                            }
                          } catch (err: any) {
                            showNotification(err.message || 'Upload error', true);
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Article Summary / Excerpt * (Displayed on blog grid & meta tags)
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="2-3 sentence overview highlighting the key takeaway..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Author Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Scalemint Studio"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Author Title / Role</label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder="e.g. Principal Brand Strategist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                  />
                </div>
              </div>

              {/* BLOCK-BASED CUSTOMIZABLE ARTICLE CONTENT BUILDER */}
              <div className="space-y-4 pt-4 border-t border-agency-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                      <span>Article Sections & Custom Blocks</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                        {blocks.length} Blocks
                      </span>
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Build your story section by section: add headings, paragraphs, media images, and checklists in any order.
                    </p>
                  </div>

                  {/* Add Block Toolbar */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addBlock('paragraph')}
                      className="px-2.5 py-1.5 rounded-lg bg-agency-card hover:bg-agency-cardHover text-gray-300 hover:text-white border border-agency-border text-[11px] flex items-center gap-1"
                    >
                      <Type className="w-3 h-3 text-blue-400" />
                      <span>+ Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('heading', { level: 'h2' })}
                      className="px-2.5 py-1.5 rounded-lg bg-agency-card hover:bg-agency-cardHover text-gray-300 hover:text-white border border-agency-border text-[11px] flex items-center gap-1"
                    >
                      <Heading className="w-3 h-3 text-purple-400" />
                      <span>+ Heading</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('image')}
                      className="px-2.5 py-1.5 rounded-lg bg-agency-card hover:bg-agency-cardHover text-gray-300 hover:text-white border border-agency-border text-[11px] flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3 text-emerald-400" />
                      <span>+ Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('list')}
                      className="px-2.5 py-1.5 rounded-lg bg-agency-card hover:bg-agency-cardHover text-gray-300 hover:text-white border border-agency-border text-[11px] flex items-center gap-1"
                    >
                      <ListCheck className="w-3 h-3 text-amber-400" />
                      <span>+ Checklist</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('callout')}
                      className="px-2.5 py-1.5 rounded-lg bg-agency-card hover:bg-agency-cardHover text-gray-300 hover:text-white border border-agency-border text-[11px] flex items-center gap-1"
                    >
                      <Quote className="w-3 h-3 text-pink-400" />
                      <span>+ Callout</span>
                    </button>
                  </div>
                </div>

                {/* Blocks List */}
                <div className="space-y-3">
                  {blocks.map((block, idx) => (
                    <div
                      key={block.id}
                      className="p-4 rounded-2xl bg-[#11111E] border border-agency-border hover:border-purple-500/30 transition-all space-y-3 group"
                    >
                      {/* Block Controls Header */}
                      <div className="flex items-center justify-between border-b border-agency-border/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-agency-card text-gray-400 font-mono text-[10px] flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <span className="font-semibold text-white uppercase text-[10px] tracking-wider">
                            {block.type === 'heading' ? `Heading (${block.level || 'h2'})` : block.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveBlock(idx, 'up')}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === blocks.length - 1}
                            onClick={() => moveBlock(idx, 'down')}
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            className="p-1 text-red-400 hover:text-red-300 ml-1"
                            title="Delete Block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Block Inputs based on type */}
                      {block.type === 'paragraph' && (
                        <textarea
                          rows={3}
                          value={block.text || ''}
                          onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                          placeholder="Write paragraph content..."
                          className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500"
                        />
                      )}

                      {block.type === 'heading' && (
                        <div className="flex items-center gap-3">
                          <select
                            value={block.level || 'h2'}
                            onChange={(e) => updateBlock(block.id, { level: e.target.value as any })}
                            className="w-24 px-2.5 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs font-semibold"
                          >
                            <option value="h2">H2 Big</option>
                            <option value="h3">H3 Medium</option>
                          </select>
                          <input
                            type="text"
                            value={block.text || ''}
                            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                            placeholder="Section Heading Title..."
                            className="flex-1 px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs font-bold focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-agency-dark border border-agency-border">
                            <div className="w-24 h-16 rounded-lg bg-agency-card overflow-hidden flex items-center justify-center border border-agency-border shrink-0">
                              {block.imageUrl ? (
                                <img src={block.imageUrl} alt="Block" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-xs text-white font-medium truncate">
                                {block.imageUrl || 'No image attached to this block'}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                This image will be rendered within the article flow.
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setMediaPickerTarget({ blockId: block.id });
                                  setMediaPickerOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-agency-card hover:bg-agency-cardHover text-purple-300 text-xs font-semibold border border-agency-border"
                              >
                                Select from Library
                              </button>
                              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold">
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append('file', file);
                                    fd.append('category', 'blog');
                                    const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
                                    const data = await res.json();
                                    if (data.success) {
                                      updateBlock(block.id, {
                                        imageUrl: data.data.publicUrl,
                                        caption: data.data.altText || data.data.originalFilename,
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={block.caption || ''}
                            onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                            placeholder="Image Caption / Description (Optional)..."
                            className="w-full px-3 py-1.5 rounded-xl bg-agency-dark border border-agency-border text-white text-xs"
                          />
                        </div>
                      )}

                      {block.type === 'list' && (
                        <div className="space-y-1">
                          <textarea
                            rows={3}
                            value={block.text || ''}
                            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                            placeholder="Enter bullet items, one per line..."
                            className="w-full px-3 py-2 rounded-xl bg-agency-dark border border-agency-border text-white text-xs font-mono leading-relaxed"
                          />
                          <p className="text-[10px] text-gray-500">Each line will become a verified bullet point with green checkmark.</p>
                        </div>
                      )}

                      {block.type === 'callout' && (
                        <div className="space-y-1">
                          <textarea
                            rows={2}
                            value={block.text || ''}
                            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                            placeholder="Highlighted takeaway or architectural quote..."
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/20 border border-purple-500/40 text-purple-200 text-xs italic leading-relaxed"
                          />
                          <p className="text-[10px] text-gray-500">Displays as a prominent glowing executive callout box.</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Submit Actions */}
              <div className="pt-4 border-t border-agency-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-agency-card hover:bg-agency-cardHover text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-glow-purple disabled:opacity-40"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Article...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingBlog ? 'Save Changes' : 'Publish Article'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Central Media Library Selector */}
      <MediaSelectModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setMediaPickerTarget(null);
        }}
        onSelect={handleMediaSelected}
        title="Select Media for Article"
      />
    </div>
  );
}
