import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, deleteImage } from '@/utils/cloudinary/upload';
import { getCurrentUser } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'wangchuk-tour';
    const publicId = (formData.get('publicId') as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await uploadImage(base64, {
      folder,
      publicId,
      overwrite: true,
    });

    return NextResponse.json({
      ...result,
      secure_url: (result as any).secure_url || (result as any).secureUrl || (result as any).url,
      url: (result as any).secure_url || (result as any).secureUrl || (result as any).url,
      public_id: (result as any).public_id || (result as any).publicId,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ error: 'No publicId provided' }, { status: 400 });
    }

    const result = await deleteImage(publicId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
