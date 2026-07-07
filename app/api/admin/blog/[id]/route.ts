import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth/jwt';

// GET /api/admin/blog/[id] - Get single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog post fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PATCH /api/admin/blog/[id] - Update blog post
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Recalculate read time if content changed
    if (body.content && !body.read_time) {
      const wordCount = body.content.split(/\s+/).length;
      body.read_time = Math.ceil(wordCount / 200);
    }

    // Update published_at if post is being published
    if (body.is_published && !body.published_at) {
      body.published_at = new Date().toISOString();
    }

    const { id } = await params;
    const supabase = await createClient();

    // Get current post
    const { data: currentPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Update post
    const { data: updatedPost, error } = await supabase
      .from('blog_posts')
      .update({
        ...body,
        updated_by: user.userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log the update
    await supabase.from('audit_logs').insert({
      user_id: user.userId,
      user_name: user.name,
      user_email: user.email,
      action: 'update',
      entity_type: 'blog_post',
      entity_id: updatedPost.id,
      entity_title: updatedPost.title,
      old_values: currentPost,
      new_values: updatedPost,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Blog post update error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE /api/admin/blog/[id] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createClient();

    // Get post before deletion
    const { data: post, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Soft delete by setting is_published to false
    const { error } = await supabase
      .from('blog_posts')
      .update({
        is_published: false,
        updated_by: user.userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    // Log the deletion
    await supabase.from('audit_logs').insert({
      user_id: user.userId,
      user_name: user.name,
      user_email: user.email,
      action: 'delete',
      entity_type: 'blog_post',
      entity_id: post.id,
      entity_title: post.title,
      old_values: post,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Blog post deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
