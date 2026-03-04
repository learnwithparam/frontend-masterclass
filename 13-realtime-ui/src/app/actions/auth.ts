'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API = process.env.BACKEND_URL || 'http://localhost:3000/api';

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) return 'Invalid username or password';

  const { token } = await res.json();
  const cookieStore = await cookies();
  // SECURITY TRADE-OFF: httpOnly is false so client-side JS can read the token
  // for WebSocket authentication (browser WS API doesn't support custom headers).
  // In production, consider a dedicated /ws-token endpoint or BFF pattern instead.
  cookieStore.set('token', token, { httpOnly: false, path: '/', sameSite: 'lax' });
  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/login');
}
