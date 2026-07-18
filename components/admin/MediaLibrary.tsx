'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Search, Trash2, Copy, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  public_id: string;
  url: string;
  secure_url: string;
  thumbnail_url?: string;
  name?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  created_at?: string;
}

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/media?maxResults=200');
      if (!response.ok) throw new Error('Failed to load media');
      const data = await response.json();
      const items = (data.media || data.images || []).map((item: any) => ({
        ...item,
        id: item.id || item.public_id,
        secure_url: item.secure_url || item.url,
        url: item.url || item.secure_url,
      }));
      setMedia(items);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load media library');
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const filtered = media.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.public_id.toLowerCase().includes(q) ||
      (item.name || '').toLowerCase().includes(q)
    );
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'wangchuk-tour');
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || `Failed to upload ${file.name}`);
        }
      }
      toast.success('Upload complete');
      await fetchMedia();
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} image(s) from Cloudinary?`)) return;
    setDeleting(true);
    try {
      await Promise.all(
        Array.from(selected).map((publicId) =>
          fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, { method: 'DELETE' })
        )
      );
      toast.success('Deleted');
      setSelected(new Set());
      await fetchMedia();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success('URL copied');
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images..."
            className="w-full min-h-11 pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {selected.size > 0 && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete ({selected.size})
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
          Loading media...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-500 border border-dashed rounded-2xl">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No images yet</p>
          <p className="text-sm mt-1">Upload images to use across blog, hero, and tours.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {filtered.map((item) => {
            const isSelected = selected.has(item.public_id);
            return (
              <div
                key={item.public_id}
                className={`relative group rounded-xl overflow-hidden border bg-white ${
                  isSelected ? 'ring-2 ring-red-500 border-red-500' : 'border-gray-200'
                }`}
              >
                <button type="button" className="block w-full aspect-square" onClick={() => toggle(item.public_id)}>
                  <img
                    src={item.thumbnail_url || item.secure_url}
                    alt={item.name || item.public_id}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
                {isSelected && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <div className="p-2 flex items-center justify-between gap-1">
                  <p className="text-xs text-gray-600 truncate flex-1">{item.name || item.public_id}</p>
                  <button
                    type="button"
                    onClick={() => copyUrl(item.secure_url)}
                    className="min-h-9 min-w-9 inline-flex items-center justify-center rounded-lg hover:bg-gray-100"
                    title="Copy URL"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
