'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumInput } from '@/components/ui/premium-input';
import { Loader2, Save, Plus, Trash2, Image as ImageIcon, GripVertical } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { StaggerChildren } from '@/components/ui/scroll-reveal';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';

interface AboutContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    cta: {
      text: string;
      link: string;
    };
  };
  story: {
    title: string;
    content: string;
    founded: string;
  };
  values: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  statistics: Array<{
    number: string;
    label: string;
  }>;
  timeline: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  team: Array<{
    name: string;
    role: string;
    bio: string;
    image: string;
  }>;
}

const defaultContent: AboutContent = {
  hero: {
    title: 'Discover the Last Shangri-La',
    subtitle: 'Experience authentic Bhutanese culture and breathtaking Himalayan landscapes',
    backgroundImage: 'https://res.cloudinary.com/hckgrdeh/image/upload/v1782911267/tigernest_paro_wdenqu.jpg',
    cta: {
      text: 'Explore Our Tours',
      link: '/tours'
    }
  },
  story: {
    title: 'Our Story',
    content: 'Wangchuk Tours & Treks is a Bhutanese-owned and operated tour company dedicated to showing travelers the authentic beauty of the Land of the Thunder Dragon.',
    founded: '2010'
  },
  values: [],
  statistics: [],
  timeline: [],
  team: []
};

export function AboutPageForm() {
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{
    section: string;
    field: string;
    index?: number;
  } | null>(null);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content?type=about');
      const data = await response.json();

      if (response.ok && data.content) {
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching About content:', error);
      toast.error('Failed to load About page content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType: 'about',
          content,
          metadata: {
            seoTitle: 'About Us - Wangchuk Tours & Treks',
            seoDescription: 'Learn about our story, values, and the team behind authentic Bhutanese travel experiences.'
          }
        })
      });

      if (response.ok) {
        toast.success('About page updated successfully!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving About content:', error);
      toast.error('Failed to save About page content');
    } finally {
      setSaving(false);
    }
  };

  const openMediaPicker = (section: string, field: string, index?: number) => {
    setMediaPickerTarget({ section, field, index });
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (media: any) => {
    if (!mediaPickerTarget) return;

    const { section, field, index } = mediaPickerTarget;
    const imageUrl = typeof media === 'string' ? media : media.secure_url;

    setContent(prev => {
      const updated = { ...prev };
      if (index !== undefined) {
        (updated as any)[section][index][field] = imageUrl;
      } else {
        (updated as any)[section][field] = imageUrl;
      }
      return updated;
    });

    setMediaPickerOpen(false);
  };

  const updateSection = <K extends keyof AboutContent>(section: K, data: AboutContent[K]) => {
    setContent(prev => ({ ...prev, [section]: data }));
  };

  const addArrayItem = (section: keyof AboutContent, defaultItem: any) => {
    setContent(prev => ({
      ...prev,
      [section]: [...(prev[section] as any[]), defaultItem]
    }));
  };

  const updateArrayItem = (section: keyof AboutContent, index: number, field: string, value: any) => {
    setContent(prev => {
      const updated = [...(prev[section] as any[])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [section]: updated };
    });
  };

  const removeArrayItem = (section: keyof AboutContent, index: number) => {
    setContent(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-prayer-red" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">About Page Content</h2>
          <p className="text-muted-foreground">Manage your About page content and information</p>
        </div>
        <PremiumButton
          onClick={handleSave}
          disabled={saving}
          className="min-w-[140px]"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </PremiumButton>
      </div>

      <StaggerChildren>
        {/* Hero Section */}
        <ScrollReveal>
          <PremiumCard className="p-6">
            <div className="mb-6">
              <h3 className="font-heading text-xl font-bold mb-2">Hero Section</h3>
              <p className="text-muted-foreground text-sm">Main banner content and background image</p>
            </div>

            <div className="space-y-4">
              <PremiumInput
                label="Title"
                value={content.hero.title}
                onChange={(e) => updateSection('hero', { ...content.hero, title: e.target.value })}
                placeholder="Hero title"
              />

              <PremiumInput
                label="Subtitle"
                value={content.hero.subtitle}
                onChange={(e) => updateSection('hero', { ...content.hero, subtitle: e.target.value })}
                placeholder="Hero subtitle"
                textarea
                rows={2}
              />

              <div>
                <label className="block text-sm font-medium mb-2">Background Image</label>
                <div className="relative rounded-xl overflow-hidden h-48 bg-muted">
                  {content.hero.backgroundImage ? (
                    <Image
                      src={content.hero.backgroundImage}
                      alt="Background"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <button
                    onClick={() => openMediaPicker('hero', 'backgroundImage')}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <PremiumInput
                  label="CTA Button Text"
                  value={content.hero.cta.text}
                  onChange={(e) => updateSection('hero', {
                    ...content.hero,
                    cta: { ...content.hero.cta, text: e.target.value }
                  })}
                  placeholder="e.g., Explore Our Tours"
                />

                <PremiumInput
                  label="CTA Button Link"
                  value={content.hero.cta.link}
                  onChange={(e) => updateSection('hero', {
                    ...content.hero,
                    cta: { ...content.hero.cta, link: e.target.value }
                  })}
                  placeholder="e.g., /tours"
                />
              </div>
            </div>
          </PremiumCard>
        </ScrollReveal>

        {/* Story Section */}
        <ScrollReveal>
          <PremiumCard className="p-6">
            <div className="mb-6">
              <h3 className="font-heading text-xl font-bold mb-2">Our Story</h3>
              <p className="text-muted-foreground text-sm">Company story and founding information</p>
            </div>

            <div className="space-y-4">
              <PremiumInput
                label="Section Title"
                value={content.story.title}
                onChange={(e) => updateSection('story', { ...content.story, title: e.target.value })}
                placeholder="e.g., Our Story"
              />

              <PremiumInput
                label="Story Content"
                value={content.story.content}
                onChange={(e) => updateSection('story', { ...content.story, content: e.target.value })}
                placeholder="Your company story..."
                textarea
                rows={6}
              />

              <PremiumInput
                label="Founded Year"
                value={content.story.founded}
                onChange={(e) => updateSection('story', { ...content.story, founded: e.target.value })}
                placeholder="e.g., 2010"
              />
            </div>
          </PremiumCard>
        </ScrollReveal>

        {/* Values Section */}
        <ScrollReveal>
          <PremiumCard className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold mb-2">Our Values</h3>
                <p className="text-muted-foreground text-sm">Core values and principles</p>
              </div>
              <PremiumButton
                onClick={() => addArrayItem('values', { title: '', description: '' })}
                className="min-w-[120px]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Value
              </PremiumButton>
            </div>

            <div className="space-y-4">
              {content.values.map((value, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-muted/50 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1 space-y-3">
                      <PremiumInput
                        label="Value Title"
                        value={value.title}
                        onChange={(e) => updateArrayItem('values', index, 'title', e.target.value)}
                        placeholder="e.g., Authentic Experiences"
                      />

                      <PremiumInput
                        label="Description"
                        value={value.description}
                        onChange={(e) => updateArrayItem('values', index, 'description', e.target.value)}
                        placeholder="Describe this value..."
                        textarea
                        rows={2}
                      />
                    </div>
                    <button
                      onClick={() => removeArrayItem('values', index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </PremiumCard>
        </ScrollReveal>

        {/* Statistics Section */}
        <ScrollReveal>
          <PremiumCard className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold mb-2">Statistics</h3>
                <p className="text-muted-foreground text-sm">Key numbers and achievements</p>
              </div>
              <PremiumButton
                onClick={() => addArrayItem('statistics', { number: '', label: '' })}
                className="min-w-[120px]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Stat
              </PremiumButton>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative p-4 rounded-xl bg-muted/50 space-y-2"
                >
                  <button
                    onClick={() => removeArrayItem('statistics', index)}
                    className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>

                  <PremiumInput
                    label="Number"
                    value={stat.number}
                    onChange={(e) => updateArrayItem('statistics', index, 'number', e.target.value)}
                    placeholder="e.g., 500+"
                  />

                  <PremiumInput
                    label="Label"
                    value={stat.label}
                    onChange={(e) => updateArrayItem('statistics', index, 'label', e.target.value)}
                    placeholder="e.g., Happy Travelers"
                  />
                </motion.div>
              ))}
            </div>
          </PremiumCard>
        </ScrollReveal>

        {/* Timeline Section */}
        <ScrollReveal>
          <PremiumCard className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold mb-2">Timeline</h3>
                <p className="text-muted-foreground text-sm">Company milestones and history</p>
              </div>
              <PremiumButton
                onClick={() => addArrayItem('timeline', { year: '', title: '', description: '' })}
                className="min-w-[120px]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </PremiumButton>
            </div>

            <div className="space-y-4">
              {content.timeline.map((event, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-muted/50 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <PremiumInput
                      label="Year"
                      value={event.year}
                      onChange={(e) => updateArrayItem('timeline', index, 'year', e.target.value)}
                      placeholder="e.g., 2010"
                    />

                    <PremiumInput
                      label="Title"
                      value={event.title}
                      onChange={(e) => updateArrayItem('timeline', index, 'title', e.target.value)}
                      placeholder="e.g., Company Founded"
                    />

                    <PremiumInput
                      label="Description"
                      value={event.description}
                      onChange={(e) => updateArrayItem('timeline', index, 'description', e.target.value)}
                      placeholder="Describe this milestone..."
                      textarea
                      rows={2}
                    />
                    </div>
                    <button
                      onClick={() => removeArrayItem('timeline', index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </PremiumCard>
        </ScrollReveal>

        {/* Team Section */}
        <ScrollReveal>
          <PremiumCard className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold mb-2">Team Members</h3>
                <p className="text-muted-foreground text-sm">Your team and leadership</p>
              </div>
              <PremiumButton
                onClick={() => addArrayItem('team', { name: '', role: '', bio: '', image: '' })}
                className="min-w-[120px]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </PremiumButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.team.map((member, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl bg-muted/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => openMediaPicker('team', 'image', index)}
                        className="text-sm text-prayer-red hover:underline"
                      >
                        {member.image ? 'Change Photo' : 'Add Photo'}
                      </button>
                    </div>
                    <button
                      onClick={() => removeArrayItem('team', index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <PremiumInput
                    label="Name"
                    value={member.name}
                    onChange={(e) => updateArrayItem('team', index, 'name', e.target.value)}
                    placeholder="e.g., Wangchuk Dorji"
                  />

                  <PremiumInput
                    label="Role"
                    value={member.role}
                    onChange={(e) => updateArrayItem('team', index, 'role', e.target.value)}
                    placeholder="e.g., Founder & Director"
                  />

                  <PremiumInput
                    label="Bio"
                    value={member.bio}
                    onChange={(e) => updateArrayItem('team', index, 'bio', e.target.value)}
                    placeholder="Brief biography..."
                    textarea
                    rows={3}
                  />
                </motion.div>
              ))}
            </div>
          </PremiumCard>
        </ScrollReveal>
      </StaggerChildren>

      {/* Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        multiple={false}
        allowedTypes={['image']}
      />
    </div>
  );
}