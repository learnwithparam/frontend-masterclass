'use client';

import { useActionState } from 'react';
import { addBookAction, logoutAction } from '../actions/auth';

export default function DashboardPage() {
  const [result, formAction, pending] = useActionState(addBookAction, null);

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-red-600 hover:text-red-800">Logout</button>
        </form>
      </div>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input id="title" name="title" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input id="author" name="author" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="pages" className="block text-sm font-medium text-gray-700">Pages</label>
          <input id="pages" name="pages" type="number" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="published" className="block text-sm font-medium text-gray-700">Published</label>
          <input id="published" name="published" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        {result?.error && <p className="text-red-600 text-sm">{result.error}</p>}
        {result?.success && <p className="text-green-600 text-sm">Book added!</p>}
        <button type="submit" disabled={pending} className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50">
          {pending ? 'Adding...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
}
