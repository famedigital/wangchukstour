import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  travelDates: z.string().optional(),
  groupSize: z.string().optional(),
  message: z.string().min(1),
  tourSlug: z.string().optional(),
  tourTitle: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
    }

    const { name, email, phone, travelDates, groupSize, message, tourSlug, tourTitle } = parsed.data;
    const supabase = createAdminClient();

    let tourId: string | null = null;
    let resolvedTitle = tourTitle || null;

    if (tourSlug) {
      const { data: tour } = await supabase
        .from('tours')
        .select('id, title')
        .eq('slug', tourSlug)
        .maybeSingle();
      if (tour) {
        tourId = tour.id;
        resolvedTitle = tour.title;
      }
    }

    const adults = groupSize ? parseInt(groupSize, 10) : 1;

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        tour_id: tourId,
        tour_title: resolvedTitle,
        client_name: name,
        client_email: email.toLowerCase(),
        client_phone: phone || null,
        number_of_adults: Number.isFinite(adults) && adults > 0 ? adults : 1,
        number_of_children: 0,
        travel_date: null,
        preferred_dates: travelDates ? { note: travelDates } : null,
        custom_requests: message,
        status: 'pending',
        payment_status: 'pending',
      })
      .select('id, booking_number')
      .single();

    // Always log as inquiry too for the inquiries inbox
    await supabase.from('inquiries').insert({
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      message,
      preferred_dates: travelDates || null,
      group_size: Number.isFinite(adults) ? adults : null,
      status: 'new',
      inquiry_type: 'booking_request',
      subject: resolvedTitle ? `Booking: ${resolvedTitle}` : 'Booking request',
      tour_interest: resolvedTitle || tourSlug || null,
    });

    if (bookingError) {
      console.error('Booking insert error (inquiry still saved):', bookingError);
      // Inquiry saved — still success for the user
      return NextResponse.json({
        message: 'Request received. Our team will follow up shortly.',
        bookingCreated: false,
      });
    }

    return NextResponse.json({
      message: 'Booking request submitted',
      booking,
      bookingCreated: true,
    });
  } catch (error) {
    console.error('Booking request error:', error);
    return NextResponse.json({ error: 'Failed to submit booking request' }, { status: 500 });
  }
}
