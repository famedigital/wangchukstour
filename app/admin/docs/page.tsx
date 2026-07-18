'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDocumentation } from '@/components/admin/AdminDocumentation';

export default function AdminDocsPage() {
  return (
    <AdminLayout>
      <AdminDocumentation />
    </AdminLayout>
  );
}
