'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, TrendingUp } from 'lucide-react';
import { formatTourPrice, isTourPriceVisible } from '@/lib/tour-options';
import { normalizeCategoryKey } from '@/lib/tour-category';

interface TourCardProps {
  tour: any;
  index: number;
}

const optimizeImageUrl = (url: string) => url;

export function TourCard({ tour, index }: TourCardProps) {
  const imageUrl =
    tour.hero_image_url || tour.hero_image || tour.thumbnail_url || tour.thumbnail || '/placeholder.jpg';
  const heroImage = optimizeImageUrl(imageUrl);
  const categoryKey = normalizeCategoryKey(tour.category) || 'tour';
  const categoryLabel =
    categoryKey === 'international'
      ? 'International'
      : categoryKey === 'regional'
        ? 'Regional'
        : tour.category || 'Tour';
  const price = tour.price || 0;
  const duration = tour.duration || 0;
  const difficulty = tour.difficulty_level || tour.difficulty || 'easy';
  const tagline = tour.tagline || tour.description || '';

  return (
    <motion.div
      initial={{ opacity: 0.01, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05, margin: '100px 0px' }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.12), ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden border-border bg-card py-0 shadow-none transition-shadow hover:shadow-md">
        <Link href={`/tours/${tour.slug}`} className="flex h-full flex-col">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={heroImage}
              alt={tour.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>

          <CardContent className="flex flex-1 flex-col space-y-2 p-3 sm:space-y-3 sm:p-5">
            <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
              <p className="truncate text-[10px] font-medium tracking-wider text-muted-foreground uppercase sm:text-xs sm:tracking-[0.15em]">
                {categoryLabel}
              </p>
              <h3 className="font-accent line-clamp-2 text-sm leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg md:text-xl">
                {tour.title}
              </h3>
              {tagline && (
                <p className="hidden line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:block">
                  {tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1 border-t border-border pt-2 sm:pt-3">
              <div className="flex min-w-0 items-center gap-2 text-[10px] text-muted-foreground sm:gap-3 sm:text-xs">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3 text-accent sm:size-3.5" />
                  {duration}d
                </span>
                <span className="hidden items-center gap-1 capitalize sm:inline-flex">
                  <TrendingUp className="size-3.5 text-accent" />
                  {difficulty}
                </span>
              </div>
              {isTourPriceVisible(tour) ? (
                <p className="text-[11px] font-medium text-primary sm:text-sm">
                  {formatTourPrice(price, tour.category)}
                </p>
              ) : (
                <p className="text-[11px] font-medium text-muted-foreground sm:text-sm">
                  Contact for price
                </p>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
