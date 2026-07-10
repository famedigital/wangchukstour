'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import {
  Clock,
  TrendingUp,
  Filter,
  X,
  Mountain,
  Users,
  Sparkles,
  Camera,
  Heart,
  Compass,
  ArrowRight,
  Mail,
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

export function ToursPageClient({ tours }: { tours: any[] }) {
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
      const searchableText = `${tour.title} ${tour.description || ''} ${tour.tagline || ''} ${tour.locations?.join(' ') || ''}`.toLowerCase();
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
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      <main className="flex-1">
        {/* Tours Content */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-b from-gray-200 via-gray-100 to-white">
          <div className="container">
            {/* Search Bar */}
            <div className="mb-16 max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl shadow-xl bg-white px-6 py-4 pl-14 pr-14 text-lg text-gray-900 outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder:text-gray-400"
                />
                <Compass className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-3 text-sm text-gray-500 text-center">
                  Showing results for "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Tours Grid */}
          <div className="container mx-auto px-4">
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-gray-900 text-2xl font-bold">
                  {filteredTours.length} {filteredTours.length === 1 ? 'Tour' : 'Tours'}
                </p>
                <p className="text-gray-500 text-sm mt-1">Discover your perfect Bhutan adventure</p>
              </div>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-3">
                  <Badge
                    className="px-4 py-2 font-semibold border-0 shadow-md bg-red-600 text-white"
                  >
                    {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'}
                  </Badge>
                </div>
              )}
            </div>

            {/* Tours Grid */}
            {filteredTours.length > 0 ? (
              <StaggerChildren>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredTours.map((tour, index) => (
                    <div key={tour.id} className="group relative">
                      <Link href={`/tours/${tour.slug}`} className="block">
                        <div className="relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                          {/* Image Layer */}
                          <img
                            src={tour.hero_image_url || tour.thumbnail_url || '/placeholder.jpg'}
                            alt={tour.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Category Badge */}
                          <div className="absolute top-4 right-4 z-20">
                            <Badge
                              className="px-3 py-1.5 text-xs font-semibold shadow-md bg-red-600 text-white border-0"
                            >
                              {tour.category}
                            </Badge>
                          </div>

                          {/* Price Badge */}
                          {tour.price > 0 && (
                            <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
                              <div className="text-xs text-gray-500 mb-1">Starting from</div>
                              <div className="text-lg font-bold text-red-600">
                                ${tour.price}
                              </div>
                              <div className="text-xs text-gray-600 text-center">per person</div>
                            </div>
                          )}

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 via-black/30 to-transparent z-10" />

                          {/* Content Overlay */}
                          <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between">
                            {/* Top Spacer */}
                            <div className="h-12" />

                            {/* Bottom Content */}
                            <div className="flex flex-col gap-3">
                              {/* Title */}
                              <h3 className="text-base font-heading font-bold text-white leading-tight line-clamp-2">
                                {tour.title}
                              </h3>

                              {/* Meta Info */}
                              <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1.5 text-white/90">
                                  <Clock className="w-3.5 h-3.5" style={{ color: '#DC143C' }} />
                                  <span>{tour.duration} days</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-white/90">
                                  <TrendingUp className="w-3.5 h-3.5" style={{ color: '#DC143C' }} />
                                  <span className="capitalize">{tour.difficulty_level}</span>
                                </div>
                              </div>

                              {/* CTA Button */}
                              <button className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 text-xs whitespace-nowrap group-hover:scale-105 self-start">
                                View Details
                                <ArrowRight className="inline-block ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </StaggerChildren>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Compass className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3 text-gray-900">No tours found</h3>
                <p className="text-gray-500 mb-8 text-base max-w-md mx-auto">
                  Try adjusting your search to discover more tours.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Custom Tour CTA */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-28 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://res.cloudinary.com/hckgrdeh/image/upload/v1782965945/punakhadzong_xkcrcu.jpg"
              alt="Punakha Dzong"
              className="w-full h-full object-cover"
            />
            {/* Dark Gradient Overlay - Balanced for text readability and image visibility */}
            <div className="absolute inset-0 bg-black z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }} />
          </div>

          <div className="relative container z-20">
            <ScrollReveal>
              <div className="mx-auto max-w-4xl text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                  Can't Find What You're Looking For?
                </h2>
                <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
                  Let us craft a custom Bhutanese experience tailored to your interests, schedule, and preferences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <MagneticButton
                      className="rounded-xl px-8 py-4 text-base font-semibold shadow-xl"
                      style={{
                        background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                        border: 'none',
                        color: '#FFFFFF'
                      }}
                    >
                      Request Custom Tour
                      <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                  </Link>
                  <Link href="/contact">
                    <MagneticButton
                      className="rounded-xl px-8 py-4 text-base font-semibold shadow-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20"
                    >
                      Contact Us
                      <Mail className="w-5 h-5" />
                    </MagneticButton>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}