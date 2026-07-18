'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, ChevronRight, Calendar, MapPin, Users, DollarSign, Clock, TrendingUp, Star, Loader2, Eye, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FormField } from '@/components/ui/form-field';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function CategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [options, setOptions] = useState<{ slug: string; name: string }[]>([
    { slug: 'regional', name: 'Regional Tour' },
    { slug: 'international', name: 'International Tour' },
  ]);

  useEffect(() => {
    fetch('/api/admin/tour-categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.categories?.length) {
          setOptions(data.categories.map((c: any) => ({ slug: c.slug, name: c.name })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
    >
      {options.map((o) => (
        <option key={o.slug} value={o.slug}>
          {o.name}
        </option>
      ))}
    </select>
  );
}

function StatusSwitches({
  formData,
  updateField,
}: {
  formData: { is_active: boolean; is_featured: boolean; is_published: boolean };
  updateField: (field: string, value: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/40 px-4 py-3">
      <div className="flex items-center gap-2">
        <Switch
          id="tour-active"
          checked={formData.is_active}
          onCheckedChange={(v) => updateField('is_active', v)}
        />
        <Label htmlFor="tour-active" className="cursor-pointer font-normal">
          Active
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="tour-featured"
          checked={formData.is_featured}
          onCheckedChange={(v) => updateField('is_featured', v)}
        />
        <Label htmlFor="tour-featured" className="cursor-pointer font-normal">
          Featured
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="tour-published"
          checked={formData.is_published}
          onCheckedChange={(v) => updateField('is_published', v)}
        />
        <Label htmlFor="tour-published" className="cursor-pointer font-normal">
          Published
        </Label>
      </div>
    </div>
  );
}

interface TourFormProps {
  tour?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface StepConfig {
  id: string;
  title: string;
  description: string;
  icon: any;
}

const steps: StepConfig[] = [
  { id: 'basic', title: 'Basic Info', description: 'Tour details and pricing', icon: MapPin },
  { id: 'content', title: 'Content', description: 'Descriptions and highlights', icon: Star },
  { id: 'media', title: 'Media', description: 'Images and gallery', icon: Upload },
  { id: 'itinerary', title: 'Itinerary', description: 'Day-by-day plan', icon: Calendar },
  { id: 'pricing', title: 'Pricing & Options', description: 'Inclusions and dates', icon: DollarSign },
  { id: 'seo', title: 'SEO', description: 'Meta information', icon: TrendingUp },
  { id: 'preview', title: 'Preview', description: 'Review your tour', icon: Eye },
];

export function TourForm({ tour, onSubmit, onCancel }: TourFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: tour?.title || '',
    slug: tour?.slug || '',
    tagline: tour?.tagline || '',
    description: tour?.description || '',
    long_description: tour?.long_description || '',
    category: tour?.category || 'regional',
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
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{
    field: string;
    index?: number;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate current step
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix the errors before proceeding');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final submission
    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success('Tour saved successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save tour';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepIndex: number): Record<string, string> => {
    const errors: Record<string, string> = {};
    const step = steps[stepIndex];

    switch (step.id) {
      case 'basic':
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.slug.trim()) errors.slug = 'Slug is required';
        if (!formData.duration || formData.duration < 1) errors.duration = 'Duration must be at least 1 day';
        if (!formData.price || formData.price < 0) errors.price = 'Price must be positive';
        break;
      case 'content':
        if (!formData.description.trim()) errors.description = 'Short description is required';
        if (!formData.long_description.trim()) errors.long_description = 'Detailed description is required';
        break;
      case 'media':
        if (!formData.hero_image_url.trim()) errors.hero_image_url = 'Hero image is required';
        break;
    }

    return errors;
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setValidationErrors({ ...validationErrors, [field]: '' });
  };

  const addArrayItem = (field: string) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field as keyof typeof formData] as any[]), '']
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArray = [...(formData[field as keyof typeof formData] as any[])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const updateArrayItem = (field: string, index: number, value: any) => {
    const newArray = [...(formData[field as keyof typeof formData] as any[])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const openMediaPicker = (field: string, index?: number) => {
    setMediaPickerTarget({ field, index });
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (media: any) => {
    if (!mediaPickerTarget) return;

    const { field, index } = mediaPickerTarget;
    const imageUrl = typeof media === 'string' ? media : media.secure_url;

    if (index !== undefined) {
      updateArrayItem(field, index, imageUrl);
    } else {
      updateField(field, imageUrl);
    }

    setMediaPickerOpen(false);
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    updateField('slug', slug);
  };

  return (
    <div className="flex gap-6">
      {/* Steps Sidebar */}
      <div className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-4 space-y-1">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const hasError = Object.keys(validationErrors).length > 0 && index === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={cn(
                  'w-full rounded-lg border p-3 text-left transition-colors',
                  isActive
                    ? 'border-primary bg-primary/5'
                    : isCompleted
                      ? 'border-transparent bg-muted/50 hover:bg-muted'
                      : 'border-transparent opacity-60 hover:opacity-80'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'relative flex size-8 items-center justify-center rounded-md',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-4 text-primary" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                    {hasError && (
                      <div className="absolute -top-1 -right-1 size-2.5 rounded-full bg-destructive" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-sm font-medium', isActive && 'text-primary')}>
                      {step.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-4">
          <StatusSwitches formData={formData} updateField={updateField} />
        </div>
        <Card className="mb-6">
          <div className="border-b px-4 py-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-semibold">{steps[currentStep].title}</h2>
                <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>

            {/* Mobile Steps Indicator */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="hidden sm:inline">{step.title}</span>
                    {isCompleted && <Check className="ml-1 size-3" />}
                  </button>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-1.5 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Basic Info */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        label="Tour Title"
                        value={formData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="e.g., Cultural Triangle Tour"
                        required
                        error={validationErrors.title}
                      />

                      <div className="space-y-2">
                        <FormField
                          label="URL Slug"
                          value={formData.slug}
                          onChange={(e) => updateField('slug', e.target.value)}
                          placeholder="cultural-triangle-tour"
                          required
                          error={validationErrors.slug}
                        />
                        <button
                          type="button"
                          onClick={generateSlug}
                          className="text-sm text-primary hover:underline"
                        >
                          Generate from title
                        </button>
                      </div>
                    </div>

                    <FormField
                      label="Tagline"
                      value={formData.tagline}
                      onChange={(e) => updateField('tagline', e.target.value)}
                      placeholder="A short catchy phrase"
                    />

                    <div className="grid gap-6 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tour Category (nav group)</label>
                        <CategorySelect
                          value={formData.category}
                          onChange={(v) => updateField('category', v)}
                        />
                      </div>

                      <FormField
                        label="Duration (Days)"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => updateField('duration', parseInt(e.target.value))}
                        min="1"
                        required
                        error={validationErrors.duration}
                      />

                      <FormField
                        label="Price (USD)"
                        type="number"
                        value={formData.price}
                        onChange={(e) => updateField('price', parseFloat(e.target.value))}
                        min="0"
                        step="0.01"
                        required
                        error={validationErrors.price}
                      />
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <FormField
                        label="Difficulty Level"
                        value={formData.difficulty_level}
                        onChange={(e) => updateField('difficulty_level', e.target.value)}
                        select
                        options={[
                          { value: 'easy', label: 'Easy' },
                          { value: 'moderate', label: 'Moderate' },
                          { value: 'challenging', label: 'Challenging' },
                          { value: 'strenuous', label: 'Strenuous' }
                        ]}
                      />

                      <FormField
                        label="Min Group Size"
                        type="number"
                        value={formData.min_group_size}
                        onChange={(e) => updateField('min_group_size', parseInt(e.target.value))}
                        min="1"
                      />

                      <FormField
                        label="Max Group Size"
                        type="number"
                        value={formData.max_group_size}
                        onChange={(e) => updateField('max_group_size', parseInt(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Content */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <FormField
                      label="Short Description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="A brief overview for tour listings..."
                      textarea
                      rows={3}
                      required
                      error={validationErrors.description}
                    />

                    <FormField
                      label="Detailed Description"
                      value={formData.long_description}
                      onChange={(e) => updateField('long_description', e.target.value)}
                      placeholder="Full tour description with details..."
                      textarea
                      rows={8}
                      required
                      error={validationErrors.long_description}
                    />

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium">Tour Highlights</label>
                        <button
                          type="button"
                          onClick={() => addArrayItem('highlights')}
                          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                        >
                          <Plus className="h-4 w-4" />
                          Add Highlight
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.highlights.map((highlight: string, index: number) => (
                          <div key={index} className="flex gap-3">
                            <FormField
                              value={highlight}
                              onChange={(e) => updateArrayItem('highlights', index, e.target.value)}
                              placeholder="e.g., Visit Tiger's Nest Monastery"
                              className="flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('highlights', index)}
                              className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Media */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hero Image</label>
                      <div className="relative rounded-xl overflow-hidden h-64 bg-muted">
                        {formData.hero_image_url ? (
                          <img
                            src={formData.hero_image_url}
                            alt="Hero preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Upload className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => openMediaPicker('hero_image_url')}
                          className="absolute top-4 right-4 bg-white/90 hover:bg-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Change Image
                        </button>
                      </div>
                      {validationErrors.hero_image_url && (
                        <p className="text-red-600 text-sm mt-2">{validationErrors.hero_image_url}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Thumbnail Image</label>
                      <div className="relative rounded-xl overflow-hidden h-40 bg-muted">
                        {formData.thumbnail_url ? (
                          <img
                            src={formData.thumbnail_url}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => openMediaPicker('thumbnail_url')}
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          Change Image
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium">Gallery Images</label>
                        <button
                          type="button"
                          onClick={() => {
                            setMediaPickerTarget({ field: 'gallery_urls', index: formData.gallery_urls.length });
                            setMediaPickerOpen(true);
                          }}
                          className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                        >
                          <Plus className="h-4 w-4" />
                          Add Image
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.gallery_urls.map((url: string, index: number) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                              <img
                                src={url}
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeArrayItem('gallery_urls', index)}
                              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {formData.gallery_urls.length === 0 && (
                          <div className="col-span-full text-center py-8 text-muted-foreground">
                            No gallery images added yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Itinerary */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium">Daily Itinerary</label>
                      <button
                        type="button"
                        onClick={() => addArrayItem('itinerary')}
                        className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                      >
                        <Plus className="h-4 w-4" />
                        Add Day
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.itinerary.map((day: any, index: number) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                              D{index + 1}
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="grid gap-3 md:grid-cols-2">
                                <FormField
                                  label="Title"
                                  value={day.title || ''}
                                  onChange={(e) => updateArrayItem('itinerary', index, { ...day, title: e.target.value })}
                                  placeholder="e.g., Arrival in Paro"
                                />
                                <FormField
                                  label="Location"
                                  value={day.location || ''}
                                  onChange={(e) => updateArrayItem('itinerary', index, { ...day, location: e.target.value })}
                                  placeholder="e.g., Paro"
                                />
                              </div>
                              <FormField
                                label="Description"
                                value={day.description || ''}
                                onChange={(e) => updateArrayItem('itinerary', index, { ...day, description: e.target.value })}
                                textarea
                                rows={3}
                                placeholder="Day activities..."
                              />
                              <div className="grid gap-3 md:grid-cols-2">
                                <FormField
                                  label="Meals Included"
                                  value={day.meals || ''}
                                  onChange={(e) => updateArrayItem('itinerary', index, { ...day, meals: e.target.value })}
                                  placeholder="e.g., Breakfast, Lunch"
                                />
                                <FormField
                                  label="Accommodation"
                                  value={day.accommodation || ''}
                                  onChange={(e) => updateArrayItem('itinerary', index, { ...day, accommodation: e.target.value })}
                                  placeholder="e.g., Hotel Name"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeArrayItem('itinerary', index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {formData.itinerary.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl">
                        No itinerary days added yet. Click "Add Day" to start planning.
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Pricing & Options */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium">Included Items</label>
                        <button
                          type="button"
                          onClick={() => addArrayItem('included_items')}
                          className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.included_items.map((item: string, index: number) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 mt-3">
                              <Check className="h-5 w-5 text-green-600" />
                            </div>
                            <FormField
                              value={item}
                              onChange={(e) => updateArrayItem('included_items', index, e.target.value)}
                              placeholder="e.g., All accommodations"
                              className="flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('included_items', index)}
                              className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium">Excluded Items</label>
                        <button
                          type="button"
                          onClick={() => addArrayItem('excluded_items')}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.excluded_items.map((item: string, index: number) => (
                          <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 mt-3">
                              <X className="h-5 w-5 text-red-600" />
                            </div>
                            <FormField
                              value={item}
                              onChange={(e) => updateArrayItem('excluded_items', index, e.target.value)}
                              placeholder="e.g., International flights"
                              className="flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('excluded_items', index)}
                              className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: SEO */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <FormField
                      label="Meta Title"
                      value={formData.meta_title}
                      onChange={(e) => updateField('meta_title', e.target.value)}
                      placeholder="SEO title (60 characters max)"
                      maxLength={60}
                    />

                    <FormField
                      label="Meta Description"
                      value={formData.meta_description}
                      onChange={(e) => updateField('meta_description', e.target.value)}
                      placeholder="SEO description (160 characters max)"
                      textarea
                      rows={3}
                      maxLength={160}
                    />

                    <div>
                      <label className="block text-sm font-medium mb-2">Meta Keywords</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.meta_keywords.map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-lg text-sm"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => {
                                const newKeywords = formData.meta_keywords.filter((_: string, i: number) => i !== index);
                                updateField('meta_keywords', newKeywords);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Add keyword and press Enter"
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const target = e.target as HTMLInputElement;
                              if (target.value.trim()) {
                                updateField('meta_keywords', [...formData.meta_keywords, target.value.trim()]);
                                target.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Preview */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card className="overflow-hidden py-0">
                        {formData.hero_image_url && (
                          <div className="relative h-48">
                            <img
                              src={formData.hero_image_url}
                              alt={formData.title}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute top-3 right-3">
                              <span className="rounded-md bg-background/90 px-3 py-1 text-sm font-medium ring-1 ring-border">
                                ${formData.price}
                              </span>
                            </div>
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="mb-1 font-heading text-lg font-semibold">{formData.title}</h3>
                          {formData.tagline && (
                            <p className="mb-2 text-sm text-muted-foreground">{formData.tagline}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="size-4" />
                              {formData.duration} days
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="size-4" />
                              {formData.difficulty_level}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        <div>
                          <h4 className="mb-2 font-medium">Status</h4>
                          <p className="text-sm text-muted-foreground">
                            Use the Active / Featured / Published switches above the form.
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <li>Active: {formData.is_active ? 'Yes' : 'No'}</li>
                            <li>Featured: {formData.is_featured ? 'Yes' : 'No'}</li>
                            <li>Published: {formData.is_published ? 'Yes' : 'No'}</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="mb-2 font-medium">Summary</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Duration: {formData.duration} days</p>
                            <p>Price: ${formData.price}</p>
                            <p>Group size: {formData.min_group_size}-{formData.max_group_size}</p>
                            <p>Itinerary days: {formData.itinerary.length}</p>
                            <p>Gallery images: {formData.gallery_urls.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t pt-6">
              <Button type="button" onClick={onCancel} variant="outline">
                Cancel
              </Button>

              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    variant="outline"
                  >
                    Previous
                  </Button>
                )}

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      <Check className="size-4" />
                      Save Tour
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        multiple={mediaPickerTarget?.field === 'gallery_urls'}
        allowedTypes={['image']}
      />
    </div>
  );
}