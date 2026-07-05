import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// Database types
export interface Tour {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  hero_image_public_id: string;
  hero_image_url: string;
  thumbnail_public_id: string;
  thumbnail_url: string;
  gallery_public_ids: string[];
  category: string;
  duration: number;
  price: number;
  difficulty_level: string;
  is_featured: boolean;
  is_active: boolean;
  tour_type?: string;
  duration_nights?: number;
  locations?: string[];
  highlights?: string[];
  itinerary?: Array<{
    day: string | number;
    title: string;
    location?: string;
    description: string;
    activities?: string[];
    meals?: string;
    accommodation?: string;
  }>;
  inclusions?: string[];
  exclusions?: string[];
  best_season?: string[];
  altitude_range?: string;
  min_participants?: number;
  max_participants?: number;
  min_age?: number;
  physical_fitness_level?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_public_id: string;
  featured_image_url: string;
  thumbnail_public_id: string;
  thumbnail_url: string;
  author: string;
  category: string;
  tags: string[];
  published_date: string;
  is_featured: boolean;
  is_published: boolean;
  read_time: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_public_id: string;
  image_url: string;
  mobile_image_public_id: string;
  mobile_image_url: string;
  cta_text: string;
  cta_link: string;
  slide_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  image_public_id: string;
  image_url: string;
  is_approved: boolean;
  is_featured: boolean;
}

// Server-side database operations only
// This file should only be imported in Server Components

export async function getFeaturedTours(limit: number = 6): Promise<Tour[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured tours:', error);
    return [];
  }
}

export async function getAllTours(): Promise<Tour[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all tours:', error);
    return [];
  }
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) return null;
    return data;
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    return null;
  }
}

export async function getPublishedBlogPosts(limit?: number): Promise<BlogPost[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching published blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) return null;
    return data;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('slide_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching active hero slides:', error);
    return [];
  }
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    return [];
  }
}