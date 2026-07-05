import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { uploadImage, deleteImage } from '@/utils/cloudinary/upload';
import { getCurrentUser } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

// GET /api/admin/media - List all media with filters
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const folder = searchParams.get('folder');
    const resourceType = searchParams.get('resource_type');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Build query
    let query = supabase
      .from('media_library')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (folder) {
      query = query.eq('folder', folder);
    }
    if (resourceType) {
      query = query.eq('resource_type', resourceType);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,alt_text.ilike.%${search}%,tags.cs.{${search}}`);
    }

    const { data: media, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      media,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Media list error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// POST /api/admin/media - Upload new media
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'wangchuk-tour';
    const title = formData.get('title') as string;
    const altText = formData.get('alt_text') as string;
    const caption = formData.get('caption') as string;
    const tags = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const uploadResult = await uploadImage(base64, {
      folder,
      publicId: title?.toLowerCase().replace(/\s+/g, '-'),
    });

    // Save to database
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: mediaRecord, error } = await supabase
      .from('media_library')
      .insert({
        public_id: uploadResult.publicId,
        url: uploadResult.url,
        secure_url: uploadResult.secureUrl,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        resource_type: uploadResult.resourceType,
        folder: uploadResult.url.split('/').slice(-2, -1)[0], // Extract folder from URL
        title: title || file.name,
        alt_text: altText,
        caption: caption,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        file_size: file.size,
        uploaded_by: user.userId,
        metadata: {
          original_filename: file.name,
          mime_type: file.type,
        },
      })
      .select()
      .single();

    if (error) {
      // Rollback: delete from Cloudinary
      await deleteImage(uploadResult.publicId);
      throw error;
    }

    // Log the upload
    await supabase.from('audit_logs').insert({
      user_id: user.userId,
      user_name: user.name,
      user_email: user.email,
      action: 'create',
      entity_type: 'media',
      entity_id: mediaRecord.id,
      entity_title: mediaRecord.title,
      new_values: mediaRecord,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    return NextResponse.json(mediaRecord, { status: 201 });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}