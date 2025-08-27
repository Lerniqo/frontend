'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/CommonComponents/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome to your Dashboard
          </h2>
          <p className="mt-4 text-center text-sm text-gray-500">
            This is a protected page that requires authentication.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}