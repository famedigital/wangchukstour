'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, User, Settings, LogOut, Menu, Moon, Sun } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onMobileMenuOpen: () => void;
  user?: {
    name: string;
    email: string;
    avatar_url?: string;
    role: string;
  };
}

type NotificationItem = {
  id: string;
  type: 'booking' | 'inquiry';
  title: string;
  message: string;
  href: string;
  time: string;
  unread: boolean;
};

export function AdminHeader({ onMobileMenuOpen, user }: AdminHeaderProps) {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      const res = await fetch('/api/admin/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.counts?.unread || 0);
    } catch {
      // keep previous
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60_000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    if (showNotifications) loadNotifications();
  }, [showNotifications, loadNotifications]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setShowUserMenu(false);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_inquiries_read' }),
      });
      await loadNotifications();
      // Notify sidebar to refresh badges
      window.dispatchEvent(new Event('admin-badges-refresh'));
    } catch {
      // ignore
    }
  };

  const openNotification = async (n: NotificationItem) => {
    setShowNotifications(false);
    if (n.type === 'inquiry') {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_inquiry_read', id: n.id }),
      });
      window.dispatchEvent(new Event('admin-badges-refresh'));
    }
    router.push(n.href);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onMobileMenuOpen}
            className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>

          <div className="relative hidden w-full max-w-md md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tours, bookings, customers…"
              className="h-9 bg-muted/60 pl-9"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-lg border border-border bg-card shadow-lg sm:w-96">
                  <div className="border-b border-border p-4">
                    <h3 className="font-heading text-sm font-semibold">Notifications</h3>
                    <p className="text-xs text-muted-foreground">
                      {unreadCount > 0
                        ? `${unreadCount} pending booking${unreadCount === 1 ? '' : 's'} / new inquir${unreadCount === 1 ? 'y' : 'ies'}`
                        : 'You\'re all caught up'}
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {loadingNotifications && notifications.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground">Loading…</p>
                    ) : notifications.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground">No new notifications</p>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => openNotification(notification)}
                          className={cn(
                            'w-full border-b border-border/60 p-4 text-left last:border-0 hover:bg-muted/60',
                            notification.unread && 'bg-primary/5'
                          )}
                        >
                          <p className="text-sm font-medium text-foreground">{notification.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">{notification.time}</p>
                        </button>
                      ))
                    )}
                  </div>
                  <div className="flex items-center gap-2 border-t border-border bg-muted/40 p-3">
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="flex-1 text-center text-sm font-medium text-primary hover:underline"
                    >
                      Mark inquiries read
                    </button>
                    <Link
                      href="/admin/bookings"
                      onClick={() => setShowNotifications(false)}
                      className="flex-1 text-center text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      View bookings
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 rounded-md p-1.5 hover:bg-muted"
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="size-8 rounded-full object-cover" />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-primary">
                  <User className="size-4 text-primary-foreground" />
                </div>
              )}
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-none">{user?.name || 'Admin User'}</p>
                <p className="mt-1 text-xs capitalize text-muted-foreground">{user?.role || 'Admin'}</p>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                  <div className="border-b border-border p-3">
                    <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email || 'admin@wangchuktour.com'}
                    </p>
                  </div>
                  <div className="p-1">
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <User className="size-4 text-muted-foreground" />
                      My Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/admin/settings/general');
                      }}
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Settings className="size-4 text-muted-foreground" />
                      Settings
                    </button>
                  </div>
                  <div className="border-t border-border p-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <LogOut className="size-4" />
                      {isLoggingOut ? 'Logging out…' : 'Log out'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
