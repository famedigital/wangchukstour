import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/utils/cloudinary/upload';
import { getCurrentUser } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // TEMPORARY: Skip authentication for development testing
    // TODO: Re-enable authentication when testing is complete
    // const user = await getCurrentUser();
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'wangchuk-tour';
    const publicId = formData.get('publicId') as string | undefined;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadImage(base64, {
      folder,
      publicId,
      overwrite: true,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { error: 'No publicId provided' },
        { status: 400 }
      );
    }

    const { deleteImage } = await import('@/utils/cloudinary/upload');
    const result = await deleteImage(publicId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}