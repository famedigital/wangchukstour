'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { BookingManagement } from '@/components/admin/BookingManagement';

export default function BookingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Bookings</h1>
          <p className="text-gray-500 mt-1">View and update tour bookings</p>
        </div>
        <BookingManagement />
      </div>
    </AdminLayout>
  );
}
