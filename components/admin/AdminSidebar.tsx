'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  FileText,
  Image,
  Settings,
  Users,
  BarChart3,
  Home,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Globe,
  Mail,
  CreditCard,
  Shield,
  Bell,
  FolderKanban,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  href?: string;
  badge?: number | string;
  children?: NavItem[];
}

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    id: 'content',
    label: 'Content',
    icon: FolderKanban,
    children: [
      { id: 'tours', label: 'Tours', icon: MapPin, href: '/admin/tours' },
      { id: 'blog', label: 'Blog Posts', icon: FileText, href: '/admin/blog' },
      { id: 'media', label: 'Media Library', icon: Image, href: '/admin/media' },
      { id: 'hero', label: 'Hero Slides', icon: Globe, href: '/admin/hero' },
    ],
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: Calendar,
    href: '/admin/bookings',
    badge: '5', // This would be dynamic
  },
  {
    id: 'inquiries',
    label: 'Inquiries',
    icon: Mail,
    href: '/admin/inquiries',
    badge: '3', // This would be dynamic
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    href: '/admin/customers',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    href: '/admin/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      { id: 'general', label: 'General', icon: Settings, href: '/admin/settings/general' },
      { id: 'site', label: 'Site Settings', icon: Globe, href: '/admin/settings/site' },
      { id: 'navigation', label: 'Navigation', icon: Menu, href: '/admin/settings/navigation' },
      { id: 'users', label: 'Users & Roles', icon: Shield, href: '/admin/settings/users' },
      { id: 'payments', label: 'Payments', icon: CreditCard, href: '/admin/settings/payments' },
    ],
  },
];

export function AdminSidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['content', 'settings']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-white border-r shadow-xl lg:shadow-none
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-20 px-6 border-b">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">Admin Panel</div>
                <div className="text-xs text-gray-500">Wangchuk Tours</div>
              </div>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto" style={{ background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)' }}>
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-24 h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-gray-200 shadow-sm hover:bg-gray-50"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.id);
            const isItemActive = hasChildren
              ? item.children?.some(child => child.href ? isActive(child.href) : false)
              : item.href ? isActive(item.href) : false;

            return (
              <div key={item.id}>
                {hasChildren ? (
                  <>
                    {/* Parent Item with Children */}
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`
                        w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                        transition-all duration-200
                        ${isCollapsed ? 'justify-center' : 'justify-between'}
                        ${isItemActive ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}
                      `}
                      style={isItemActive ? {
                        background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                      } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      )}
                    </button>

                    {/* Children */}
                    {!isCollapsed && isExpanded && (
                      <div className="mt-1 ml-8 space-y-1">
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <Link
                              key={child.id}
                              href={child.href || '#'}
                              onClick={onMobileClose}
                              className={`
                                flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium
                                transition-all duration-200
                                ${child.href && isActive(child.href)
                                  ? 'text-white bg-red-50'
                                  : 'text-gray-600 hover:bg-gray-50'
                                }
                              `}
                              style={child.href && isActive(child.href) ? { color: '#DC143C' } : {}}
                            >
                              <ChildIcon className="h-4 w-4 shrink-0" />
                              <span>{child.label}</span>
                              {child.badge && (
                                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  /* Single Item */
                  <Link
                    href={item.href || '#'}
                    onClick={onMobileClose}
                    className={`
                      flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                      transition-all duration-200
                      ${isCollapsed ? 'justify-center' : ''}
                      ${isItemActive ? 'text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}
                    `}
                    style={isItemActive ? {
                      background: 'linear-gradient(135deg, #DC143C 0%, #B91C1C 100%)',
                    } : {}}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t p-4 space-y-1">
          <Link
            href="/"
            target="_blank"
            className={`
              flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
              text-gray-700 hover:bg-gray-100 transition-all duration-200
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <Home className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>View Website</span>}
          </Link>
          <button
            className={`
              w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
              text-red-600 hover:bg-red-50 transition-all duration-200
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}