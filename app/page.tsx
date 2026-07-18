import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Badge } from '@/components/ui/badge';
import { getFeaturedTours, getActiveHeroSlides, getFeaturedTestimonials } from '@/lib/database';
import { HeroSlideshow } from '@/components/public/HeroSlideshow';
import { TestimonialsSection } from '@/components/public/TestimonialsSection';

// Force dynamic rendering for this page since it uses cookies
export const dynamic = 'force-dynamic';
import { DifferentiatorsSection } from '@/components/public/DifferentiatorsSection';
import { TourCard } from '@/components/public/TourCard';
import { CTASection } from '@/components/public/CTASection';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: 'Wangchuks Tours & Treks - Discover the Last Shangri-La',
  description: 'Experience authentic Bhutan with Wangchuks Tours & Treks. Cultural journeys, trekking adventures, and festival tours in the Land of the Thunder Dragon.',
  keywords: ['Bhutan tour', 'Bhutan travel', 'Bhutan trekking', 'Bhutan festival', 'Wangchuks Tours & Treks', 'Bhutan adventures'],
  openGraph: {
    title: 'Wangchuks Tours & Treks - Discover the Last Shangri-La',
    description: 'Experience authentic Bhutan with Wangchuks Tours & Treks. Cultural journeys, trekking adventures, and festival tours in the Land of the Thunder Dragon.',
    type: 'website',
  },
};

const fallbackTestimonials = [
  {
    name: 'Sarah & Michael',
    location: 'Sydney, Australia',
    text: 'The journey to Tiger\'s Nest was transformative. Wangchuks Tours & Treks made every moment magical with their authentic approach and deep knowledge of Bhutan.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    name: 'James Chen',
    location: 'Singapore',
    text: 'The Druk Path Trek exceeded all expectations. Professional guides, stunning campsites, and an authentic experience of the Himalayas.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    name: 'Emma Laurent',
    location: 'Paris, France',
    text: 'The Paro Tsechu festival experience was incredible. The access we got and the cultural insights from our guide were priceless.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

export default async function HomePage() {
  const [featuredTours, heroSlides, dbTestimonials] = await Promise.all([
    getFeaturedTours(),
    getActiveHeroSlides(),
    getFeaturedTestimonials(),
  ]);

  const testimonials =
    dbTestimonials.length > 0
      ? dbTestimonials.map((t) => ({
          name: t.name,
          location: t.location,
          text: t.text,
          rating: t.rating,
          image: t.image_url,
        }))
      : fallbackTestimonials;

  return (
    <div className="flex min-h-screen flex-col bg-background safe-bottom-padding lg:pb-0">
      <Navigation />

      {/* === IMMERSIVE HERO SECTION WITH SLIDESHOW === */}
      <HeroSlideshow slides={heroSlides} autoPlay={true} interval={6000} />

      {/* === FEATURED TOURS === */}
      <section className="relative bg-muted py-14 md:py-20">
        <div className="container">
          <ScrollReveal>
            <div className="mb-10 text-center md:mb-12">
              <Badge className="mb-4 border-transparent bg-primary text-primary-foreground">
                Popular Tours
              </Badge>
              <h2 className="mb-3 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Featured <span className="text-primary">Journeys</span>
              </h2>
              <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
                Our most loved experiences, crafted with care and attention to every detail.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.length > 0 ? (
              featuredTours.map((tour, index) => (
                <TourCard key={tour.id} tour={tour} index={index} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground text-lg">No featured tours available at the moment.</p>
                <Link href="/tours">
                  <MagneticButton variant="outline" className="mt-4">
                    View All Tours
                  </MagneticButton>
                </Link>
              </div>
            )}
          </div>

          <ScrollReveal direction="up" className="mt-12 text-center">
            <Link href="/tours">
              <MagneticButton variant="outline" className="px-12">
                View All Tours
                <ArrowRight className="w-5 h-5" />
              </MagneticButton>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* === WHY CHOOSE US === */}
      <section className="py-16 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, var(--primary) 0, var(--primary) 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="container relative z-10">
          <DifferentiatorsSection />
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <TestimonialsSection testimonials={testimonials} />

      {/* === CTA SECTION === */}
      <CTASection />

      <Footer />
    </div>
  );
}
