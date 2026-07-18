'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { InquiryManagement } from '@/components/admin/InquiryManagement';

export default function InquiriesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Customer Inquiries</h1>
          <p className="text-gray-500 mt-1">Messages from the public contact form</p>
        </div>
        <InquiryManagement />
      </div>
    </AdminLayout>
  );
}
