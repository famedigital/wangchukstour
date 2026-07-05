import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { uploadMultipleImages } from '@/utils/cloudinary/upload';
import { getCurrentUser } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

// POST /api/admin/media/bulk - Bulk upload media files
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const folder = formData.get('folder') as string || 'wangchuk-tour';

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Convert files to base64 array
    const base64Files = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return `data:${file.type};base64,${buffer.toString('base64')}`;
      })
    );

    // Upload all to Cloudinary
    const uploadResults = await uploadMultipleImages(base64Files, { folder });

    // Save all to database
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const mediaRecords = await Promise.all(
      uploadResults.map(async (result, index) => {
        const file = files[index];
        const { data, error } = await supabase
          .from('media_library')
          .insert({
            public_id: result.publicId,
            url: result.url,
            secure_url: result.secureUrl,
            format: result.format,
            width: result.width,
            height: result.height,
            resource_type: result.resourceType,
            folder,
            title: file.name,
            file_size: file.size,
            uploaded_by: user.userId,
            metadata: {
              original_filename: file.name,
              mime_type: file.type,
            },
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      })
    );

    // Log the bulk upload
    await supabase.from('audit_logs').insert({
      user_id: user.userId,
      user_name: user.name,
      user_email: user.email,
      action: 'create',
      entity_type: 'media_bulk',
      new_values: { count: mediaRecords.length, ids: mediaRecords.map(m => m.id) },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json({
      media: mediaRecords,
      count: mediaRecords.length,
    }, { status: 201 });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}