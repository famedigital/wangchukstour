'use client';

import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Heart, Shield, Mountain, Clock } from 'lucide-react';

const differentiators = [
  {
    icon: Heart,
    title: 'Local Expertise',
    description: 'Bhutanese-owned since 2008. We know every trail and temple in the Himalayan kingdom.',
  },
  {
    icon: Shield,
    title: 'Authentic Experiences',
    description: 'No tourist traps. Genuine Bhutanese culture, real communities, meaningful connections.',
  },
  {
    icon: Mountain,
    title: 'Sustainable Tourism',
    description: 'Responsible tourism that respects environment and preserves cultural heritage.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Always available to assist you throughout your journey, from planning to departure.',
  },
];

export function DifferentiatorsSection() {
  return (
    <>
      <ScrollReveal>
        <div className="mb-16 text-center md:mb-20">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary uppercase">
            Why Choose Us
          </p>
          <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            The Wangchuks <span className="font-accent text-primary italic">Difference</span>
          </h2>
        </div>
      </ScrollReveal>

      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        {differentiators.map((item, index) => (
          <ScrollReveal key={item.title} direction="up" delay={index * 0.04}>
            <div className="group text-center transition-transform duration-200 hover:-translate-y-1">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="size-7 text-primary" />
              </div>
              <h3 className="font-heading mb-3 text-lg font-semibold transition-colors group-hover:text-primary">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}
