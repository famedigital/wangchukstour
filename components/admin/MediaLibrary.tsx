'use client';

import { useState, useEffect } from 'react';
import { Upload, Search, Filter, Trash2, Edit, Download, Eye, Grid3X3, List, X } from 'lucide-react';

interface MediaItem {
  id: string;
  public_id: string;
  url: string;
  secure_url: string;
  title: string;
  alt_text?: string;
  caption?: string;
  format: string;
  width: number;
  height: number;
  resource_type: string;
  folder: string;
  tags: string[];
  file_size: number;
  created_at: string;
}

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMediaDetail, setShowMediaDetail] = useState<MediaItem | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Fetch media on mount and when filters change
  useEffect(() => {
    fetchMedia();
  }, [pagination.page, filterType, searchQuery]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '20',
      });

      if (filterType !== 'all') {
        params.append('resource_type', filterType);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await response.json();

      setMedia(data.media || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      formData.append('folder', 'wangchuk-tour');

      const response = await fetch('/api/admin/media/bulk', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchMedia(); // Refresh media list
        setShowUploadModal(false);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedMedia.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedMedia.size} item(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedMedia).map(id =>
          fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
        )
      );

      setSelectedMedia(new Set());
      await fetchMedia();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const toggleSelectMedia = (id: string) => {
    const newSelected = new Set(selectedMedia);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMedia(newSelected);
  };

  const selectAll = () => {
    if (selectedMedia.size === media.length) {
      setSelectedMedia(new Set());
    } else {
      setSelectedMedia(new Set(media.map(m => m.id)));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading && media.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1">{pagination.total} items</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
        >
          <Upload className="w-5 h-5" />
          Upload Media
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>

          {/* View Mode */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          {selectedMedia.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-5 h-5" />
              Delete ({selectedMedia.size})
            </button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {media.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
          {/* Select All */}
          <div className="col-span-full flex items-center gap-2 p-2">
            <input
              type="checkbox"
              checked={selectedMedia.size === media.length}
              onChange={selectAll}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-600">Select All</span>
          </div>

          {media.map((item) => (
            <div
              key={item.id}
              className={`relative group bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow ${
                selectedMedia.has(item.id) ? 'ring-2 ring-red-500' : ''
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedMedia.has(item.id)}
                onChange={() => toggleSelectMedia(item.id)}
                className="absolute top-3 left-3 z-10 w-4 h-4 rounded"
              />

              {/* Thumbnail */}
              <div
                className="aspect-square bg-gray-100 cursor-pointer"
                onClick={() => setShowMediaDetail(item)}
              >
                {item.resource_type === 'image' ? (
                  <img
                    src={item.secure_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <VideoIcon />
                    </div>
                  </div>
                )}
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              {viewMode === 'list' && (
                <div className="p-4">
                  <h3 className="font-medium text-sm truncate">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.width}×{item.height} • {formatFileSize(item.file_size)}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Upload className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
          <p className="text-gray-500 mb-6">Upload your first media file to get started</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
          >
            <Upload className="w-5 h-5" />
            Upload Media
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upload Media</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-red-500 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileUpload(e.dataTransfer.files);
              }}
            >
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop files here, or{' '}
                <label className="text-red-600 cursor-pointer hover:underline">
                  browse
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">PNG, JPG, GIF, MP4 up to 10MB each</p>
            </div>

            {uploading && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Uploading...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Media Detail Modal */}
      {showMediaDetail && (
        <MediaDetailModal
          media={showMediaDetail}
          onClose={() => setShowMediaDetail(null)}
          onRefresh={fetchMedia}
        />
      )}
    </div>
  );
}

// Video icon component
function VideoIcon() {
  return (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

// Media Detail Modal Component
function MediaDetailModal({ media, onClose, onRefresh }: { media: MediaItem; onClose: () => void; onRefresh: () => void }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: media.title,
    alt_text: media.alt_text || '',
    caption: media.caption || '',
    tags: media.tags?.join(', ') || '',
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/media/${media.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        setEditing(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to update media:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Media Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="bg-gray-100 rounded-lg p-4">
            {media.resource_type === 'image' ? (
              <img src={media.secure_url} alt={media.title} className="w-full rounded" />
            ) : (
              <div className="aspect-video flex items-center justify-center">
                <VideoIcon />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Caption</label>
                  <textarea
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold text-lg">{media.title}</h3>
                  <p className="text-sm text-gray-500">{media.folder}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Dimensions:</span>
                    <p>{media.width}×{media.height}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <p>{(media.file_size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Format:</span>
                    <p className="uppercase">{media.format}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <p className="capitalize">{media.resource_type}</p>
                  </div>
                </div>
                {media.alt_text && (
                  <div>
                    <span className="text-gray-500 text-sm">Alt Text:</span>
                    <p className="text-sm">{media.alt_text}</p>
                  </div>
                )}
                {media.caption && (
                  <div>
                    <span className="text-gray-500 text-sm">Caption:</span>
                    <p className="text-sm">{media.caption}</p>
                  </div>
                )}
                {media.tags && media.tags.length > 0 && (
                  <div>
                    <span className="text-gray-500 text-sm">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {media.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => window.open(media.secure_url, '_blank')}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Download
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}