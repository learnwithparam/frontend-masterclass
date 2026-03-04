'use client';

import { FieldError } from './field-error';
import type { BookDetails } from '@/lib/validation/book.schema';

interface StepDetailsProps {
  data: Partial<BookDetails>;
  errors: Record<string, string>;
  onChange: (field: keyof BookDetails, value: string) => void;
  onNext: () => void;
}

export function StepDetails({ data, errors, onChange, onNext }: StepDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Book Details</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="title"
          value={data.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          aria-invalid={!!errors.title}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <FieldError id="title-error" message={errors.title} />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
        <input
          id="author"
          value={data.author || ''}
          onChange={(e) => onChange('author', e.target.value)}
          aria-describedby={errors.author ? 'author-error' : undefined}
          aria-invalid={!!errors.author}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <FieldError id="author-error" message={errors.author} />
      </div>

      <div>
        <label htmlFor="pages" className="block text-sm font-medium text-gray-700">Pages</label>
        <input
          id="pages"
          type="number"
          value={data.pages || ''}
          onChange={(e) => onChange('pages', e.target.value)}
          aria-describedby={errors.pages ? 'pages-error' : undefined}
          aria-invalid={!!errors.pages}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <FieldError id="pages-error" message={errors.pages} />
      </div>

      <div>
        <label htmlFor="published" className="block text-sm font-medium text-gray-700">Published</label>
        <input
          id="published"
          value={data.published || ''}
          onChange={(e) => onChange('published', e.target.value)}
          aria-describedby={errors.published ? 'published-error' : undefined}
          aria-invalid={!!errors.published}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <FieldError id="published-error" message={errors.published} />
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Next: Cover Image
      </button>
    </div>
  );
}
