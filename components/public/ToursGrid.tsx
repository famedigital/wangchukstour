'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import {
  Clock,
  TrendingUp,
  Filter,
  X,
  Compass,
  ArrowRight,
  Mountain,
  Users,
  Sparkles,
  Camera,
  Heart,
} from 'lucide-react';

interface Tour {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  hero_image_url: string;
  thumbnail_url: string;
  category: string;
  duration: number;
  price: number;
  difficulty_level: string;
  is_featured: boolean;
  locations?: string[];
}

interface ToursGridProps {
  tours: Tour[];
}

const categories = [
  { value: 'all', label: 'All Tours', icon: Compass },
  { value: 'cultural', label: 'Cultural Tours', icon: Mountain },
  { value: 'trekking', label: 'Trekking', icon: TrendingUp },
  { value: 'festival', label: 'Festival Tours', icon: Sparkles },
  { value: 'spiritual', label: 'Spiritual Journeys', icon: Heart },
  { value: 'adventure', label: 'Adventure', icon: Camera },
];

const difficulties = ['easy', 'moderate', 'challenging'];

const durations = [
  { label: 'Short (1-5 days)', min: 1, max: 5 },
  { label: 'Medium (6-10 days)', min: 6, max: 10 },
  { label: 'Long (11+ days)', min: 11, max: 99 },
];

const priceRanges = [
  { label: 'Under $2000', min: 0, max: 2000 },
  { label: '$2000 - $2500', min: 2000, max: 2500 },
  { label: '$2500+', min: 2500, max: 99999 },
];

export function ToursGrid({ tours }: ToursGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFilter = (
    value: string,
    setter: (prev: string[]) => void,
    current: string[]
  ) => {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty([]);
    setSelectedDuration([]);
    setSelectedPriceRange([]);
    setSearchQuery('');
  };

  const filteredTours = tours.filter((tour) => {
    // Category filter
    if (selectedCategory !== 'all' && tour.category !== selectedCategory) {
      return false;
    }

    // Difficulty filter
    if (selectedDifficulty.length > 0 && !selectedDifficulty.includes(tour.difficulty_level)) {
      return false;
    }

    // Duration filter
    if (selectedDuration.length > 0) {
      const matchesDuration = selectedDuration.some((range) => {
        const [min, max] = range.split('-').map(Number);
        return tour.duration >= min && tour.duration <= max;
      });
      if (!matchesDuration) return false;
    }

    // Price filter
    if (selectedPriceRange.length > 0) {
      const matchesPrice = selectedPriceRange.some((range) => {
        const [min, max] = range.split('-').map(Number);
        return tour.price >= min && tour.price <= max;
      });
      if (!matchesPrice) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchableText = `${tour.title} ${tour.tagline} ${(tour.locations || []).join(' ')}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedDifficulty.length +
    selectedDuration.length +
    selectedPriceRange.length +
    (searchQuery ? 1 : 0);

  const categoryIcon = categories.find((c) => c.value === selectedCategory)?.icon || Compass;

  return (
    <>
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-monastery-red/20 via-background to-prayer-red/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-prayer-red/10 via-transparent to-transparent" />

        <div className="relative container pt-32 pb-16 md:pt-40 md:pb-20">
          <ScrollReveal direction="down">
            <div className="mx-auto max-w-3xl text-center">
              <Badge
                className="mb-6 px-5 py-2 text-sm font-semibold tracking-wider uppercase border-0"
                style={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                  color: '#FFFFFF'
                }}
              >
                Our Tours
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-8">
                <span className="bg-clip-text text-transparent" style={{
                  backgroundImage: 'linear-gradient(135deg, #DC143C 0%, #8B0000 50%, #D4A017 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Discover Bhutan with Us
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
                From cultural immersions to high-altitude adventures, find your perfect journey
                through the Land of the Thunder Dragon.
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto relative">
                <input
                  type="text"
                  placeholder="Search tours by destination, activity, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl shadow-lg bg-background px-6 py-4 pl-14 pr-12 text-lg outline-none focus:border-prayer-red focus:ring-2 focus:ring-prayer-red/20 transition-all shadow-lg"
                />
                <Compass className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tours Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Filters Sidebar */}
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-28 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                      <Filter className="h-5 w-5 text-white" />
                    </div>
                    Filters
                  </h2>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm font-medium hover:text-prayer-red transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="mb-4 font-bold text-lg">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.value}
                          onClick={() => setSelectedCategory(category.value)}
                          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                            selectedCategory === category.value
                              ? 'text-white shadow-lg'
                              : 'hover:bg-muted'
                          }`}
                          style={selectedCategory === category.value ? {
                            background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)'
                          } : {}}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h3 className="mb-4 font-bold text-lg">Difficulty</h3>
                  <div className="space-y-3">
                    {difficulties.map((difficulty) => (
                      <label
                        key={difficulty}
                        className="flex cursor-pointer items-center gap-3 text-sm font-medium"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDifficulty.includes(difficulty)}
                          onChange={() =>
                            toggleFilter(difficulty, setSelectedDifficulty, selectedDifficulty)
                          }
                          className="h-5 w-5 rounded border-transparent accent-prayer-red"
                          style={{ accentColor: 'var(--prayer-red)' }}
                        />
                        <span className="capitalize">{difficulty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div>
                  <h3 className="mb-4 font-bold text-lg">Duration</h3>
                  <div className="space-y-3">
                    {durations.map((duration) => (
                      <label
                        key={duration.label}
                        className="flex cursor-pointer items-center gap-3 text-sm font-medium"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDuration.includes(
                            `${duration.min}-${duration.max}`
                          )}
                          onChange={() =>
                            toggleFilter(
                              `${duration.min}-${duration.max}`,
                              setSelectedDuration,
                              selectedDuration
                            )
                          }
                          className="h-5 w-5 rounded border-transparent"
                          style={{ accentColor: 'var(--prayer-red)' }}
                        />
                        {duration.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="mb-4 font-bold text-lg">Price Range</h3>
                  <div className="space-y-3">
                    {priceRanges.map((range) => (
                      <label
                        key={range.label}
                        className="flex cursor-pointer items-center gap-3 text-sm font-medium"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPriceRange.includes(
                            `${range.min}-${range.max}`
                          )}
                          onChange={() =>
                            toggleFilter(
                              `${range.min}-${range.max}`,
                              setSelectedPriceRange,
                              selectedPriceRange
                            )
                          }
                          className="h-5 w-5 rounded border-transparent"
                          style={{ accentColor: 'var(--prayer-red)' }}
                        />
                        {range.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Tours Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="mb-8 flex items-center justify-between">
                <p className="text-muted-foreground text-lg">
                  <span className="font-bold" style={{ color: 'var(--prayer-red)' }}>
                    {filteredTours.length}
                  </span>
                  {' '}{filteredTours.length === 1 ? 'tour' : 'tours'} found
                </p>
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge
                      className="px-4 py-2 font-semibold border-0"
                      style={{
                        background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                        color: '#FFFFFF'
                      }}
                    >
                      {activeFiltersCount} filters active
                    </Badge>
                  </div>
                )}
              </div>

              {/* Tours Grid */}
              {filteredTours.length > 0 ? (
                <StaggerChildren>
                  <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredTours.map((tour) => (
                      <Link key={tour.id} href={`/tours/${tour.slug}`} className="group">
                        <div className="bg-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3">
                          {/* Image Section */}
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={tour.hero_image_url || tour.thumbnail_url}
                              alt={tour.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                            {/* Top Badges */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                              <Badge
                                className="border-0 font-semibold shadow-lg"
                                style={{
                                  background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)',
                                  color: '#FFFFFF'
                                }}
                              >
                                {tour.category}
                              </Badge>
                              {tour.is_featured && (
                                <Badge
                                  className="border-0 font-semibold shadow-lg"
                                  style={{
                                    background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)',
                                    color: '#FFFFFF'
                                  }}
                                >
                                  ⭐ Featured
                                </Badge>
                              )}
                            </div>

                            {/* Price Overlay */}
                            {tour.price > 0 && (
                              <div className="absolute bottom-4 right-4">
                                <div className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg">
                                  <div className="text-2xl font-bold" style={{ color: 'var(--prayer-red)' }}>
                                    ${tour.price}
                                  </div>
                                  <div className="text-xs text-muted-foreground text-center">per person</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="p-6">
                            <h3 className="font-heading font-bold text-xl mb-2 line-clamp-2 group-hover:text-prayer-red transition-colors">
                              {tour.title}
                            </h3>

                            {/* Quick Info */}
                            <div className="flex items-center gap-4 text-sm mb-4">
                              <div className="flex items-center gap-2 font-semibold">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, var(--prayer-red) 0%, var(--monastery-red) 100%)' }}>
                                  <Clock className="h-4 w-4 text-white" />
                                </div>
                                <span>{tour.duration}d</span>
                              </div>
                              <div className="flex items-center gap-2 font-semibold">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)' }}>
                                  <TrendingUp className="h-4 w-4 text-white" />
                                </div>
                                <span className="capitalize">{tour.difficulty_level}</span>
                              </div>
                            </div>

                            {/* Tagline */}
                            <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                              {tour.tagline}
                            </p>

                            {/* Locations */}
                            {(tour.locations && tour.locations.length > 0) && (
                              <div className="flex flex-wrap gap-2 mb-5">
                                {tour.locations.slice(0, 3).map((location) => (
                                  <Badge
                                    key={location}
                                    variant="secondary"
                                    className="text-xs font-semibold"
                                  >
                                    📍 {location}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* View Button */}
                            <div
                              className="inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-4"
                              style={{ color: 'var(--prayer-red)' }}
                            >
                              View Details
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </StaggerChildren>
              ) : (
                <div className="py-24 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Compass className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-3">No tours found</h3>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                      border: 'none'
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}