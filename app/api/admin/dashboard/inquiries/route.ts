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

    requirePermission(adminUser, Permissions.INQUIRY_READ);

    const supabase = await createClient();

    // Get recent inquiries
    const { data: inquiries, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching inquiries:', error);
      return NextResponse.json(
        { error: 'Error fetching inquiries' },
        { status: 500 }
      );
    }

    // Format the inquiries for display
    const formattedInquiries = inquiries?.map(inquiry => ({
      id: inquiry.inquiry_number,
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject || 'General Inquiry',
      message: inquiry.message,
      date: new Date(inquiry.created_at).toISOString().split('T')[0],
      status: inquiry.status || 'new',
    })) || [];

    return NextResponse.json(formattedInquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}