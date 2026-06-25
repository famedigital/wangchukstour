'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockTours } from '@/lib/mock-data/tours';
import {
  Clock,
  TrendingUp,
  Calendar,
  DollarSign,
  Filter,
  X,
  Mountain,
  Users,
  Sparkles,
  Camera,
  Heart,
  Compass,
} from 'lucide-react';

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

export default function ToursPage() {
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

  const filteredTours = mockTours.filter((tour) => {
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
      const searchableText = `${tour.title} ${tour.description} ${tour.tagline} ${tour.locations.join(' ')}`.toLowerCase();
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
    <div className="flex min-h-screen flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4">Our Tours</Badge>
              <h1 className="font-heading text-4xl font-bold md:text-5xl lg:text-6xl">
                Discover Bhutan with Us
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                From cultural immersions to high-altitude adventures, find your perfect journey
                through the Land of the Thunder Dragon.
              </p>

              {/* Search Bar */}
              <div className="mt-8 relative">
                <input
                  type="text"
                  placeholder="Search tours by destination, activity, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-3 pl-12 pr-4 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Compass className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tours Content */}
        <section className="py-12 bg-background">
          <div className="container px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-64 shrink-0">
                <div className="sticky top-24 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </h2>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div>
                    <h3 className="mb-3 font-medium">Category</h3>
                    <div className="space-y-2">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <button
                            key={category.value}
                            onClick={() => setSelectedCategory(category.value)}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                              selectedCategory === category.value
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {category.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <h3 className="mb-3 font-medium">Difficulty</h3>
                    <div className="space-y-2">
                      {difficulties.map((difficulty) => (
                        <label
                          key={difficulty}
                          className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={selectedDifficulty.includes(difficulty)}
                            onChange={() =>
                              toggleFilter(difficulty, setSelectedDifficulty, selectedDifficulty)
                            }
                            className="h-4 w-4 rounded border-input accent-primary"
                          />
                          <span className="capitalize">{difficulty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <h3 className="mb-3 font-medium">Duration</h3>
                    <div className="space-y-2">
                      {durations.map((duration) => (
                        <label
                          key={duration.label}
                          className="flex cursor-pointer items-center gap-2 text-sm"
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
                            className="h-4 w-4 rounded border-input accent-primary"
                          />
                          {duration.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h3 className="mb-3 font-medium">Price Range</h3>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label
                          key={range.label}
                          className="flex cursor-pointer items-center gap-2 text-sm"
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
                            className="h-4 w-4 rounded border-input accent-primary"
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
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {filteredTours.length} {filteredTours.length === 1 ? 'tour' : 'tours'} found
                  </p>
                  {activeFiltersCount > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">{activeFiltersCount} filters active</Badge>
                    </div>
                  )}
                </div>

                {/* Tours Grid */}
                {filteredTours.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredTours.map((tour) => (
                      <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48 bg-muted">
                          <img
                            src={tour.hero_image}
                            alt={tour.title}
                            className="h-full w-full object-cover"
                          />
                          <Badge className="absolute top-4 right-4 bg-primary">
                            {tour.category}
                          </Badge>
                          {tour.is_featured && (
                            <Badge className="absolute top-4 left-4 bg-accent">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <CardHeader>
                          <CardTitle className="font-heading line-clamp-1">{tour.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{tour.tagline}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{tour.duration} days</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span className="capitalize">{tour.difficulty_level}</span>
                            </div>
                            {tour.tour_type === 'custom' && (
                              <Badge variant="outline" className="text-xs">
                                Custom
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {tour.locations.slice(0, 3).map((location) => (
                              <Badge key={location} variant="secondary" className="text-xs">
                                {location}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {tour.description}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <div>
                            {tour.price > 0 ? (
                              <>
                                <span className="text-2xl font-bold text-primary">
                                  ${tour.price}
                                </span>
                                <span className="text-sm text-muted-foreground">/person</span>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">Custom pricing</span>
                            )}
                          </div>
                          <Link
                            href={`/tours/${tour.slug}`}
                            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
                          >
                            View Details
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Compass className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-2">No tours found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters to find what you're looking for.
                    </p>
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Custom Tour CTA */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h2 className="font-heading text-2xl font-bold mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-muted-foreground mb-6">
                Let us craft a custom Bhutanese experience tailored to your interests, schedule, and
                preferences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-10 py-6 text-lg font-medium text-primary-foreground transition-all hover:bg-primary/80"
                >
                  Request Custom Tour
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-background px-10 py-6 text-lg font-medium text-foreground transition-all hover:bg-muted"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
