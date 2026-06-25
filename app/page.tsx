'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { ScrollReveal, StaggerChildren } from '@/components/ui/scroll-reveal';
import { PrayerFlags, FloatingPrayerFlags } from '@/components/animations/prayer-flags';
import { Badge } from '@/components/ui/badge';
import { getFeaturedTours } from '@/lib/mock-data/tours';
import {
  Mountain,
  Calendar,
  Users,
  TrendingUp,
  Shield,
  Heart,
  Mail,
  ArrowRight,
  ChevronDown,
  Star,
  MapPin,
  Camera,
  Sparkles,
  Clock,
  DollarSign,
  Compass,
  Building,
  Flag,
} from 'lucide-react';

// Cultural Story Data
const culturalStories = [
  {
    title: 'Taktsang Palphug',
    subtitle: 'Tiger\'s Nest Monastery',
    description: 'Perched on a cliff 3,000m above sea level',
    image: 'https://images.unsplash.com/photo-1629196914371-f43e0ff70bb5?w=600&h=400&fit=crop',
    icon: Building,
  },
  {
    title: 'Paro Tsechu',
    subtitle: 'Sacred Festival',
    description: 'Witness the unfurling of the sacred Thongdrel',
    image: 'https://images.unsplash.com/photo-1545564806-29367ab2a0ca?w=600&h=400&fit=crop',
    icon: Flag,
  },
  {
    title: 'Traditional Architecture',
    subtitle: 'Ancient Dzongs',
    description: 'Fortress-monasteries with intricate woodwork',
    image: 'https://images.unsplash.com/photo-1609138138345-27f310103c61?w=600&h=400&fit=crop',
    icon: Mountain,
  },
  {
    title: 'Bhutanese Cuisine',
    subtitle: 'Ema Datshi & More',
    description: 'Savor authentic Himalayan flavors',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    icon: Sparkles,
  },
];

// Testimonials Data
const testimonials = [
  {
    name: 'Sarah & Michael',
    location: 'Sydney, Australia',
    text: 'The journey to Tiger\'s Nest was transformative. Wangchuk Tours & Treks made every moment magical with their authentic approach and deep knowledge of Bhutan.',
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

// Services with new vibrant design
const services = [
  {
    icon: Mountain,
    title: 'Fixed Departure Tours',
    description: 'Join small group departures with set dates. Perfect for solo travelers seeking shared experiences.',
    gradient: 'from-prayer-red to-monastery-red',
  },
  {
    icon: Users,
    title: 'Custom Private Tours',
    description: 'Design your own journey. Choose your dates, destinations, and pace with our expert guidance.',
    gradient: 'from-prayer-blue to-primary',
  },
  {
    icon: Sparkles,
    title: 'Cultural Experiences',
    description: 'Immerse in Bhutanese traditions. Visit monasteries, witness festivals, meet local artisans.',
    gradient: 'from-prayer-yellow to-accent',
  },
  {
    icon: TrendingUp,
    title: 'Trekking Adventures',
    description: 'Challenge yourself on Himalayan trails. From gentle walks to expeditions across mountain passes.',
    gradient: 'from-prayer-green to-primary',
  },
  {
    icon: Calendar,
    title: 'Festival Tours',
    description: 'Experience colorful Tsechus. Watch masked dances and receive blessings from sacred relics.',
    gradient: 'from-monastery-red to-prayer-red',
  },
  {
    icon: Shield,
    title: 'Logistics & Support',
    description: 'Complete travel support. Visa, permits, transport, guides, accommodation—everything arranged.',
    gradient: 'from-primary to-prayer-blue',
  },
];

// Differentiators
const differentiators = [
  {
    icon: Heart,
    title: 'Local Expertise',
    description: 'Bhutanese-owned since 2008. We know every trail and temple in the Himalayan kingdom.',
    color: 'var(--prayer-red)',
  },
  {
    icon: Shield,
    title: 'Authentic Experiences',
    description: 'No tourist traps. Genuine Bhutanese culture, real communities, meaningful connections.',
    color: 'var(--prayer-blue)',
  },
  {
    icon: Mountain,
    title: 'Sustainable Tourism',
    description: 'Responsible tourism that respects environment and preserves cultural heritage.',
    color: 'var(--prayer-green)',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Always available to assist you throughout your journey, from planning to departure.',
    color: 'var(--prayer-yellow)',
  },
];

// Animated Stats Component
function AnimatedStat({
  value,
  label,
  icon: Icon,
  color,
}: {
  value: string;
  label: string;
  icon: any;
  color: string;
}) {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-8"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative mb-6">
        <motion.div
          className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: color }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Icon className="w-12 h-12" style={{ color: '#FFFFFF' }} />
        </motion.div>
      </div>
      <motion.div
        className="text-5xl md:text-6xl font-bold mb-3"
        style={{ color }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {value}
      </motion.div>
      <div className="text-sm uppercase tracking-wider font-medium text-white/90">
        {label}
      </div>
    </motion.div>
  );
}

// Tour Card with new design
function TourCard({ tour, index }: { tour: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-96 overflow-hidden">
        <motion.img
          src={tour.hero_image}
          alt={tour.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Floating Badge */}
        <motion.div
          className="absolute top-6 right-6"
          animate={{ y: isHovered ? -5 : 0 }}
        >
          <Badge
            className="px-4 py-2 text-sm font-semibold"
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            {tour.category}
          </Badge>
        </motion.div>

        {/* Price Badge */}
        <motion.div
          className="absolute bottom-6 right-6 bg-accent/90 backdrop-blur-sm rounded-xl px-6 py-3"
          animate={{ scale: isHovered ? 1.1 : 1 }}
        >
          <div className="text-2xl font-bold text-primary-foreground">${tour.price}</div>
          <div className="text-xs text-primary-foreground/80">per person</div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <motion.h3
          className="text-2xl font-heading font-bold mb-2"
          animate={{ y: isHovered ? -5 : 0 }}
        >
          {tour.title}
        </motion.h3>
        <motion.p
          className="text-white/80 mb-4 line-clamp-2"
          animate={{ y: isHovered ? -5 : 0 }}
        >
          {tour.tagline}
        </motion.p>

        <div className="flex items-center gap-6 text-sm mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: '#DC143C' }} />
            <span>{tour.duration} days</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: '#DC143C' }} />
            <span className="capitalize">{tour.difficulty_level}</span>
          </div>
        </div>

        <Link href={`/tours/${tour.slug}`}>
          <MagneticButton variant="default" className="w-full">
            View Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
        </Link>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const featuredTours = getFeaturedTours();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation />

      {/* === IMMERSIVE HERO SECTION === */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Beautiful Gradient Sky */}
        <div className="absolute inset-0 z-0" style={{ top: 0 }}>
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #1a1a2e 0%, #2d2d44 10%, #4a3f5c 20%, #6b4c7a 30%, #8b5a8c 40%, #d4618c 55%, #f4a261 70%, #f7b787 80%, #ffd89b 90%, #fff5e6 100%)'
            }}
          />

          {/* Sunset Glow Effect */}
          <motion.div
            className="absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.25) 0%, rgba(249, 115, 22, 0.15) 30%, transparent 70%)'
            }}
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Soft Clouds with Warm Sunset Tones */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-32 left-0 right-0 w-full h-48 rounded-full blur-3xl"
              style={{ background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.7), rgba(254, 227, 210, 0.5), rgba(255, 255, 255, 0.7))' }}
              animate={{ y: [0, 30, 0], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-64 left-0 right-0 w-full h-32 rounded-full blur-3xl"
              style={{ background: 'linear-gradient(90deg, rgba(251, 146, 60, 0.15), rgba(220, 20, 60, 0.08), rgba(251, 146, 60, 0.15))' }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Mountain Silhouette Layers - Warm Tones */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full h-96"
            viewBox="0 0 1440 400"
            preserveAspectRatio="none"
            style={{ zIndex: 1 }}
          >
            {/* Far Mountains - Lighter */}
            <motion.path
              d="M0,400 L0,280 L120,180 L240,220 L360,140 L480,200 L600,100 L720,160 L840,80 L960,140 L1080,60 L1200,120 L1320,40 L1440,100 L1440,400 Z"
              fill="#4a1515"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Mid Mountains */}
            <motion.path
              d="M0,400 L0,320 L180,240 L360,280 L540,180 L720,240 L900,160 L1080,220 L1260,140 L1440,200 L1440,400 Z"
              fill="#3a1010"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Near Mountains - Darkest */}
            <motion.path
              d="M0,400 L0,360 L200,300 L400,340 L600,280 L800,320 L1000,260 L1200,300 L1440,280 L1440,400 Z"
              fill="#2a0a0a"
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>

          {/* Red Mist Effect */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-48"
            style={{
              background: 'linear-gradient(to top, rgba(139, 0, 0, 0.4), transparent)',
              filter: 'blur(20px)'
            }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Bhutanese-Style Clouds */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            style={{ zIndex: 2 }}
          >
            <defs>
              <linearGradient id="cloudGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgba(255, 248, 240, 0.8)', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: 'rgba(255, 220, 200, 0.6)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(255, 248, 240, 0.8)', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="cloudGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgba(255, 240, 245, 0.7)', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: 'rgba(255, 200, 220, 0.5)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(255, 240, 245, 0.7)', stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="cloudGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgba(255, 250, 240, 0.75)', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: 'rgba(255, 230, 200, 0.55)', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: 'rgba(255, 250, 240, 0.75)', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="cloudBlur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
              </filter>
            </defs>

            {/* Cloud 1 - Large fluffy cloud */}
            <motion.g
              animate={{ x: [0, 30, 0], opacity: [0.7, 0.85, 0.7] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="200" cy="120" rx="120" ry="45" fill="url(#cloudGradient1)" filter="url(#cloudBlur)" opacity="0.8" />
              <ellipse cx="260" cy="100" rx="80" ry="35" fill="url(#cloudGradient1)" filter="url(#cloudBlur)" opacity="0.75" />
              <ellipse cx="150" cy="130" rx="70" ry="30" fill="url(#cloudGradient1)" filter="url(#cloudBlur)" opacity="0.85" />
            </motion.g>

            {/* Cloud 2 - Wispy cloud */}
            <motion.g
              animate={{ x: [0, -40, 0], opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="1100" cy="180" rx="100" ry="35" fill="url(#cloudGradient2)" filter="url(#cloudBlur)" opacity="0.75" />
              <ellipse cx="1160" cy="160" rx="70" ry="28" fill="url(#cloudGradient2)" filter="url(#cloudBlur)" opacity="0.7" />
              <ellipse cx="1050" cy="190" rx="60" ry="25" fill="url(#cloudGradient2)" filter="url(#cloudBlur)" opacity="0.8" />
            </motion.g>

            {/* Cloud 3 - High altitude cloud */}
            <motion.g
              animate={{ x: [0, 50, 0], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="700" cy="80" rx="140" ry="40" fill="url(#cloudGradient3)" filter="url(#cloudBlur)" opacity="0.65" />
              <ellipse cx="780" cy="65" rx="90" ry="32" fill="url(#cloudGradient3)" filter="url(#cloudBlur)" opacity="0.6" />
              <ellipse cx="640" cy="90" rx="75" ry="28" fill="url(#cloudGradient3)" filter="url(#cloudBlur)" opacity="0.7" />
            </motion.g>

            {/* Cloud 4 - Small decorative cloud */}
            <motion.g
              animate={{ x: [0, -25, 0], opacity: [0.55, 0.75, 0.55] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="400" cy="200" rx="80" ry="30" fill="url(#cloudGradient1)" filter="url(#cloudBlur)" opacity="0.7" />
              <ellipse cx="440" cy="185" rx="55" ry="24" fill="url(#cloudGradient1)" filter="url(#cloudBlur)" opacity="0.65" />
            </motion.g>

            {/* Cloud 5 - Bottom area cloud */}
            <motion.g
              animate={{ x: [0, 35, 0], opacity: [0.45, 0.65, 0.45] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="1000" cy="280" rx="110" ry="38" fill="url(#cloudGradient2)" filter="url(#cloudBlur)" opacity="0.6" />
              <ellipse cx="1060" cy="265" rx="75" ry="30" fill="url(#cloudGradient2)" filter="url(#cloudBlur)" opacity="0.55" />
            </motion.g>

            {/* Cloud 6 - Delicate wispy cloud */}
            <motion.g
              animate={{ x: [0, -30, 0], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="1300" cy="240" rx="95" ry="33" fill="url(#cloudGradient3)" filter="url(#cloudBlur)" opacity="0.7" />
              <ellipse cx="1350" cy="225" rx="65" ry="27" fill="url(#cloudGradient3)" filter="url(#cloudBlur)" opacity="0.65" />
            </motion.g>

            {/* Cloud 7 - Small accent cloud */}
            <motion.g
              animate={{ x: [0, 20, 0], opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="150" cy="260" rx="70" ry="28" fill="url(#cloudGradient2)" filter="url(#cloudBlur)" opacity="0.75" />
              <ellipse cx="185" cy="248" rx="48" ry="22" fill="url(#cloudGradient2)" filter="url(#cloudBlur)" opacity="0.7" />
            </motion.g>

            {/* Cloud 8 - Upper wisps */}
            <motion.g
              animate={{ x: [0, -15, 0], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="900" cy="140" rx="85" ry="30" fill="url(#cloudGradient1)" filter="url(#cloudBlur)" opacity="0.55" />
              <ellipse cx="940" cy="128" rx="58" ry="24" fill="url(#cloudGradient1)" filter="url(#cloudBlur)" opacity="0.5" />
            </motion.g>
          </svg>
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 text-center py-24">
          <ScrollReveal direction="down">
            <Badge
              className="mb-6 px-4 py-2 text-xs tracking-widest uppercase shadow-lg border-0"
              style={{
                background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                color: '#FFFFFF'
              }}
            >
              Welcome to Bhutan
            </Badge>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="block text-white/95">Discover the</span>
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #FFD700 0%, #DC143C 50%, #8B0000 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Last Shangri-La
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 text-white/75">
              Experience authentic Bhutanese culture, breathtaking Himalayan landscapes,
              and spiritual journeys that will transform your soul.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/tours">
                <MagneticButton
                  style={{
                    background: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(220, 20, 60, 0.4)'
                  }}
                >
                  Explore Tours
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
              </Link>
              <Link href="/contact">
                <MagneticButton
                  variant="outline"
                  style={{
                    borderColor: '#DC143C',
                    color: '#DC143C',
                    borderWidth: '2px'
                  }}
                >
                  Plan Custom Journey
                  <Compass className="w-5 h-5" />
                </MagneticButton>
              </Link>
            </div>
          </ScrollReveal>

          {/* Stats Section */}
          <ScrollReveal direction="up" delay={0.4} className="mt-32">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <AnimatedStat value="500+" label="Happy Travelers" icon={Users} color="#DC143C" />
              <AnimatedStat value="15+" label="Years Experience" icon={Mountain} color="#D4A017" />
              <AnimatedStat value="50+" label="Unique Itineraries" icon={Compass} color="#B91C1C" />
              <AnimatedStat value="100%" label="Satisfaction" icon={Heart} color="#CD7F32" />
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8" style={{ color: 'var(--muted-foreground)' }} />
        </motion.div>
      </section>

      {/* === CULTURAL STORY STRIP === */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--muted)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge
                className="mb-6"
                style={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                Cultural Heritage
              </Badge>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Experience <span style={{ color: '#DC143C' }}>Bhutan's Culture</span>
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                Discover the rich traditions and sacred places that make Bhutan unique
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {culturalStories.map((story, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div
                  className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group"
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <story.icon className="w-8 h-8 mb-3" style={{ color: '#DC143C' }} />
                    <h3 className="text-xl font-heading font-bold mb-1">{story.title}</h3>
                    <p className="text-sm text-white/80 mb-2">{story.subtitle}</p>
                    <p className="text-xs text-white/60">{story.description}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* === EXPERIENCES GRID === */}
      <section className="py-32 bg-background">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-20">
              <Badge
                className="mb-6"
                style={{
                  background: 'linear-gradient(135deg, #E63946 0%, #DC143C 100%)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                Our Services
              </Badge>
              <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">
                What We <span style={{ color: '#DC143C' }}>Offer</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                From cultural immersions to high-altitude adventures, we craft experiences
                that connect you with the heart of Bhutan.
              </p>
            </div>
          </ScrollReveal>

          {/* Masonry Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, var(--background) 0%, var(--muted) 100%)`,
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {/* Gradient Border Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${service.gradient.split(' ')[0].replace('from-', 'var(--')}, ${service.gradient.split(' ')[1].replace('to-', 'var(--')})`,
                      filter: 'blur(20px)',
                    }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ background: `${service.gradient.split(' ')[0].replace('from-', 'var(--')}40` }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <service.icon className="w-8 h-8" style={{ color: service.gradient.split(' ')[0].replace('from-', 'var(--') }} />
                    </motion.div>

                    <h3 className="font-heading text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      {service.description}
                    </p>

                    <motion.div
                      className="mt-6 flex items-center gap-2 text-primary font-medium"
                      whileHover={{ x: 5 }}
                    >
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* === FEATURED TOURS === */}
      <section className="py-32 relative" style={{ background: 'var(--muted)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-20">
              <Badge
                className="mb-6"
                style={{
                  background: 'linear-gradient(135deg, #B91C1C 0%, #8B0000 100%)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                Popular Tours
              </Badge>
              <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">
                Featured <span style={{ color: '#B91C1C' }}>Journeys</span>
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                Our most loved experiences, crafted with care and attention to every detail.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour, index) => (
              <TourCard key={tour.id} tour={tour} index={index} />
            ))}
          </div>

          <ScrollReveal direction="up" className="mt-16 text-center">
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
      <section className="py-32 bg-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, var(--primary) 0, var(--primary) 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="container relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <Badge
                className="mb-6"
                style={{
                  background: 'linear-gradient(135deg, #E63946 0%, #DC143C 100%)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                Why Choose Us
              </Badge>
              <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6">
                The Wangchuk <span style={{ color: '#DC143C' }}>Difference</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {differentiators.map((item, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <motion.div
                  className="text-center group"
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    className="mx-auto mb-8 w-24 h-24 rounded-3xl flex items-center justify-center"
                    style={{ background: `${item.color}20` }}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="w-12 h-12" style={{ color: item.color }} />
                  </motion.div>
                  <h3 className="font-heading font-bold mb-4 text-xl group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    {item.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="container relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Badge
                className="mb-6"
                style={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                Testimonials
              </Badge>
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                What Travelers <span style={{ color: '#DC143C' }}>Say</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Premium Card Design */}
                <div
                  className="rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #FEFEFE 0%, #F8F8F8 100%)',
                    border: '1px solid rgba(220, 20, 60, 0.1)'
                  }}
                >
                  {/* Decorative Quote Mark */}
                  <div className="absolute top-6 left-8 text-8xl font-serif opacity-5" style={{ color: '#DC143C' }}>
                    "
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center gap-2 mb-8">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-current" style={{ color: '#FFD700' }} />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl leading-relaxed mb-10 font-medium" style={{ color: '#1C1917', lineHeight: '1.8' }}>
                    "{testimonials[activeTestimonial].text}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-5">
                    <div className="relative">
                      <div
                        className="w-16 h-16 rounded-full p-1"
                        style={{ background: 'linear-gradient(135deg, #DC143C 0%, #FFD700 100%)' }}
                      >
                        <img
                          src={testimonials[activeTestimonial].image}
                          alt={testimonials[activeTestimonial].name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-heading font-bold text-lg" style={{ color: '#DC143C' }}>
                        {testimonials[activeTestimonial].name}
                      </div>
                      <div className="flex items-center gap-2 mt-1" style={{ color: '#78716C' }}>
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{testimonials[activeTestimonial].location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-12">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: activeTestimonial === index ? '#DC143C' : '#E5E5E5',
                    transform: activeTestimonial === index ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-32 relative overflow-hidden bg-background">
        {/* Prayer Flags Animation */}
        <div className="absolute top-0 left-0 right-0">
          <PrayerFlags className="mx-auto" count={10} />
        </div>

        <div className="container relative z-10 text-center pt-20">
          <ScrollReveal>
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge
                className="mb-8"
                style={{
                  background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                Start Your Journey
              </Badge>
              <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
                Ready to Explore{' '}
                <span style={{ color: '#DC143C' }}>Bhutan?</span>
              </h2>
              <p className="text-xl mb-12 leading-relaxed max-w-3xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                Let us craft your perfect journey through the Land of the Thunder Dragon.
                Your transformational Himalayan experience awaits.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/contact">
                  <MagneticButton
                    style={{
                      background: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
                      border: 'none',
                      color: '#FFFFFF',
                      boxShadow: '0 8px 24px rgba(220, 20, 60, 0.4)'
                    }}
                  >
                    Request Quote
                    <Mail className="w-5 h-5" />
                  </MagneticButton>
                </Link>
                <Link href="mailto:info@wangchuktour.com">
                  <MagneticButton
                    variant="outline"
                    style={{
                      borderColor: '#DC143C',
                      color: '#DC143C',
                      borderWidth: '2px'
                    }}
                  >
                    <Mail className="w-5 h-5" />
                    Email Us
                  </MagneticButton>
                </Link>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Quick Links */}
          <ScrollReveal direction="up" delay={0.2} className="mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Compass, label: 'Plan Your Journey', href: '/contact' },
                { icon: Camera, label: 'View Gallery', href: '/blog' },
                { icon: Mountain, label: 'Explore Tours', href: '/tours' },
              ].map((link, index) => (
                <Link key={index} href={link.href}>
                  <motion.div
                    className="p-6 rounded-2xl text-center cursor-pointer"
                    style={{ background: 'var(--muted)' }}
                    whileHover={{ y: -5, scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <link.icon className="w-10 h-10 mx-auto mb-4" style={{ color: '#DC143C' }} />
                    <div className="font-semibold">{link.label}</div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
}
