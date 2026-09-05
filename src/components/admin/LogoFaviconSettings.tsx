'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  Image as ImageIcon,
  Globe,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Trash2,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import MediaSelectModal from '@/components/MediaSelectModal';

interface LogoFaviconSettingsProps {
  settings: any;
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  showNotification: (msg: string, isErr?: boolean) => void;
}

export default function LogoFaviconSettings({
  settings,
  setSettings,
  showNotification,
}: LogoFaviconSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'logo' | 'favicon' | null>(null);

  const handleOpenPicker = (target: 'logo' | 'favicon') => {
    setPickerTarget(target);
    setMediaModalOpen(true);
  };

  const handleMediaSelected = (asset: any) => {
    if (pickerTarget === 'logo') {
      setSettings((prev: any) => ({
        ...prev,
        logoUrl: asset.publicUrl,
        logoMediaId: asset.id,
      }));
      showNotification('Logo selected from Media Library');
    } else if (pickerTarget === 'favicon') {
      setSettings((prev: any) => ({
        ...prev,
        faviconUrl: asset.publicUrl,
        faviconMediaId: asset.id,
      }));
      showNotification('Favicon selected from Media Library');
    }
    setMediaModalOpen(false);
    setPickerTarget(null);
  };

  // Direct file upload for Logo
  const handleDirectLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'branding');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload logo image');
      }

      setSettings((prev: any) => ({
        ...prev,
        logoUrl: data.data.publicUrl,
        logoMediaId: data.data.id,
      }));
      showNotification('Logo uploaded successfully! Click "Save Brand Settings" to apply.');
    } catch (err: any) {
      showNotification(err.message || 'Upload failed', true);
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  // Direct file upload for Favicon
  const handleDirectFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'branding');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload favicon');
      }

      setSettings((prev: any) => ({
        ...prev,
        faviconUrl: data.data.publicUrl,
        faviconMediaId: data.data.id,
      }));
      showNotification('Favicon uploaded successfully! Click "Save Brand Settings" to apply.');
    } catch (err: any) {
      showNotification(err.message || 'Upload failed', true);
    } finally {
      setUploadingFavicon(false);
      e.target.value = '';
    }
  };

  const handleRemoveLogo = () => {
    setSettings((prev: any) => ({
      ...prev,
      logoUrl: null,
      logoMediaId: null,
    }));
    showNotification('Logo cleared. Click "Save Brand Settings" to persist.');
  };

  const handleRemoveFavicon = () => {
    setSettings((prev: any) => ({
      ...prev,
      faviconUrl: null,
      faviconMediaId: null,
    }));
    showNotification('Favicon cleared. Click "Save Brand Settings" to persist.');
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        if (data.data) {
          setSettings((prev: any) => ({ ...prev, ...data.data }));
        }
        showNotification('Website settings & brand identity updated successfully!');
      } else {
        showNotification(data.error || 'Failed to save settings', true);
      }
    } catch (err: any) {
      showNotification(err.message || 'Error saving settings', true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="font-heading text-xl font-bold text-white">Brand Identity & Website Settings</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Control the website Logo, Favicon, direct WhatsApp channel, SEO keywords, and social tracking tags.
          </p>
        </div>

        <button
          onClick={() => handleSaveSettings()}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold font-heading shadow-lg shadow-purple-900/30 active:scale-95 transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Brand Settings</span>
        </button>
      </div>

      {/* 2-Column Brand Asset Cards (Logo & Favicon) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Card */}
        <div className="p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="font-heading font-bold text-white text-base">Website Header & Footer Logo</h3>
            </div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">SVG / PNG / WEBP</span>
          </div>

          <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center min-h-[160px] relative group">
            {settings?.logoUrl ? (
              <div className="text-center space-y-3">
                <img
                  src={settings.logoUrl}
                  alt="Active Logo"
                  className="max-h-16 max-w-[240px] object-contain mx-auto filter drop-shadow-md"
                />
                <span className="text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Dynamic Logo Loaded
                </span>
              </div>
            ) : (
              <div className="text-center space-y-2 text-gray-500">
                <ImageIcon className="w-10 h-10 mx-auto opacity-40" />
                <p className="text-xs">No custom logo selected. Default Scalemint typography is active.</p>
              </div>
            )}
          </div>

          {/* Action Buttons: Direct Upload & Library */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex-1 cursor-pointer py-2.5 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
              {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{uploadingLogo ? 'Uploading...' : 'Direct Upload Logo'}</span>
              <input
                type="file"
                accept="image/*,.svg,.png,.webp"
                className="hidden"
                disabled={uploadingLogo}
                onChange={handleDirectLogoUpload}
              />
            </label>

            <button
              type="button"
              onClick={() => handleOpenPicker('logo')}
              className="py-2.5 px-3.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Library</span>
            </button>

            {settings?.logoUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                title="Remove Custom Logo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Direct URL input fallback */}
          <div className="pt-2">
            <label className="text-[11px] font-mono text-gray-400 block mb-1">Or direct image URL:</label>
            <input
              type="text"
              placeholder="https://... or /uploads/..."
              value={settings?.logoUrl || ''}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Favicon Card */}
        <div className="p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <h3 className="font-heading font-bold text-white text-base">Browser Tab Favicon (1:1)</h3>
            </div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">ICO / PNG / SVG</span>
          </div>

          <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center min-h-[160px]">
            {settings?.faviconUrl ? (
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-white/10 p-2.5 border border-white/20 mx-auto flex items-center justify-center shadow-lg">
                  <img
                    src={settings.faviconUrl}
                    alt="Active Favicon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Custom Favicon Active
                </span>
              </div>
            ) : (
              <div className="text-center space-y-2 text-gray-500">
                <Globe className="w-10 h-10 mx-auto opacity-40" />
                <p className="text-xs">No custom favicon selected. Default icon is active.</p>
              </div>
            )}
          </div>

          {/* Action Buttons: Direct Upload & Library */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex-1 cursor-pointer py-2.5 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
              {uploadingFavicon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{uploadingFavicon ? 'Uploading...' : 'Direct Upload Favicon'}</span>
              <input
                type="file"
                accept="image/*,.ico,.png,.svg,.webp"
                className="hidden"
                disabled={uploadingFavicon}
                onChange={handleDirectFaviconUpload}
              />
            </label>

            <button
              type="button"
              onClick={() => handleOpenPicker('favicon')}
              className="py-2.5 px-3.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Library</span>
            </button>

            {settings?.faviconUrl && (
              <button
                type="button"
                onClick={handleRemoveFavicon}
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                title="Remove Custom Favicon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Direct URL input fallback */}
          <div className="pt-2">
            <label className="text-[11px] font-mono text-gray-400 block mb-1">Or direct favicon URL:</label>
            <input
              type="text"
              placeholder="https://... or /uploads/..."
              value={settings?.faviconUrl || ''}
              onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contact & WhatsApp Channel Settings */}
      <div className="p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 space-y-4 shadow-xl">
        <div className="pb-3 border-b border-white/10">
          <h3 className="font-heading font-bold text-white text-base">Direct Channels & WhatsApp Integration</h3>
          <p className="text-xs text-gray-400">Controls direct communication buttons on header, footer, and floating widgets.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Number</span>
            </label>
            <input
              type="text"
              placeholder="+14158903412"
              value={settings?.whatsappNumber || ''}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Contact Email</span>
            </label>
            <input
              type="email"
              placeholder="growth@scalemint.com"
              value={settings?.contactEmail || ''}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Contact Phone</span>
            </label>
            <input
              type="text"
              placeholder="+1 (415) 890-3412"
              value={settings?.contactPhone || ''}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Physical Hubs / Address</span>
            </label>
            <input
              type="text"
              placeholder="San Francisco, CA & Global Hubs"
              value={settings?.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* SEO & Meta Tags */}
      <div className="p-6 rounded-3xl bg-[#0E0B1A]/80 border border-white/10 space-y-4 shadow-xl">
        <div className="pb-3 border-b border-white/10">
          <h3 className="font-heading font-bold text-white text-base">SEO Meta & Telemetry Integrations</h3>
          <p className="text-xs text-gray-400">Global meta tags, Google Analytics 4, and Meta Pixel tracker tags.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              Site Title / Brand Name
            </label>
            <input
              type="text"
              value={settings?.siteName || ''}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              Tagline
            </label>
            <input
              type="text"
              value={settings?.tagline || ''}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              Google Analytics ID (G-XXXXX)
            </label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={settings?.googleAnalyticsId || ''}
              onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
              Meta Pixel ID
            </label>
            <input
              type="text"
              placeholder="1234567890"
              value={settings?.metaPixelId || ''}
              onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
            Footer Copyright Text
          </label>
          <input
            type="text"
            value={settings?.footerText || ''}
            onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Central Media Picker Modal */}
      <MediaSelectModal
        isOpen={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setPickerTarget(null);
        }}
        onSelect={handleMediaSelected}
        title={pickerTarget === 'logo' ? 'Select Brand Logo Asset' : 'Select Browser Favicon Asset'}
      />
    </div>
  );
}
