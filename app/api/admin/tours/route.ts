import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth/jwt';

// GET /api/admin/tours - List all tours with filters
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const status = searchParams.get('status'); // active, inactive, all
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // Build query
    let query = supabase
      .from('tours')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (status === 'active') {
      query = query.eq('is_active', true);
    } else if (status === 'inactive') {
      query = query.eq('is_active', false);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: tours, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      tours,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Tours list error:', error);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

// POST /api/admin/tours - Create new tour
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Generate slug from title if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const supabase = await createClient();

    const { data: tour, error } = await supabase
      .from('tours')
      .insert({
        ...body,
        created_by: user.userId,
        updated_by: user.userId,
      })
      .select()
      .single();

    if (error) throw error;

    // Log the creation
    await supabase.from('audit_logs').insert({
      user_id: user.userId,
      user_name: user.name,
      user_email: user.email,
      action: 'create',
      entity_type: 'tour',
      entity_id: tour.id,
      entity_title: tour.title,
      new_values: tour,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('Tour creation error:', error);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}