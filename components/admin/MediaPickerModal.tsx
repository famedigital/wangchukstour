'use client';

import { useState, useEffect } from 'react';
import { Search, Upload, Image as ImageIcon, X, Check, Loader2, FolderOpen, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumModal } from '@/components/ui/premium-modal';
import { PremiumButton } from '@/components/ui/premium-button';

interface MediaItem {
  public_id: string;
  url: string;
  secure_url: string;
  thumbnail_url?: string; // Optimized thumbnail URL
  format: string;
  width: number;
  height: number;
  resource_type: string;
  folder?: string;
  alt_text?: string;
  caption?: string;
  tags?: string[];
  created_at: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem | MediaItem[]) => void;
  multiple?: boolean;
  allowedTypes?: ('image' | 'video')[];
  maxSize?: number; // in bytes
  currentFolder?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  allowedTypes = ['image'],
  maxSize = 5 * 1024 * 1024, // 5MB default
  currentFolder = '/',
}: MediaPickerModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [folders, setFolders] = useState<string[]>(['All Images', 'tours', 'blog', 'about', 'hero']);
  const [currentFolderFilter, setCurrentFolderFilter] = useState('All Images');

  // Fetch media from API
  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, currentFolderFilter]);

  // Fetch media from Cloudinary via API
  const fetchMedia = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching media from Cloudinary...');

      const response = await fetch('/api/admin/media');

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, error: ${errorData.error || 'Unknown'}`);
      }

      const data = await response.json();
      console.log('📦 API Response data:', data);

      // Handle different response formats
      let fetchedMedia = data.images || data || [];
      console.log(`🖼️ Found ${fetchedMedia.length} images`);

      // Filter by folder if specified
      if (currentFolderFilter && currentFolderFilter !== 'All Images') {
        const beforeFilter = fetchedMedia.length;
        const folderName = currentFolderFilter.toLowerCase();
        fetchedMedia = fetchedMedia.filter((item: MediaItem) => {
          // Check if image starts with folder name followed by /
          const pathParts = item.public_id.split('/');
          const imageFolder = pathParts.length > 1 ? pathParts[0] : null;
          return imageFolder === folderName;
        });
        console.log(`🔍 Filtered to ${fetchedMedia.length} images (from ${beforeFilter}) for folder: ${currentFolderFilter}`);
      }

      // Filter by allowed types (skip type filtering since Cloudinary returns different types)
      // Most Cloudinary images are 'image' type but the filtering might be too strict
      const beforeTypeFilter = fetchedMedia.length;
      // fetchedMedia = fetchedMedia.filter((item: MediaItem) =>
      //   allowedTypes.includes(item.resource_type as any)
      // );
      console.log(`🎯 Skipped type filtering to show all ${fetchedMedia.length} images`);

      setMedia(fetchedMedia);
      setFilteredMedia(fetchedMedia);

      if (fetchedMedia.length === 0) {
        console.warn('⚠️ No images found after filtering');
      }
    } catch (error) {
      console.error('❌ Error fetching media:', error);
      // Set empty arrays on error to prevent crashes
      setMedia([]);
      setFilteredMedia([]);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMedia(media);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = media.filter((item) =>
        item.public_id.toLowerCase().includes(query) ||
        item.alt_text?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredMedia(filtered);
    }
  }, [searchQuery, media]);

  // Handle file upload
  const handleUpload = async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      // Validate file size
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
        continue;
      }

      // Validate file type
      if (!allowedTypes.includes(file.type.split('/')[0] as any)) {
        alert(`File type ${file.type} is not allowed`);
        continue;
      }

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', currentFolderFilter);
        formData.append('upload_preset', 'ml_default'); // Cloudinary upload preset

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const result = await response.json();
        console.log('Upload successful:', result);

        // Refresh media list after upload
        await fetchMedia();
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload file');
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    }
  };

  // Handle media selection
  const toggleSelection = (publicId: string) => {
    const newSelection = new Set(selectedMedia);
    if (newSelection.has(publicId)) {
      newSelection.delete(publicId);
    } else {
      if (!multiple) {
        newSelection.clear(); // Clear previous selection for single select
      }
      newSelection.add(publicId);
    }
    setSelectedMedia(newSelection);
  };

  // Handle confirm selection
  const handleConfirm = () => {
    const selectedItems = media.filter(item => selectedMedia.has(item.public_id));

    if (multiple) {
      onSelect(selectedItems);
    } else {
      onSelect(selectedItems[0]);
    }

    handleClose();
  };

  // Handle close
  const handleClose = () => {
    setSelectedMedia(new Set());
    setSearchQuery('');
    onClose();
  };

  // Get unique folders from media
  const getAvailableFolders = () => {
    const folderSet = new Set<string>();
    media.forEach(item => {
      if (item.folder) folderSet.add(item.folder);
    });
    return Array.from(folderSet).sort();
  };

  return (
    <PremiumModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Media Library"
      size="xl"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl shadow-premium-sm focus:shadow-premium-md outline-none transition-all duration-300"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Folder Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <FolderOpen className="h-4 w-4 text-gray-400 shrink-0" />
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setCurrentFolderFilter(folder)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                currentFolderFilter === folder
                  ? 'bg-red-50 text-red-600 shadow-premium-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-premium-sm'
              }`}
            >
              {folder === '/' ? 'All Files' : folder}
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
          <input
            type="file"
            multiple
            accept={allowedTypes.map(type => `${type}/*`).join(',')}
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            className="hidden"
            id="media-upload"
            disabled={uploading}
          />
          <label
            htmlFor="media-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
                <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-red-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  {allowedTypes.join(', ')} • Max {maxSize / 1024 / 1024}MB
                </p>
              </>
            )}
          </label>
        </div>

        {/* Media Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
            <span className="ml-3 text-gray-600">Loading media...</span>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No media found. Upload some files to get started!</p>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto'
            : 'space-y-2 max-h-96 overflow-y-auto'
          }>
            <AnimatePresence>
              {filteredMedia.map((item) => (
                <motion.div
                  key={item.public_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => toggleSelection(item.public_id)}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedMedia.has(item.public_id)
                      ? 'shadow-premium-md ring-2 ring-red-500'
                      : 'shadow-premium-sm hover:shadow-premium-md'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <img
                        src={item.thumbnail_url || item.secure_url}
                        alt={item.alt_text || item.public_id}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs truncate">{item.public_id.split('/').pop()}</p>
                          <p className="text-white/70 text-xs">
                            {item.width} × {item.height}
                          </p>
                        </div>
                      </div>
                      {selectedMedia.has(item.public_id) && (
                        <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-4 p-3 bg-white rounded-xl">
                      <img
                        src={item.secure_url}
                        alt={item.alt_text || item.public_id}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.public_id.split('/').pop()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.width} × {item.height} • {item.format.toUpperCase()}
                        </p>
                      </div>
                      {selectedMedia.has(item.public_id) && (
                        <div className="bg-red-600 rounded-full p-1">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(220, 20, 60, 0.1)' }}>
          <p className="text-sm text-gray-500">
            {selectedMedia.size > 0 && (
              <>
                {selectedMedia.size} {selectedMedia.size === 1 ? 'item' : 'items'} selected
              </>
            )}
          </p>
          <div className="flex items-center gap-3">
            <PremiumButton
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </PremiumButton>
            <PremiumButton
              variant="primary"
              onClick={handleConfirm}
              disabled={selectedMedia.size === 0}
            >
              {selectedMedia.size > 0 ? (
                <>
                  {multiple ? `Insert ${selectedMedia.size} items` : 'Insert selected'}
                </>
              ) : (
                'Select'
              )}
            </PremiumButton>
          </div>
        </div>
      </div>
    </PremiumModal>
  );
}