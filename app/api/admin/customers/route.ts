import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { isAuthError, requireAuth } from '@/lib/auth/require-auth';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (isAuthError(auth)) return auth;

    const supabase = createAdminClient();

    // Prefer master clients table when available
    const { data: masterClients, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, email, phone, country, nationality, source, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(500);

    if (!clientsError && masterClients) {
      const [{ data: bookings }, { data: inquiries }] = await Promise.all([
        supabase.from('bookings').select('client_id, client_email, created_at').limit(1000),
        supabase.from('inquiries').select('client_id, email, client_email, created_at').limit(1000),
      ]);

      const bookingCount = new Map<string, number>();
      const inquiryCount = new Map<string, number>();
      const lastByClient = new Map<string, string>();

      for (const b of bookings || []) {
        const key = b.client_id || (b.client_email || '').toLowerCase();
        if (!key) continue;
        bookingCount.set(key, (bookingCount.get(key) || 0) + 1);
        const prev = lastByClient.get(key);
        if (!prev || b.created_at > prev) lastByClient.set(key, b.created_at);
      }
      for (const i of inquiries || []) {
        const email = (i.email || i.client_email || '').toLowerCase();
        const key = i.client_id || email;
        if (!key) continue;
        inquiryCount.set(key, (inquiryCount.get(key) || 0) + 1);
        const prev = lastByClient.get(key);
        if (!prev || i.created_at > prev) lastByClient.set(key, i.created_at);
      }

      const customers = masterClients.map((c) => ({
        id: c.id,
        email: c.email,
        name: c.name,
        phone: c.phone,
        bookings: bookingCount.get(c.id) || bookingCount.get(c.email.toLowerCase()) || 0,
        inquiries: inquiryCount.get(c.id) || inquiryCount.get(c.email.toLowerCase()) || 0,
        last_contact: lastByClient.get(c.id) || lastByClient.get(c.email.toLowerCase()) || c.updated_at || c.created_at,
        sources: c.source ? [c.source] : ['client'],
        is_master: true,
      }));

      return NextResponse.json({ customers, source: 'clients' });
    }

    // Fallback: derive from bookings + inquiries (legacy)
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

    return NextResponse.json({ customers, source: 'derived' });
  } catch (error) {
    console.error('Customers error:', error);
    return NextResponse.json({ error: 'Failed to load customers' }, { status: 500 });
  }
}
