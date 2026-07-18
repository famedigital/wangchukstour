'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { MediaLibrary } from '@/components/admin/MediaLibrary';

export default function MediaPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-gray-500 mt-1">Upload, browse, and delete Cloudinary images</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <MediaLibrary />
        </div>
      </div>
    </AdminLayout>
  );
}
