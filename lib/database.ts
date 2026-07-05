import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// Database types
export interface Tour {
  id: string;
  title: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  hero_image_public_id?: string | null;
  hero_image_url?: string | null;
  thumbnail_public_id?: string | null;
  thumbnail_url?: string | null;
  gallery_public_ids?: string[] | null;
  category?: string | null;
  duration?: number | null;
  price?: number | null;
  difficulty_level?: string | null;
  is_featured?: boolean | null;
  is_active?: boolean | null;
  tour_type?: string | null;
  duration_nights?: number | null;
  locations?: string[] | null;
  highlights?: string[] | null;
  itinerary?: Array<{
    day: string | number;
    title: string;
    location?: string;
    description: string;
    activities?: string[];
    meals?: string;
    accommodation?: string;
  }> | null;
  inclusions?: string[] | null;
  exclusions?: string[] | null;
  best_season?: string[] | null;
  altitude_range?: string | null;
  min_participants?: number | null;
  max_participants?: number | null;
  min_age?: number | null;
  physical_fitness_level?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
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