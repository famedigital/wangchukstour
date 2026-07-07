import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth/jwt';

// GET /api/admin/content - Fetch any page content
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('type'); // 'about', 'contact', 'faq', 'travel-info'

    const supabase = await createClient();

    if (pageType) {
      // Fetch specific page content
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('page_type', pageType)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No content found, return default structure
          return NextResponse.json({ content: getDefaultContent(pageType) });
        }
        throw error;
      }

      return NextResponse.json({ content: data.content, metadata: data.metadata });
    } else {
      // Fetch all active pages
      const { data, error } = await supabase
        .from('content_pages')
        .select('page_type, metadata->seoTitle as title, metadata->seoDescription as description, updated_at')
        .eq('is_active', true)
        .order('page_type');

      if (error) throw error;

      return NextResponse.json({ pages: data });
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/content - Update page content
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { pageType, content, metadata } = body;

    if (!pageType || !content) {
      return NextResponse.json(
        { error: 'Page type and content are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if page content already exists
    const { data: existing } = await supabase
      .from('content_pages')
      .select('id')
      .eq('page_type', pageType)
      .single();

    let result;

    if (existing) {
      // Update existing content
      const { data, error } = await supabase
        .from('content_pages')
        .update({
          content,
          metadata: metadata || {},
          updated_at: new Date().toISOString(),
          updated_by: currentUser.userId,
        })
        .eq('page_type', pageType)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new content page
      const { data, error } = await supabase
        .from('content_pages')
        .insert({
          page_type: pageType,
          content,
          metadata: metadata || {},
          created_by: currentUser.userId,
          updated_by: currentUser.userId,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // Log the action
    await supabase.from('audit_logs').insert({
      user_id: currentUser.userId,
      user_name: currentUser.name,
      user_email: currentUser.email,
      action: 'update',
      entity_type: 'content_page',
      entity_id: result.id,
      entity_title: pageType,
      new_values: { content, metadata },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json({
      success: true,
      content: result,
      message: `${pageType} page updated successfully`
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to get default content structure
function getDefaultContent(pageType: string) {
  const defaults: Record<string, any> = {
    about: {
      hero: { title: 'About Us', subtitle: 'Our Story' },
      story: { title: 'Our Story', content: '' },
      values: [],
      statistics: [],
      timeline: [],
      team: []
    },
    contact: {
      hero: { title: 'Contact Us', subtitle: 'Get in touch' },
      contactInfo: { email: '', phone: '', address: '' },
      officeHours: { weekdays: '', weekends: '' },
      socialMedia: {}
    },
    faq: {
      hero: { title: 'Frequently Asked Questions', subtitle: 'Find answers' },
      categories: []
    },
    'travel-info': {
      hero: { title: 'Travel Information', subtitle: 'Essential travel tips' },
      sections: []
    }
  };

  return defaults[pageType] || {};
}