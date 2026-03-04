'use client';

import { useState } from 'react';

interface StepCoverProps {
  onNext: (file: File | null) => void;
  onBack: () => void;
}

export function StepCover({ onNext, onBack }: StepCoverProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null;
    setFile(selected);

    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Cover Image (Optional)</h2>

      <div>
        <label htmlFor="cover" className="block text-sm font-medium text-gray-700">
          Upload a cover image (JPEG, PNG, WebP, max 5MB)
        </label>
        <input
          id="cover"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Preview:</p>
          <img src={preview} alt="Cover preview" className="w-48 h-auto rounded shadow" />
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onNext(file)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Next: Review
        </button>
      </div>
    </div>
  );
}
