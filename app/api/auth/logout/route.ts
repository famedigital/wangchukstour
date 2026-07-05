import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/jwt';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get current user from token before clearing
    const accessToken = cookieStore.get('access_token')?.value;
    if (accessToken) {
      // Verify token to get user info for logging
      const { verifyToken } = await import('@/lib/auth/jwt');
      const payload = verifyToken(accessToken);

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