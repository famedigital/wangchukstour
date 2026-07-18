'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { useRouter } from 'next/navigation';
import type { AdminUser } from '@/lib/auth/rbac';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setAuthError(null);
          return;
        }

        const refreshResponse = await fetch('/api/auth/refresh', { method: 'POST' });
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setUser(refreshData.user);
          setAuthError(null);
          return;
        }

        setAuthError('Authentication failed. Please log in again.');
        setTimeout(() => router.push('/admin/login'), 1500);
      } catch {
        setAuthError('Connection error. Please try again.');
        setTimeout(() => router.push('/admin/login'), 2000);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.role === 'admin' || (user.permissions?.includes(permission) ?? false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <h2 className="text-red-800 font-semibold mb-2">Authentication Error</h2>
            <p className="text-red-600">{authError}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/admin/login')}
            className="min-h-11 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar
        user={user}
        hasPermission={hasPermission}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader
          user={user}
          onMobileMenuOpen={() => setIsMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
