'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Search, Image as ImageIcon, Check, Loader2 } from 'lucide-react';

interface MediaAsset {
  id: string;
  filename: string;
  originalFilename: string;
  publicUrl: string;
  mimeType: string;
  fileSize: number;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  category: string;
}

interface MediaSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  categoryFilter?: string;
  title?: string;
}

export default function MediaSelectModal({
  isOpen,
  onClose,
  onSelect,
  categoryFilter,
  title = 'Central Media Library',
}: MediaSelectModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const fetchAssets = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/media?';
      if (categoryFilter) url += `category=${categoryFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setAssets(data.data);
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen, search, categoryFilter]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', categoryFilter || 'general');

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload media');
      }

      await fetchAssets();
      setSelectedAsset(data.data);
      // Seamless UX: Auto-select and apply newly uploaded image
      onSelect(data.data);
      onClose();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-agency-surface border border-agency-border rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-agency-border flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              <span>{title}</span>
            </h3>
            <p className="text-xs text-gray-400">
              Select an image from the library or upload a new asset.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-agency-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-agency-border bg-agency-dark/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search filename or alt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-agency-card border border-agency-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <label className="cursor-pointer px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm">
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Optimizing & Saving...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload & Use New Image</span>
              </>
            )}
            <input
              type="file"
              accept="image/*,.svg,.webp,.png,.jpg,.jpeg,.avif,.ico"
              className="hidden"
              disabled={uploading}
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {uploadError && (
          <div className="mx-6 mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
            {uploadError}
          </div>
        )}

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              <span>Loading media assets...</span>
            </div>
          ) : assets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-agency-card flex items-center justify-center border border-agency-border text-gray-500">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-semibold text-white text-base">
                No Media Assets Found
              </h4>
              <p className="text-xs text-gray-400 max-w-sm">
                Upload your first image above. All assets are automatically converted to optimized WebP format with dimensions preserved.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {assets.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-500 ring-2 ring-purple-500/50 bg-purple-950/20'
                        : 'border-agency-border bg-agency-card hover:border-gray-600'
                    }`}
                  >
                    <div className="aspect-video w-full bg-agency-dark flex items-center justify-center overflow-hidden">
                      <img
                        src={asset.publicUrl}
                        alt={asset.altText || asset.originalFilename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs text-white font-medium truncate">
                        {asset.originalFilename}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {asset.width && asset.height
                          ? `${asset.width}x${asset.height} • `
                          : ''}
                        {(asset.fileSize / 1024).toFixed(0)} KB
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-agency-border bg-agency-dark/70 flex items-center justify-between">
          <div className="text-xs text-gray-400 truncate max-w-sm">
            {selectedAsset ? (
              <span>
                Selected:{' '}
                <strong className="text-white">
                  {selectedAsset.originalFilename}
                </strong>
              </span>
            ) : (
              <span>Click on an asset to select it</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-agency-card border border-agency-border hover:bg-agency-cardHover transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedAsset}
              onClick={() => {
                if (selectedAsset) {
                  onSelect(selectedAsset);
                  onClose();
                }
              }}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-glow-purple disabled:opacity-40 transition-all"
            >
              Use Selected Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
