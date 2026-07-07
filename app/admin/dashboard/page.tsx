'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
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
  Home,
  LogOut,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  MapPin,
  Star,
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      // Clear local storage/session
      localStorage.clear();
      sessionStorage.clear();

      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' });

      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear storage and redirect
      localStorage.clear();
      sessionStorage.clear();
      router.push('/');
    }
  };

  const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'tours', label: 'Tours', icon: MapPin },
    { id: 'inquiries', label: 'Inquiries', icon: FileText },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'hero-slider', label: 'Hero Slider', icon: Home },
    { id: 'testimonials', label: 'Testimonials', icon: Users },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'about-page', label: 'About Page', icon: Home },
    { id: 'faq', label: 'FAQ', icon: FileText },
    { id: 'contact-settings', label: 'Contact Settings', icon: Settings },
  ];

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
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-premium-lg">
        <div className="flex h-20 items-center justify-between px-6" style={{ borderBottom: '1px solid rgba(220, 20, 60, 0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'shadow-premium-md text-white'
                    : 'hover:bg-gray-50 text-gray-600 shadow-premium-sm'
                }`}
                style={activeTab === item.id ? {
                  background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                  color: '#FFFFFF'
                } : {}}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '1px solid rgba(220, 20, 60, 0.1)' }}>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {adminNav.find((n) => n.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, Admin
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors">
              <Search className="h-4 w-4" />
              Search
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
              <span className="text-white font-bold text-sm">A</span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-3 text-gray-600">Loading dashboard data...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                  <Card className="shadow-premium-sm hover:shadow-premium-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-green-600 text-sm font-medium">{stats?.totalBookings || 0}</span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</div>
                      <div className="text-sm text-gray-500">Total Bookings</div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-premium-sm hover:shadow-premium-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-amber-600 text-sm font-medium">{stats?.pendingBookings || 0} pending</span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">{stats?.pendingBookings || 0}</div>
                      <div className="text-sm text-gray-500">Pending</div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-premium-sm hover:shadow-premium-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
                          <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-green-600 text-sm font-medium">${stats?.monthlyRevenue?.toLocaleString() || 0}</span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">${stats?.monthlyRevenue?.toLocaleString() || 0}</div>
                      <div className="text-sm text-gray-500">Monthly Revenue</div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-premium-sm hover:shadow-premium-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-blue-600 text-sm font-medium">{stats?.activeTours || 0} tours</span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">{stats?.activeTours || 0}</div>
                      <div className="text-sm text-gray-500">Active Tours</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Bookings */}
                <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>
                    {bookings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No bookings found. Start promoting your tours to get bookings!
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Booking ID</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Client</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Tour</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
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
                                    <div className="text-sm text-gray-500">{booking.email}</div>
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
        )}

        {activeTab === 'bookings' && (
          <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">All Bookings</h2>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-premium-sm hover:shadow-premium-md transition-shadow duration-300 bg-white">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)', color: 'white' }}>
                    <Check className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-3 text-gray-600">Loading bookings...</span>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No bookings yet. When customers book tours, they'll appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                          <span className="text-white font-bold text-sm">{booking.clientName[0]}</span>
                        </div>
                        <div>
                          <div className="font-medium">{booking.clientName}</div>
                          <div className="text-sm text-gray-500">{booking.tour}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        <span className="text-sm font-medium">${booking.amount.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{booking.date}</span>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-200 rounded-lg">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-200 rounded-lg">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-red-100 text-red-600 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'tours' && (
          <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Manage Tours</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                  <Plus className="h-4 w-4" />
                  Add New Tour
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-3 text-gray-600">Loading tours...</span>
                </div>
              ) : tours.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No tours yet. Create your first tour to get started!</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {tours.map((tour) => (
                    <Card key={tour.id} className="shadow-premium-sm hover:shadow-premium-md transition-all duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <Badge variant="secondary">{tour.category}</Badge>
                          <Badge className={getStatusColor(tour.status)}>{tour.status}</Badge>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{tour.title}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {tour.duration} days
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {tour.difficulty}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {tour.bookings} bookings
                          </div>
                          <div className="flex items-center gap-2 font-bold" style={{ color: '#DC143C' }}>
                            <DollarSign className="h-4 w-4" />
                            ${tour.price}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg">
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg">
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'inquiries' && (
          <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Customer Inquiries</h2>
                <Badge>{inquiries.length} total</Badge>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <span className="ml-3 text-gray-600">Loading inquiries...</span>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No inquiries yet. Customer inquiries will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-5 border rounded-xl hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold">{inquiry.name}</span>
                            <span className="text-sm text-gray-500">{inquiry.email}</span>
                            <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                          </div>
                          <div className="text-sm text-gray-600">{inquiry.subject}</div>
                          <div className="text-sm text-gray-500 mt-1">{inquiry.message}</div>
                          <div className="text-xs text-gray-400 mt-2">{inquiry.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border hover:bg-gray-100">
                            <Edit className="h-4 w-4" />
                            Reply
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border hover:bg-gray-100">
                            <Check className="h-4 w-4" />
                            Mark Read
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'blog' && (
          <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Blog Management</h2>
                <Link
                  href="/admin/blog/new"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                  style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}
                >
                  <Plus className="h-4 w-4" />
                  New Post
                </Link>
              </div>

              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Manage your blog posts, create content, and publish articles.</p>
                <Link
                  href="/admin/blog"
                  className="inline-block mt-4 text-prayer-red hover:underline font-medium"
                >
                  Go to Blog Manager →
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'about-page' && (
          <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <AboutPageForm />
            </CardContent>
          </Card>
        )}

        {activeTab === 'faq' && (
          <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <FAQManager />
            </CardContent>
          </Card>
        )}

        {activeTab === 'contact-settings' && (
          <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <ContactSettingsForm />
            </CardContent>
          </Card>
        )}

        {activeTab === 'hero-slider' && (
          <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <HeroSliderManager />
            </CardContent>
          </Card>
        )}

        {activeTab === 'testimonials' && (
          <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <TestimonialManager />
            </CardContent>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <UserManager />
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="Wangchuk Tours & Treks"
                      className="w-full px-4 py-3 rounded-xl shadow-premium-sm focus:shadow-premium-md transition-shadow duration-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Email</label>
                    <input
                      type="email"
                      defaultValue="admin@wangchuktour.com"
                      className="w-full px-4 py-3 rounded-xl shadow-premium-sm focus:shadow-premium-md transition-shadow duration-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 rounded-xl shadow-premium-sm focus:shadow-premium-md transition-shadow duration-300 outline-none">
                      <option>Asia/Thimphu (BST +6:00)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                  <button className="w-full px-4 py-3 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                    Save Changes
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-premium-md hover:shadow-premium-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Booking Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(220, 20, 60, 0.1)' }}>
                    <div>
                      <div className="font-medium">Auto-confirm bookings</div>
                      <div className="text-sm text-gray-500">Automatically confirm bookings under $5000</div>
                    </div>
                    <button className="relative w-12 h-6 rounded-full transition-colors shadow-premium-sm" style={{ background: '#E5E7EB' }}>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(220, 20, 60, 0.1)' }}>
                    <div>
                      <div className="font-medium">Email notifications</div>
                      <div className="text-sm text-gray-500">Receive email for new bookings</div>
                    </div>
                    <button className="relative w-12 h-6 rounded-full transition-colors shadow-premium-sm" style={{ background: '#DC143C' }}>
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">Deposit required</div>
                      <div className="text-sm text-gray-500">Require 20% deposit on booking</div>
                    </div>
                    <button className="relative w-12 h-6 rounded-full transition-colors shadow-premium-sm" style={{ background: '#DC143C' }}>
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
