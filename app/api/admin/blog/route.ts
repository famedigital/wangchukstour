import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET /api/admin/blog - List all blog posts
export async function GET(request: NextRequest) {
  try {
    // TEMPORARY: Skip authentication to get blog working first
    // TODO: Re-enable after confirming Supabase connection works

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // published, draft, all
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status === 'published') {
      query = query.eq('status', 'published');
    } else if (status === 'draft') {
      query = query.eq('status', 'draft');
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data: posts, error, count } = await query;

    if (error) throw error;

    // Map database fields to BlogManagement format
    const mappedPosts = posts.map(post => ({
      ...post,
      // Map featured_image_url to featured_image for BlogManagement
      featured_image: post.featured_image_url,
      // Map status to is_published for BlogManagement
      is_published: post.status === 'published',
      // Map published_at to published_date for BlogManagement
      published_date: post.published_at,
      // Keep author field for BlogManagement
      author: post.author_name,
    }));

    return NextResponse.json({
      posts: mappedPosts,
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
    // TEMPORARY: Skip authentication to get blog working first
    // TODO: Re-enable after confirming Supabase connection works

    const body = await request.json();

    // Explicitly remove is_featured if present (not in database schema)
    const { is_featured, ...cleanBody } = body;

    // Map BlogEditor fields to database schema
    const insertData: any = {};

    // Generate slug from title if not provided
    if (!cleanBody.slug) {
      insertData.slug = cleanBody.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    } else {
      insertData.slug = cleanBody.slug;
    }

    // Direct field mappings
    if (cleanBody.title !== undefined) insertData.title = cleanBody.title;
    if (cleanBody.content !== undefined) insertData.content = cleanBody.content;
    if (cleanBody.excerpt !== undefined) insertData.excerpt = cleanBody.excerpt;
    if (cleanBody.author_name !== undefined) insertData.author_name = cleanBody.author_name;
    if (cleanBody.author_bio !== undefined) insertData.author_bio = cleanBody.author_bio;
    if (cleanBody.category !== undefined) insertData.category = cleanBody.category;
    if (cleanBody.tags !== undefined) insertData.tags = cleanBody.tags;
    if (cleanBody.meta_description !== undefined) insertData.meta_description = cleanBody.meta_description;
    if (cleanBody.meta_keywords !== undefined) insertData.meta_keywords = cleanBody.meta_keywords;

    // Map featured_image to featured_image_url
    if (cleanBody.featured_image !== undefined) insertData.featured_image_url = cleanBody.featured_image;
    if (cleanBody.featured_image_public_id !== undefined) insertData.featured_image_public_id = cleanBody.featured_image_public_id;

    // Map is_published to status
    if (cleanBody.is_published !== undefined) {
      insertData.status = cleanBody.is_published ? 'published' : 'draft';
    } else if (cleanBody.status !== undefined) {
      insertData.status = cleanBody.status;
    } else {
      insertData.status = 'draft';
    }

    // Map published_date to published_at
    if (cleanBody.published_date !== undefined) {
      insertData.published_at = cleanBody.published_date;
    } else if (cleanBody.is_published) {
      insertData.published_at = new Date().toISOString();
    }

    // Calculate read time if not provided
    if (!cleanBody.read_time && cleanBody.content) {
      const wordCount = cleanBody.content.split(/\s+/).length;
      insertData.read_time = Math.ceil(wordCount / 200);
    } else if (cleanBody.read_time !== undefined) {
      insertData.read_time = cleanBody.read_time;
    }

    const supabase = await createClient();

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Database insertion error:', error);
      throw error;
    }

    // Log the creation
    try {
      // await supabase.from('audit_logs').insert({
      //   user_id: user.userId,
      //   user_name: user.name,
      //   user_email: user.email,
      //   action: 'create',
      //   entity_type: 'blog_post',
      //   entity_id: post.id,
      //   entity_title: post.title,
      //   new_values: post,
      //   ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      //   user_agent: request.headers.get('user-agent') || null,
      // });
      console.log('Blog post created:', post.id, post.title);
    } catch (logError) {
      // Don't fail the creation if logging fails
      console.error('Failed to log creation:', logError);
    }

    // Map the response to match frontend format
    const responsePost = {
      ...post,
      // Map featured_image_url to featured_image for BlogEditor
      featured_image: post.featured_image_url,
      // Map status to is_published for BlogEditor
      is_published: post.status === 'published',
      // Map published_at to published_date for BlogEditor
      published_date: post.published_at,
    };

    return NextResponse.json(responsePost, { status: 201 });
  } catch (error) {
    console.error('Blog post creation error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json({
      error: 'Failed to create blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}