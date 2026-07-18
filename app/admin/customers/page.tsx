'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { CustomerManagement } from '@/components/admin/CustomerManagement';

export default function CustomersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-gray-500 mt-1">Derived from bookings and inquiries</p>
        </div>
        <CustomerManagement />
      </div>
    </AdminLayout>
  );
}
