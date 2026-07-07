import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // TEMPORARY: Disabled authentication for development
    // TODO: Re-enable when authentication is properly configured
    // // TEMPORARY: Disabled authentication
  // const currentUser = await getCurrentUser();
    // // if (!currentUser) {
    //   // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const supabase = await createClient();

    // Get total bookings count
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    // Get pending bookings
    const { count: pendingBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get confirmed bookings
    const { count: confirmedBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed');

    // Get cancelled bookings
    const { count: cancelledBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'cancelled');

    // Get total tours
    const { count: activeTours } = await supabase
      .from('tours')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get total inquiries
    const { count: totalInquiries } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true });

    // Calculate revenue (basic calculation)
    const { data: bookings } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('payment_status', 'paid');

    const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

    // Calculate monthly revenue (current month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data: monthlyBookings } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('payment_status', 'paid')
      .gte('created_at', firstDayOfMonth.toISOString());

    const monthlyRevenue = monthlyBookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

    return NextResponse.json({
      totalBookings: totalBookings || 0,
      pendingBookings: pendingBookings || 0,
      confirmedBookings: confirmedBookings || 0,
      cancelledBookings: cancelledBookings || 0,
      totalRevenue,
      monthlyRevenue,
      activeTours: activeTours || 0,
      totalInquiries: totalInquiries || 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}