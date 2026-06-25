'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

// Mock data for visualization
const mockStats = {
  totalBookings: 156,
  pendingBookings: 23,
  confirmedBookings: 98,
  cancelledBookings: 35,
  totalRevenue: 245600,
  monthlyRevenue: 42500,
  activeTours: 12,
  totalInquiries: 342,
};

const mockRecentBookings = [
  {
    id: 'BKG-001',
    clientName: 'John Smith',
    email: 'john.smith@email.com',
    tour: 'Cultural Highlights of Bhutan',
    date: '2025-07-15',
    travelers: 2,
    amount: 4200,
    status: 'confirmed',
  },
  {
    id: 'BKG-002',
    clientName: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    tour: 'Druk Path Trek',
    date: '2025-08-20',
    travelers: 4,
    amount: 8800,
    status: 'pending',
  },
  {
    id: 'BKG-003',
    clientName: 'Michael Chen',
    email: 'm.chen@email.com',
    tour: 'Paro Tsechu Festival Tour',
    date: '2025-09-10',
    travelers: 3,
    amount: 7500,
    status: 'pending',
  },
  {
    id: 'BKG-004',
    clientName: 'Emily Davis',
    email: 'emily.d@email.com',
    tour: 'Bhutan Spiritual Journey',
    date: '2025-06-30',
    travelers: 2,
    amount: 5200,
    status: 'confirmed',
  },
];

const mockTours = [
  {
    id: 1,
    title: 'Cultural Highlights of Bhutan',
    category: 'cultural',
    duration: 7,
    difficulty: 'easy',
    price: 2100,
    status: 'active',
    bookings: 45,
  },
  {
    id: 2,
    title: 'Druk Path Trek',
    category: 'trekking',
    duration: 12,
    difficulty: 'challenging',
    price: 3200,
    status: 'active',
    bookings: 28,
  },
  {
    id: 3,
    title: 'Paro Tsechu Festival Tour',
    category: 'festival',
    duration: 8,
    difficulty: 'moderate',
    price: 2800,
    status: 'active',
    bookings: 67,
  },
  {
    id: 4,
    title: 'Bhutan Spiritual Journey',
    category: 'spiritual',
    duration: 10,
    difficulty: 'easy',
    price: 2600,
    status: 'active',
    bookings: 34,
  },
];

const mockInquiries = [
  {
    id: 'INQ-001',
    name: 'Robert Wilson',
    email: 'r.wilson@email.com',
    subject: 'Custom Tour Inquiry',
    message: 'Interested in a 14-day customized tour focusing on monasteries.',
    date: '2025-06-24',
    status: 'new',
  },
  {
    id: 'INQ-002',
    name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    subject: 'Pricing Question',
    message: 'What discounts are available for groups of 6+ people?',
    date: '2025-06-23',
    status: 'responded',
  },
  {
    id: 'INQ-003',
    name: 'David Martinez',
    email: 'd.martinez@email.com',
    subject: 'Trekking Difficulty',
    message: 'Is the Druk Path trek suitable for beginners?',
    date: '2025-06-22',
    status: 'new',
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'tours', label: 'Tours', icon: MapPin },
    { id: 'inquiries', label: 'Inquiries', icon: FileText },
    { id: 'blog', label: 'Blog/CMS', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
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
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r shadow-lg">
        <div className="flex h-20 items-center justify-between px-6 border-b">
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
                    ? 'bg-primary text-white shadow-md'
                    : 'hover:bg-gray-100 text-gray-600'
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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Website
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
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
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+12%</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{mockStats.totalBookings}</div>
                  <div className="text-sm text-gray-500">Total Bookings</div>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-amber-600 text-sm font-medium">{mockStats.pendingBookings} pending</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{mockStats.pendingBookings}</div>
                  <div className="text-sm text-gray-500">Pending</div>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-green-600 text-sm font-medium">+18%</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">${mockStats.monthlyRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Monthly Revenue</div>
                </CardContent>
              </Card>

              <Card className="border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-blue-600 text-sm font-medium">+8%</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{mockStats.activeTours}</div>
                  <div className="text-sm text-gray-500">Active Tours</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card className="border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>
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
                      {mockRecentBookings.map((booking) => (
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
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'bookings' && (
          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">All Bookings</h2>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)', color: 'white' }}>
                    <Check className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {mockRecentBookings.map((booking) => (
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
            </CardContent>
          </Card>
        )}

        {activeTab === 'tours' && (
          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Manage Tours</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                  <Plus className="h-4 w-4" />
                  Add New Tour
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockTours.map((tour) => (
                  <Card key={tour.id} className="border hover:shadow-md transition-shadow">
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
            </CardContent>
          </Card>
        )}

        {activeTab === 'inquiries' && (
          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Customer Inquiries</h2>
                <Badge>{mockInquiries.length} new</Badge>
              </div>

              <div className="space-y-4">
                {mockInquiries.map((inquiry) => (
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
            </CardContent>
          </Card>
        )}

        {activeTab === 'blog' && (
          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Blog / Content Management</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                  <Plus className="h-4 w-4" />
                  New Post
                </button>
              </div>

              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Blog management module - Coming Soon</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="Wangchuk Tours & Treks"
                      className="w-full px-4 py-3 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Email</label>
                    <input
                      type="email"
                      defaultValue="admin@wangchuktour.com"
                      className="w-full px-4 py-3 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 border rounded-xl">
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

            <Card className="border">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Booking Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium">Auto-confirm bookings</div>
                      <div className="text-sm text-gray-500">Automatically confirm bookings under $5000</div>
                    </div>
                    <button className="relative w-12 h-6 rounded-full transition-colors" style={{ background: '#E5E7EB' }}>
                      <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium">Email notifications</div>
                      <div className="text-sm text-gray-500">Receive email for new bookings</div>
                    </div>
                    <button className="relative w-12 h-6 rounded-full transition-colors" style={{ background: '#DC143C' }}>
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">Deposit required</div>
                      <div className="text-sm text-gray-500">Require 20% deposit on booking</div>
                    </div>
                    <button className="relative w-12 h-6 rounded-full transition-colors" style={{ background: '#DC143C' }}>
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform" />
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
