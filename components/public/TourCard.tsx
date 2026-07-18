'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TourCardProps {
  tour: any;
  index: number;
}

const optimizeImageUrl = (url: string) => url;

export function TourCard({ tour, index }: TourCardProps) {
  const imageUrl =
    tour.hero_image_url || tour.hero_image || tour.thumbnail_url || tour.thumbnail || '/placeholder.jpg';
  const heroImage = optimizeImageUrl(imageUrl);
  const category = tour.category || 'tour';
  const price = tour.price || 0;
  const duration = tour.duration || 0;
  const difficulty = tour.difficulty_level || tour.difficulty || 'easy';
  const tagline = tour.tagline || tour.description || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Card className="group overflow-hidden border-border bg-card py-0 shadow-none transition-shadow hover:shadow-md">
        <Link href={`/tours/${tour.slug}`} className="block">
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={heroImage}
              alt={tour.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>

          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {category}
              </p>
              <h3 className="font-accent text-xl leading-snug text-foreground transition-colors group-hover:text-primary">
                {tour.title}
              </h3>
              {tagline && (
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{tagline}</p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5 text-accent" />
                  {duration} days
                </span>
                <span className="inline-flex items-center gap-1.5 capitalize">
                  <TrendingUp className="size-3.5 text-accent" />
                  {difficulty}
                </span>
              </div>
              {price > 0 && (
                <p className="text-sm font-medium text-primary">
                  From ${price}
                </p>
              )}
            </div>

            <span
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'inline-flex w-full gap-2 group-hover:border-primary group-hover:text-primary'
              )}
            >
              View journey
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
}
