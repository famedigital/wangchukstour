import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    // TEMPORARY: Disabled authentication
  // const currentUser = await getCurrentUser();
    // if (!currentUser) {
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get tours with booking counts
    const { data: tours, error } = await supabase
      .from('tours')
      .select(`
        id,
        title,
        category,
        duration,
        difficulty_level,
        price,
        is_active,
        is_published,
        view_count,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) {
      console.error('Error fetching tours:', error);
      return NextResponse.json(
        { error: 'Error fetching tours' },
        { status: 500 }
      );
    }

    // Format the tours for display
    const formattedTours = tours?.map(tour => ({
      id: tour.id,
      title: tour.title,
      category: tour.category,
      duration: tour.duration,
      difficulty: tour.difficulty_level,
      price: tour.price,
      status: tour.is_active && tour.is_published ? 'active' : 'inactive',
      bookings: tour.view_count || 0, // Using view_count as proxy since we don't have booking counts yet
    })) || [];

    return NextResponse.json(formattedTours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}