'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AboutPageForm } from '@/components/admin/forms/AboutPageForm';
import { FAQManager } from '@/components/admin/FAQManager';
import { ContactSettingsForm } from '@/components/admin/forms/ContactSettingsForm';
import { HeroSliderManager } from '@/components/admin/HeroSliderManager';
import { TestimonialManager } from '@/components/admin/TestimonialManager';
import { UserManager } from '@/components/admin/UserManager';
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Settings,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Check,
  Clock,
  MapPin,
  Plus,
  Loader2,
} from 'lucide-react';

// Types for real data
interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeTours: number;
  totalInquiries: number;
}

interface Booking {
  id: string;
  clientName: string;
  email: string;
  tour: string;
  date: string;
  travelers: number;
  amount: number;
  status: string;
}

interface Tour {
  id: string;
  title: string;
  category: string;
  duration: number;
  difficulty: string;
  price: number;
  status: string;
  bookings: number;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: string;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch real data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [statsRes, bookingsRes, toursRes, inquiriesRes] = await Promise.all([
          fetch('/api/admin/dashboard/stats'),
          fetch('/api/admin/dashboard/bookings'),
          fetch('/api/admin/dashboard/tours'),
          fetch('/api/admin/dashboard/inquiries'),
        ]);

        // Check for errors
        if (!statsRes.ok || !bookingsRes.ok || !toursRes.ok || !inquiriesRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        // Parse data
        const [statsData, bookingsData, toursData, inquiriesData] = await Promise.all([
          statsRes.json(),
          bookingsRes.json(),
          toursRes.json(),
          inquiriesRes.json(),
        ]);

        setStats(statsData);
        setBookings(bookingsData);
        setTours(toursData);
        setInquiries(inquiriesData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'active':
      case 'responded':
        return 'text-green-600 bg-green-50';
      case 'pending':
      case 'new':
        return 'text-amber-600 bg-amber-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-muted';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, Admin</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading dashboard data...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'var(--primary)' }}>
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">{stats?.totalBookings || 0}</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stats?.totalBookings || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Bookings</div>
                </CardContent>
              </Card>

              <Card className="transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-amber-600 text-sm font-medium">{stats?.pendingBookings || 0} pending</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stats?.pendingBookings || 0}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </CardContent>
              </Card>

              <Card className="transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">${stats?.monthlyRevenue?.toLocaleString() || 0}</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">${stats?.monthlyRevenue?.toLocaleString() || 0}</div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                </CardContent>
              </Card>

              <Card className="transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-blue-600 text-sm font-medium">{stats?.activeTours || 0} tours</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stats?.activeTours || 0}</div>
                  <div className="text-sm text-muted-foreground">Active Tours</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card className="transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No bookings found. Start promoting your tours to get bookings!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Booking ID</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Client</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Tour</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <span className="font-medium">{booking.id}</span>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium">{booking.clientName}</div>
                                <div className="text-sm text-muted-foreground">{booking.email}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">{booking.tour}</td>
                            <td className="py-4 px-4">{booking.date}</td>
                            <td className="py-4 px-4 font-medium">${booking.amount.toLocaleString()}</td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
