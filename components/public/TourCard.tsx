'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';

interface TourCardProps {
  tour: any;
  index: number;
}

// Optimize image URL for performance - NO DUPLICATION
const optimizeImageUrl = (url: string) => {
  // Return URL as-is to avoid Cloudinary transformation duplication
  // Database URLs already have proper transformations applied
  return url;
};

export function TourCard({ tour, index }: TourCardProps) {
  // Handle both database structure and legacy field names
  const imageUrl = tour.hero_image_url || tour.hero_image || tour.thumbnail_url || tour.thumbnail || '/placeholder.jpg';
  const heroImage = optimizeImageUrl(imageUrl);
  const category = tour.category || 'tour';
  const price = tour.price || 0;
  const duration = tour.duration || 0;
  const difficulty = tour.difficulty_level || tour.difficulty || 'easy';
  const tagline = tour.tagline || tour.description || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer h-96"
    >
      {/* Image Layer */}
      <motion.img
        src={heroImage}
        alt={tour.title}
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6 }}
        loading="lazy"
      />

      {/* Category Badge */}
      <motion.div
        className="absolute top-6 right-6 z-20"
        whileHover={{ y: -3 }}
      >
        <Badge
          className="px-4 py-2 text-sm font-semibold"
          style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          {category}
        </Badge>
      </motion.div>

      {/* Price Badge */}
      {price > 0 && (
        <motion.div
          className="absolute top-6 left-6 z-20 bg-accent/95 backdrop-blur-sm rounded-xl px-5 py-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-xs text-white/80 mb-1">Starting from</div>
          <div className="text-xl font-bold text-white">${price}</div>
          <div className="text-xs text-white/80">per person</div>
        </motion.div>
      )}

      {/* Overlay Layer - Dark gradient from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 via-black/30 to-transparent z-10" />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
        {/* Top Spacer for badges */}
        <div className="h-16" />

        {/* Bottom Content */}
        <div className="space-y-3">
          {/* Title and Description */}
          <div>
            <motion.h3
              className="text-2xl font-heading font-bold text-white leading-tight mb-2"
              whileHover={{ y: -2 }}
            >
              {tour.title}
            </motion.h3>

            <motion.p
              className="text-white/80 line-clamp-2 text-sm leading-relaxed"
              whileHover={{ y: -2 }}
            >
              {tagline}
            </motion.p>
          </div>

          {/* Bottom Row: Meta Info + Button */}
          <div className="flex items-center justify-between gap-4">
            {/* Meta Info - Compact */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-white/90">
                <Clock className="w-3.5 h-3.5" style={{ color: '#DC143C' }} />
                <span>{duration}d</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/90">
                <TrendingUp className="w-3.5 h-3.5" style={{ color: '#DC143C' }} />
                <span className="capitalize">{difficulty}</span>
              </div>
            </div>

            {/* CTA Button - Compact */}
            <Link href={`/tours/${tour.slug}`}>
              <motion.button
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 text-xs whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View
                <ArrowRight className="inline-block ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}