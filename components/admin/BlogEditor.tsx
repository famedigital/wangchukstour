'use client';

import { useState, useEffect } from 'react';
import { MediaPickerModal } from './MediaPickerModal';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput, PremiumTextarea } from '@/components/ui/premium-input';
import {
  Save,
  Eye,
  Image as ImageIcon,
  Video,
  Code,
  Table,
  FileText,
  Search,
  Calendar,
  User,
  Tag,
  Hash,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  featured_image_public_id?: string;
  category: string;
  tags: string[];
  author_name: string;
  author_bio?: string;
  is_published: boolean;
  is_featured: boolean;
  published_date?: string;
  read_time?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (post: BlogPost) => Promise<void>;
  onCancel?: () => void;
}

/**
 * Enhanced Blog Editor with Cloudinary media integration, SEO preview, and rich text features
 */
export function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const [formData, setFormData] = useState<BlogPost>(
    post || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      author_name: '',
      is_published: false,
      is_featured: false,
    }
  );

  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [seoPreview, setSeoPreview] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (autoSaveStatus === 'unsaved') {
        handleAutoSave();
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timer);
  }, [formData, autoSaveStatus]);

  const handleAutoSave = async () => {
    setAutoSaveStatus('saving');
    // Here you would implement auto-save logic
    setTimeout(() => {
      setAutoSaveStatus('saved');
    }, 1000);
  };

  // Handle form changes
  const handleChange = (field: keyof BlogPost, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setAutoSaveStatus('unsaved');
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    handleChange('title', value);
    if (!formData.slug || formData.slug === '') {
      handleChange('slug', generateSlug(value));
    }
  };

  // Handle media selection from picker
  const handleMediaSelect = (media: any) => {
    if (Array.isArray(media)) {
      // Multiple selection - insert into content
      const images = media.map((m: any) => `![${m.alt_text || m.public_id}](${m.secure_url})`).join('\n');
      handleChange('content', formData.content + '\n' + images);
    } else {
      // Single selection - set as featured image
      handleChange('featured_image', media.secure_url);
      handleChange('featured_image_public_id', media.public_id);
    }
    setShowMediaPicker(false);
  };

  // Insert content blocks
  const insertBlock = (type: 'image' | 'video' | 'code' | 'table') => {
    let block = '';

    switch (type) {
      case 'image':
        setShowMediaPicker(true);
        return;
      case 'video':
        block = '\n[Video: YouTube or Vimeo URL]\n';
        break;
      case 'code':
        block = '\n```\n// Your code here\n```\n';
        break;
      case 'table':
        block = '\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n';
        break;
    }

    handleChange('content', formData.content + block);
  };

  // Calculate read time
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Handle save
  const handleSave = async (publish: boolean = false) => {
    try {
      setSaving(true);
      const postToSave = {
        ...formData,
        is_published: publish,
        read_time: calculateReadTime(formData.content),
        published_date: publish && !formData.published_date ? new Date().toISOString() : formData.published_date,
      };
      await onSave(postToSave);
    } finally {
      setSaving(false);
    }
  };

  // Available categories
  const categories = ['Travel Guide', 'Cultural', 'Festival', 'Trekking', 'Adventure', 'Spiritual', 'Food & Culture'];

  // SEO Preview
  const SEOPreview = () => (
    <div className="bg-white rounded-xl p-4 shadow-premium-sm space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
          {formData.featured_image ? (
            <img src={formData.featured_image} alt="" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <ImageIcon className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-blue-600 text-xs hover:underline truncate">
            wangchuktour.com/blog/{formData.slug || 'your-post-slug'}
          </p>
          <p className="font-medium text-gray-900 truncate">
            {formData.meta_title || formData.title || 'Your Post Title'}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {formData.meta_description || formData.excerpt || 'Your post description will appear here...'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm flex items-center gap-1 ${
            autoSaveStatus === 'saved' ? 'text-green-600' :
            autoSaveStatus === 'saving' ? 'text-amber-600' :
            'text-gray-400'
          }`}>
            {autoSaveStatus === 'saved' && <CheckCircle className="h-4 w-4" />}
            {autoSaveStatus === 'saving' && <Loader2 className="h-4 w-4 animate-spin" />}
            {autoSaveStatus === 'unsaved' && <XCircle className="h-4 w-4" />}
            {autoSaveStatus === 'saved' ? 'All changes saved' :
             autoSaveStatus === 'saving' ? 'Saving...' :
             'Unsaved changes'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <PremiumButton
            variant="secondary"
            onClick={() => setPreviewMode(!previewMode)}
            icon={<Eye className="h-4 w-4" />}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </PremiumButton>

          {onCancel && (
            <PremiumButton variant="secondary" onClick={onCancel}>
              Cancel
            </PremiumButton>
          )}

          <PremiumButton
            variant="outline"
            onClick={() => handleSave(false)}
            loading={saving}
            icon={<Save className="h-4 w-4" />}
          >
            Save Draft
          </PremiumButton>

          <PremiumButton
            variant="primary"
            onClick={() => handleSave(true)}
            loading={saving}
          >
            {formData.is_published ? 'Update' : 'Publish'}
          </PremiumButton>
        </div>
      </div>

      {!previewMode ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <div className="space-y-4">
              <PremiumInput
                label="Post Title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter your post title..."
                className="text-2xl font-bold"
              />

              <PremiumInput
                label="URL Slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="your-post-slug"
              />
            </div>

            {/* Content Editor Toolbar */}
            <div className="bg-white rounded-xl p-4 shadow-premium-sm">
              <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(220, 20, 60, 0.1)' }}>
                <button
                  onClick={() => insertBlock('image')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Insert Image"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertBlock('video')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Insert Video"
                >
                  <Video className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertBlock('code')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Insert Code Block"
                >
                  <Code className="h-4 w-4" />
                </button>
                <button
                  onClick={() => insertBlock('table')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Insert Table"
                >
                  <Table className="h-4 w-4" />
                </button>
              </div>

              <PremiumTextarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Write your blog content here... You can use Markdown syntax"
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="bg-white rounded-xl p-4 shadow-premium-sm">
              <label className="block text-sm font-medium mb-3">Featured Image</label>
              <button
                onClick={() => setShowMediaPicker(true)}
                className="w-full h-32 rounded-lg border-2 border-dashed border-gray-200 hover:border-red-300 transition-colors flex flex-col items-center justify-center gap-2"
              >
                {formData.featured_image ? (
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">Click to add image</span>
                  </>
                )}
              </button>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl p-4 shadow-premium-sm">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-lg shadow-premium-sm focus:shadow-premium-md outline-none transition-all duration-300"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl p-4 shadow-premium-sm">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()))}
                placeholder="Enter tags separated by commas"
                className="w-full px-3 py-2 rounded-lg shadow-premium-sm focus:shadow-premium-md outline-none transition-all duration-300 text-sm"
              />
            </div>

            {/* Author */}
            <div className="bg-white rounded-xl p-4 shadow-premium-sm">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Author
              </label>
              <PremiumInput
                value={formData.author_name}
                onChange={(e) => handleChange('author_name', e.target.value)}
                placeholder="Author name"
              />
            </div>

            {/* Publishing */}
            <div className="bg-white rounded-xl p-4 shadow-premium-sm">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Publishing
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => handleChange('is_featured', e.target.checked)}
                    className="rounded"
                  />
                  Featured post
                </label>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl p-4 shadow-premium-sm">
              <button
                onClick={() => setSeoPreview(!seoPreview)}
                className="flex items-center gap-2 text-sm font-medium mb-3"
              >
                <Search className="h-4 w-4" />
                SEO Preview
              </button>
              {seoPreview && (
                <div className="space-y-3">
                  <PremiumInput
                    label="SEO Title"
                    value={formData.meta_title || ''}
                    onChange={(e) => handleChange('meta_title', e.target.value)}
                    placeholder="Custom SEO title"
                  />
                  <PremiumTextarea
                    label="Meta Description"
                    value={formData.meta_description || ''}
                    onChange={(e) => handleChange('meta_description', e.target.value)}
                    placeholder="Meta description for search engines"
                    rows={3}
                  />
                  <SEOPreview />
                </div>
              )}
            </div>

            {/* Read Time */}
            <div className="bg-white rounded-xl p-4 shadow-premium-sm">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estimated read time:</span>
                <span className="font-medium">{calculateReadTime(formData.content)} min</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Preview Mode
        <div className="bg-white rounded-xl p-8 shadow-premium-sm">
          <h1 className="text-4xl font-bold mb-4">{formData.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
            <span>By {formData.author_name}</span>
            <span>•</span>
            <span>{formData.category}</span>
            <span>•</span>
            <span>{calculateReadTime(formData.content)} min read</span>
          </div>
          {formData.featured_image && (
            <img
              src={formData.featured_image}
              alt={formData.title}
              className="w-full h-96 object-cover rounded-xl mb-8"
            />
          )}
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        multiple={false}
        allowedTypes={['image']}
        currentFolder="/blog/"
      />
    </div>
  );
}