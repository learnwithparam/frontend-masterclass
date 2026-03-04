/**
 * Shared Zod Schema — Used on BOTH Client and Server
 *
 * KEY CONCEPT: Define validation once, use everywhere. The same schema
 * validates the form on the client (instant feedback) and the server
 * action (security). If they diverge, you get inconsistent errors.
 */
import { z } from 'zod';

export const BookDetailsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  author: z.string().min(1, 'Author is required').max(255, 'Author is too long'),
  pages: z.coerce.number().int('Must be a whole number').positive('Pages must be positive'),
  published: z.string().min(1, 'Published date is required'),
});

export const BookCoverSchema = z.object({
  cover: z.any().optional(), // File validation happens server-side
});

export const FullBookSchema = BookDetailsSchema.merge(BookCoverSchema);

export type BookDetails = z.infer<typeof BookDetailsSchema>;
export type FullBook = z.infer<typeof FullBookSchema>;
