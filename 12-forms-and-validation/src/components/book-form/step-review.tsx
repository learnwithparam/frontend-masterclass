'use client';

import type { BookDetails } from '@/lib/validation/book.schema';

interface StepReviewProps {
  data: BookDetails;
  coverFile: File | null;
  onBack: () => void;
  onSubmit: () => void;
  pending: boolean;
  error?: string;
  success?: boolean;
}

export function StepReview({ data, coverFile, onBack, onSubmit, pending, error, success }: StepReviewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Review & Submit</h2>

      <div className="bg-white border rounded-lg p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Title:</span>
          <span className="font-medium">{data.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Author:</span>
          <span className="font-medium">{data.author}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Pages:</span>
          <span className="font-medium">{data.pages}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Published:</span>
          <span className="font-medium">{data.published}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Cover:</span>
          <span className="font-medium">{coverFile ? coverFile.name : 'None'}</span>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
      {success && <p className="text-green-600 text-sm" role="status">Book added successfully!</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={pending}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={pending || success}
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {pending ? 'Submitting...' : 'Submit Book'}
        </button>
      </div>
    </div>
  );
}
