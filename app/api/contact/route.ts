import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  travelDates: z.string().optional(),
  groupSize: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });
    }

    const { name, email, phone, travelDates, groupSize, message } = parsed.data;
    const supabase = createAdminClient();

    const groupSizeNum = groupSize ? parseInt(groupSize, 10) : null;

    const { error } = await supabase.from('inquiries').insert({
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      message,
      preferred_dates: travelDates || null,
      group_size: Number.isFinite(groupSizeNum as number) ? groupSizeNum : null,
      status: 'new',
      inquiry_type: 'contact_form',
      subject: 'Website contact form',
    });

    if (error) throw error;

    return NextResponse.json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
