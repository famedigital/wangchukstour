'use client';

import { useState } from 'react';
import { X, Upload, Plus, Trash2, ChevronDown, Calendar, MapPin, Users, DollarSign, Clock, TrendingUp, Star } from 'lucide-react';

interface TourFormProps {
  tour?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function TourForm({ tour, onSubmit, onCancel }: TourFormProps) {
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    slug: tour?.slug || '',
    tagline: tour?.tagline || '',
    description: tour?.description || '',
    long_description: tour?.long_description || '',
    category: tour?.category || 'cultural',
    duration: tour?.duration || 7,
    price: tour?.price || 0,
    difficulty_level: tour?.difficulty_level || 'moderate',
    max_group_size: tour?.max_group_size || 12,
    min_group_size: tour?.min_group_size || 2,
    hero_image_url: tour?.hero_image_url || '',
    thumbnail_url: tour?.thumbnail_url || '',
    gallery_urls: tour?.gallery_urls || [],
    highlights: tour?.highlights || [''],
    included_items: tour?.included_items || [''],
    excluded_items: tour?.excluded_items || [''],
    is_featured: tour?.is_featured || false,
    is_active: tour?.is_active || true,
    is_published: tour?.is_published || true,
    meta_title: tour?.meta_title || '',
    meta_description: tour?.meta_description || '',
    meta_keywords: tour?.meta_keywords || [],
    itinerary: tour?.itinerary || [],
    locations: tour?.locations || [],
    departure_dates: tour?.departure_dates || [],
    faqs: tour?.faqs || [],
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addArrayItem = (field: string) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field as keyof typeof formData] as string[]), '']
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArray = [...(formData[field as keyof typeof formData] as string[])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    const newArray = [...(formData[field as keyof typeof formData] as string[])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Calendar },
    { id: 'details', label: 'Tour Details', icon: MapPin },
    { id: 'media', label: 'Media', icon: Upload },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'itinerary', label: 'Itinerary', icon: Users },
    { id: 'seo', label: 'SEO', icon: Star },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl mx-4 my-8 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{tour ? 'Edit Tour' : 'Create New Tour'}</h2>
              <p className="text-gray-500 mt-1">{tour ? 'Update tour information' : 'Fill in the tour details'}</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tour Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="auto-generated from title"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="A catchy short description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Short Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Brief description for listing pages"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Long Description</label>
                <textarea
                  value={formData.long_description}
                  onChange={(e) => updateField('long_description', e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Detailed tour description"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="cultural">Cultural</option>
                    <option value="trekking">Trekking</option>
                    <option value="festival">Festival</option>
                    <option value="spiritual">Spiritual</option>
                    <option value="adventure">Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (days) *</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => updateField('duration', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty Level *</label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => updateField('difficulty_level', e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="moderate">Moderate</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Min Group Size</label>
                  <input
                    type="number"
                    value={formData.min_group_size}
                    onChange={(e) => updateField('min_group_size', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Group Size</label>
                  <input
                    type="number"
                    value={formData.max_group_size}
                    onChange={(e) => updateField('max_group_size', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    min={1}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Highlights</label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('highlights')}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                {formData.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => updateArrayItem('highlights', index, e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Tour highlight"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('highlights', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Included Items</label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('included_items')}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                {formData.included_items.map((item: string, index: number) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateArrayItem('included_items', index, e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Included item"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('included_items', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Excluded Items</label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('excluded_items')}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                {formData.excluded_items.map((item: string, index: number) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateArrayItem('excluded_items', index, e.target.value)}
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Excluded item"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('excluded_items', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Image URL</label>
                <input
                  type="url"
                  value={formData.hero_image_url}
                  onChange={(e) => updateField('hero_image_url', e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => updateField('thumbnail_url', e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Upload images through the Media Library and paste the URLs here. All images are automatically optimized by Cloudinary for best performance.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Price per Person (USD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateField('price', parseFloat(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>ℹ️ Note:</strong> You can set seasonal pricing and discounts in the Advanced Settings after creating the tour.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <p className="text-sm text-gray-600 mb-4">
                  <strong>📝 Itinerary Builder</strong>
                  <br />
                  Create a day-by-day itinerary for this tour. This will be displayed on the tour detail page.
                </p>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Day
                </button>
              </div>
              <p className="text-sm text-gray-500 italic">
                Advanced itinerary builder coming soon. For now, you can add detailed itinerary information in the Long Description field.
              </p>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => updateField('meta_title', e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="SEO title for search engines"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.meta_title.length}/60 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="SEO description for search engines"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.meta_description.length}/160 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Meta Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.meta_keywords?.join(', ')}
                  onChange={(e) => updateField('meta_keywords', e.target.value.split(',').map(k => k.trim()))}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Bhutan, tour, cultural, trekking"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => updateField('is_featured', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Featured Tour</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => updateField('is_published', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Published</span>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 rounded-xl text-white font-medium disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
              >
                {loading ? 'Saving...' : tour ? 'Update Tour' : 'Create Tour'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}