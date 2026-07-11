import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth/jwt';
import { requirePermission, Permissions, type AdminUser } from '@/lib/auth/rbac';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RBAC permission check
    const adminUser: AdminUser = {
      id: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions || [],
    };

    requirePermission(adminUser, Permissions.BOOKING_READ);

    const supabase = await createClient();

    // Get recent bookings with tour information
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_number,
        client_name,
        client_email,
        tour_id,
        tour_title,
        travel_date,
        number_of_adults,
        number_of_children,
        total_amount,
        status,
        payment_status,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Error fetching bookings' },
        { status: 500 }
      );
    }

    // Format the bookings for display
    const formattedBookings = bookings?.map(booking => ({
      id: booking.booking_number,
      clientName: booking.client_name,
      email: booking.client_email,
      tour: booking.tour_title || 'Custom Tour',
      date: booking.travel_date || booking.created_at,
      travelers: (booking.number_of_adults || 0) + (booking.number_of_children || 0),
      amount: booking.total_amount || 0,
      status: booking.status,
    })) || [];

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}