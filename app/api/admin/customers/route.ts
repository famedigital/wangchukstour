import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { isAuthError, requireAuth } from '@/lib/auth/require-auth';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth;

    const supabase = createAdminClient();

    const [{ data: bookings }, { data: inquiries }] = await Promise.all([
      supabase
        .from('bookings')
        .select('client_name, client_email, client_phone, created_at, status, booking_number')
        .order('created_at', { ascending: false })
        .limit(200),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(200),
    ]);

    const map = new Map<
      string,
      {
        email: string;
        name: string;
        phone?: string | null;
        bookings: number;
        inquiries: number;
        last_contact: string;
        sources: string[];
      }
    >();

    for (const b of bookings || []) {
      const email = (b.client_email || '').toLowerCase();
      if (!email) continue;
      const existing = map.get(email) || {
        email,
        name: b.client_name || email,
        phone: b.client_phone,
        bookings: 0,
        inquiries: 0,
        last_contact: b.created_at,
        sources: [] as string[],
      };
      existing.bookings += 1;
      existing.name = b.client_name || existing.name;
      existing.phone = b.client_phone || existing.phone;
      if (b.created_at > existing.last_contact) existing.last_contact = b.created_at;
      if (!existing.sources.includes('booking')) existing.sources.push('booking');
      map.set(email, existing);
    }

    for (const i of inquiries || []) {
      const email = (i.email || i.client_email || '').toLowerCase();
      if (!email) continue;
      const name = i.name || i.client_name || email;
      const phone = i.phone || i.client_phone;
      const existing = map.get(email) || {
        email,
        name,
        phone,
        bookings: 0,
        inquiries: 0,
        last_contact: i.created_at,
        sources: [] as string[],
      };
      existing.inquiries += 1;
      existing.name = name || existing.name;
      existing.phone = phone || existing.phone;
      if (i.created_at > existing.last_contact) existing.last_contact = i.created_at;
      if (!existing.sources.includes('inquiry')) existing.sources.push('inquiry');
      map.set(email, existing);
    }

    const customers = Array.from(map.values()).sort((a, b) =>
      a.last_contact < b.last_contact ? 1 : -1
    );

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Customers list error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
