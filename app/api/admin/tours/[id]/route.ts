import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

// GET /api/admin/tours/[id] - Get single tour
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
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: tour, error } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Tour fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 });
  }
}

// PATCH /api/admin/tours/[id] - Update tour
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

    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get current tour
    const { data: currentTour, error: fetchError } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentTour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Update tour
    const { data: updatedTour, error } = await supabase
      .from('tours')
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
      entity_type: 'tour',
      entity_id: updatedTour.id,
      entity_title: updatedTour.title,
      old_values: currentTour,
      new_values: updatedTour,
      changes_summary: `Updated tour: ${updatedTour.title}`,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json(updatedTour);
  } catch (error) {
    console.error('Tour update error:', error);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
  }
}

// DELETE /api/admin/tours/[id] - Delete tour
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
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get tour before deletion
    const { data: tour, error: fetchError } = await supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('tours')
      .update({
        is_active: false,
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
      entity_type: 'tour',
      entity_id: tour.id,
      entity_title: tour.title,
      old_values: tour,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Tour deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
  }
}