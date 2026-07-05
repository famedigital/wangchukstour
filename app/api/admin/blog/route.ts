import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

// GET /api/admin/blog - List all blog posts
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // published, draft, all
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status === 'published') {
      query = query.eq('is_published', true);
    } else if (status === 'draft') {
      query = query.eq('is_published', false);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data: posts, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Blog list error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST /api/admin/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
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

    // Calculate read time if not provided (rough estimate: 200 words per minute)
    if (!body.read_time && body.content) {
      const wordCount = body.content.split(/\s+/).length;
      body.read_time = Math.ceil(wordCount / 200);
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Set published_at if publishing
    if (body.is_published && !body.published_at) {
      body.published_at = new Date().toISOString();
    }

    const { data: post, error } = await supabase
      .from('blog_posts')
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
      entity_type: 'blog_post',
      entity_id: post.id,
      entity_title: post.title,
      new_values: post,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Blog post creation error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}