import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | Wangchuk Tours',
  description: 'Sign in to the Wangchuk Tours & Treks admin dashboard',
  applicationName: 'Wangchuk Admin',
  manifest: '/admin-pwa/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Wangchuk Admin',
  },
  icons: {
    icon: [
      { url: '/admin-pwa/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/admin-pwa/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/admin-pwa/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#9f1239',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
