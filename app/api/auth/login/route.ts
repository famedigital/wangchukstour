import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { comparePassword, generateAuthTokens, setAuthCookies } from '@/lib/auth/jwt';
import { z } from 'zod';

// Login validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Get Supabase client
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate auth tokens
    const tokens = generateAuthTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name || 'Admin',
    });

    // Set auth cookies
    await setAuthCookies(tokens);

    // Update last login
    await supabase
      .from('admin_users')
      .update({
        last_login_at: new Date().toISOString(),
        last_login_ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      })
      .eq('id', user.id);

    // Log the login event
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      action: 'login',
      entity_type: 'authentication',
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    // Return user data (excluding password)
    const { password_hash, verification_token, reset_password_token, reset_password_expires, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
      tokens: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}