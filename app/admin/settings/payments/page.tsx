'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { FAQManager } from '@/components/admin/FAQManager';

export default function PaymentsSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">FAQ Content</h1>
          <p className="text-gray-500 mt-1">Manage FAQs shown on the public FAQ page</p>
        </div>
        <FAQManager />
      </div>
    </AdminLayout>
  );
}
