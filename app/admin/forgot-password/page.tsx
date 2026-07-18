'use client';

import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-6">
            <Mail className="w-7 h-7 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Reset Password</h1>
          <p className="text-gray-600 mb-8">
            Password reset is not available online yet. Contact your site administrator
            to reset your admin account password.
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
