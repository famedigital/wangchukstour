import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

// GET /api/admin/bookings - List all bookings
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // pending, confirmed, cancelled, completed, all
    const search = searchParams.get('search');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const offset = (page - 1) * limit;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let query = supabase
      .from('bookings')
      .select('*, tours(title, category, duration)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`client_name.ilike.%${search}%,client_email.ilike.%${search}%,booking_number.ilike.%${search}%`);
    }
    if (dateFrom) {
      query = query.gte('travel_date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('travel_date', dateTo);
    }

    const { data: bookings, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Bookings list error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// PATCH /api/admin/bookings/[id] - Update booking
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get current booking
    const { data: currentBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update booking
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
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
      entity_type: 'booking',
      entity_id: updatedBooking.id,
      entity_title: updatedBooking.booking_number,
      old_values: currentBooking,
      new_values: updatedBooking,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
