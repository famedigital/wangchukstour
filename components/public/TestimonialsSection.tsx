'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  image: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container relative z-10">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium tracking-widest text-primary uppercase">
              Testimonials
            </p>
            <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
              What Travelers <span className="font-accent text-primary italic">Say</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0.01, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <div className="relative overflow-hidden rounded-xl bg-card p-10 ring-1 ring-foreground/10 md:p-14">
                <div className="pointer-events-none absolute top-6 left-8 font-accent text-8xl text-primary/10">
                  "
                </div>

                <div className="mb-8 flex justify-center gap-2">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="size-5 fill-accent text-accent" />
                  ))}
                </div>

                <blockquote className="mb-10 text-xl leading-relaxed font-medium text-foreground md:text-2xl">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>

                <div className="flex items-center justify-center gap-5">
                  <div className="size-16 overflow-hidden rounded-full ring-2 ring-primary/30">
                    <img
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-heading text-lg font-semibold text-primary">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4" />
                      <span className="text-sm">{testimonials[activeTestimonial].location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveTestimonial(index)}
                className={`size-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === index ? 'scale-125 bg-primary' : 'bg-border'
                }`}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}