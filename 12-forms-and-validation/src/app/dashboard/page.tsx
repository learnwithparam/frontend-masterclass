'use client';

import { logoutAction } from '../actions/auth';

export default function DashboardPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-red-600 hover:text-red-800">Logout</button>
        </form>
      </div>
      <a
        href="/dashboard/add-book"
        className="block text-center bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700"
      >
        Add New Book
      </a>
    </div>
  );
}
