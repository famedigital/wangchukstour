import { NextResponse } from 'next/server';
import { clearAuthCookies, getCurrentUser } from '@/lib/auth/jwt';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Get current user from token before clearing
    const payload = await getCurrentUser();
    if (payload) {
      // Log the logout event
      await supabase.from('audit_logs').insert({
        user_id: payload.userId,
        user_name: payload.name,
        user_email: payload.email,
        action: 'logout',
        entity_type: 'authentication',
      });
    }

    // Clear auth cookies
    await clearAuthCookies();

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}