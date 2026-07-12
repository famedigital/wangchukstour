'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  mobile_image_url?: string;
  cta_text?: string;
  cta_link?: string;
}

// Optimize image URL for performance
const optimizeImageUrl = (url: string, isAboveFold: boolean) => {
  if (url.includes('cloudinary')) {
    // Check if URL already has transformations
    if (url.includes('/image/upload/v')) {
      // URL already has transformations, return as-is to avoid conflicts
      return url;
    }
    // Add transformations for fresh uploads without existing transformations
    const transformations = 'q_auto,f_auto,w_1920,h_1080,c_limit';
    return url.replace('/image/upload/', `/image/upload/${transformations}/`);
  }
  return url;
};

interface HeroSlideshowProps {
  slides?: HeroSlide[];
  autoPlay?: boolean;
  interval?: number;
}

export function HeroSlideshow({
  slides = [],
  autoPlay = true,
  interval = 6000
}: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeSlides = slides.length > 0 ? slides : [];

  useEffect(() => {
    if (!autoPlay || activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, activeSlides.length]);

  const currentSlide = activeSlides[currentIndex];

  // Handle case when no slides are available
  if (!currentSlide) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Fallback background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        {/* Fallback content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-4xl">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Discover Bhutan
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-white/80 mt-6 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                The Last Shangri-La awaits
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Link href="/tours">
                  <button className="mt-8 px-10 py-4 bg-white text-black font-semibold rounded-none hover:bg-gray-100 transition-all duration-500 text-base tracking-wide">
                    Explore Tours →
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image with Crossfade - No White Flash */}
      <div className="absolute inset-0">
        {activeSlides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={optimizeImageUrl(slide.image_url, index === 0)}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              style={{ objectPosition: 'center 35%' }}
            />
            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)'
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Content - Smooth Transitions */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Single Compelling Headline */}
                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight"
                >
                  {currentSlide.title}
                </motion.h1>

                {/* Single CTA Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Link href={currentSlide.cta_link || '/tours'}>
                    <button className="px-10 py-4 bg-white text-black font-semibold rounded-none hover:bg-gray-100 transition-all duration-500 text-base tracking-wide">
                      {currentSlide.cta_text || 'Explore Tours'} →
                    </button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}