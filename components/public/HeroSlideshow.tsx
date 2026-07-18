'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_public_id: string;
  image_url: string;
  mobile_image_public_id?: string | null;
  mobile_image_url?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  slide_order: number;
  is_active: boolean;
}

const optimizeImageUrl = (url: string) => url;

interface HeroSlideshowProps {
  slides?: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
}

export function HeroSlideshow({
  slides = [],
  autoPlay = true,
  interval = 6000,
}: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  const activeSlides = slides.length > 0 ? slides : [];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!autoPlay || activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, activeSlides.length]);

  const currentSlide = activeSlides[currentIndex];

  if (!currentSlide) {
    return (
      <section className="relative h-[100svh] min-h-[32rem] w-full overflow-hidden bg-secondary">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-foreground to-black" />
        <div className="relative z-10 flex h-full items-end pb-28 pt-24 lg:items-center lg:pb-0 lg:pt-20">
          <div className="container">
            <div className="max-w-2xl space-y-5">
              <motion.h1
                className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                Discover Bhutan
              </motion.h1>
              <motion.p
                className="max-w-lg text-base text-white/75 sm:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                The Last Shangri-La awaits
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <Link
                  href="/tours"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'h-11 gap-2 rounded-md bg-white px-6 text-foreground hover:bg-white/90'
                  )}
                >
                  Explore Tours
                  <ArrowRight className="size-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[100svh] min-h-[32rem] w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        {activeSlides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={false}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={hasMounted ? { duration: 1.2, ease: 'easeInOut' } : { duration: 0 }}
            className="absolute inset-0"
          >
            <img
              src={optimizeImageUrl(slide.image_url)}
              alt={slide.title}
              className="h-full w-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              style={{ objectPosition: 'center 35%' }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.45) 100%)',
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex h-full items-end pb-28 pt-24 lg:items-center lg:pb-0 lg:pt-20">
        <div className="container">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="space-y-5"
              >
                <h1 className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                  {currentSlide.title}
                </h1>

                {(currentSlide.subtitle || currentSlide.description) && (
                  <p className="max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
                    {currentSlide.subtitle || currentSlide.description}
                  </p>
                )}

                <div>
                  <Link
                    href={currentSlide.cta_link || '/tours'}
                    className={cn(
                      buttonVariants({ size: 'lg' }),
                      'h-11 gap-2 rounded-md bg-white px-6 text-foreground hover:bg-white/90'
                    )}
                  >
                    {currentSlide.cta_text || 'Explore Tours'}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {activeSlides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:bottom-10">
          {activeSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
