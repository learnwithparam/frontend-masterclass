'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { BookDetailsSchema } from '@/lib/validation/book.schema';

const API = process.env.BACKEND_URL || 'http://localhost:3000/api';

export async function addBookAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  // Server-side Zod validation (same schema as client)
  const validation = BookDetailsSchema.safeParse({
    title: formData.get('title'),
    author: formData.get('author'),
    pages: formData.get('pages'),
    published: formData.get('published'),
  });

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: `${firstError.path[0]}: ${firstError.message}` };
  }

  // Create the book
  const res = await fetch(`${API}/v1/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(validation.data),
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data.error || 'Failed to add book' };
  }

  const book = await res.json();

  // Upload cover if provided
  const coverFile = formData.get('cover') as File;
  if (coverFile && coverFile.size > 0) {
    const coverData = new FormData();
    coverData.set('cover', coverFile);

    const coverRes = await fetch(`${API}/v1/books/${book.id}/cover`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: coverData,
    });

    if (!coverRes.ok) {
      revalidatePath('/');
      return { error: 'Book created but cover upload failed. Try uploading again.' };
    }
  }

  revalidatePath('/');
  return { success: true };
}
