'use client';

import { BlogManagement } from '@/components/admin/BlogManagement';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function BlogManagementPage() {
  return (
    <AdminLayout>
      <BlogManagement />
    </AdminLayout>
  );
}
