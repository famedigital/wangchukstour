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