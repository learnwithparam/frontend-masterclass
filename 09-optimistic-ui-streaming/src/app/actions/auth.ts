/**
 * Server Actions — The Backend-For-Frontend (BFF) Pattern
 *
 * These functions run ONLY on the server. The client never sees the
 * backend URL or the JWT token. This is how production Next.js apps
 * handle mutations securely.
 */
'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const API = process.env.BACKEND_URL || 'http://localhost:3000/api'

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()
  if (!res.ok) {
    return { error: data.error || 'Login failed' }
  }

  // Store JWT in httpOnly cookie — invisible to client-side JavaScript!
  const cookieStore = await cookies()
  cookieStore.set('token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  })

  redirect('/dashboard')
}

export async function addBookAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return { error: 'Not authenticated' }
  }

  const payload = {
    title: formData.get('title') as string,
    author: formData.get('author') as string,
    pages: parseInt(formData.get('pages') as string, 10),
    published: formData.get('published') as string,
  }

  const res = await fetch(`${API}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) {
    return { error: data.error || 'Failed to add book' }
  }

  // Revalidate the catalog page so it refetches fresh data
  revalidatePath('/')

  return { success: true, title: payload.title }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
  redirect('/')
}
