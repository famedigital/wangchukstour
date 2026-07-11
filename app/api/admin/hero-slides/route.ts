import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET /api/admin/hero-slides - Get all hero slides
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const supabase = await createClient();

    let query = supabase
      .from('hero_slides')
      .select('*')
      .order('slide_order', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: slides, error } = await query;

    if (error) throw error;

    return NextResponse.json({ slides: slides || [] });
  } catch (error: any) {
    console.error('Hero slides fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

// POST /api/admin/hero-slides - Create new hero slide
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = await createClient();

    // Get the highest current order
    const { data: existingSlides } = await supabase
      .from('hero_slides')
      .select('slide_order')
      .order('slide_order', { ascending: false })
      .limit(1);

    const nextOrder = (existingSlides?.[0]?.slide_order ?? -1) + 1;

    const insertData = {
      title: body.title || null,
      subtitle: body.subtitle || null,
      description: body.description || null,
      image_url: body.image_url,
      image_public_id: body.image_public_id,
      mobile_image_url: body.mobile_image_url || null,
      mobile_image_public_id: body.mobile_image_public_id || null,
      cta_text: body.cta_text || null,
      cta_link: body.cta_link || null,
      slide_order: body.slide_order ?? nextOrder,
      is_active: body.is_active ?? true,
    };

    const { data: slide, error } = await supabase
      .from('hero_slides')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(slide, { status: 201 });
  } catch (error: any) {
    console.error('Hero slide creation error:', error);
    return NextResponse.json({ error: 'Failed to create hero slide' }, { status: 500 });
  }
}