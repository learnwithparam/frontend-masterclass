'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions/auth';

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input id="username" name="username" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input id="password" name="password" type="password" required className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={pending} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50">
          {pending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
