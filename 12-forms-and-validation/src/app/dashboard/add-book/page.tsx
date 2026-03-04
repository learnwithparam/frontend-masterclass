'use client';

import { useState, useTransition } from 'react';
import { FormProgress } from '@/components/book-form/form-progress';
import { StepDetails } from '@/components/book-form/step-details';
import { StepCover } from '@/components/book-form/step-cover';
import { StepReview } from '@/components/book-form/step-review';
import { BookDetailsSchema, type BookDetails } from '@/lib/validation/book.schema';
import { addBookAction } from '../../actions/books';

const STEPS = ['Details', 'Cover', 'Review'];

export default function AddBookPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<BookDetails>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleChange(field: keyof BookDetails, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function handleNextFromDetails() {
    // Validate step 1 with Zod
    const result = BookDetailsSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);

      // Focus first error field for accessibility
      const firstErrorField = result.error.issues[0]?.path[0] as string;
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }
    setData(result.data);
    setStep(1);
  }

  function handleNextFromCover(file: File | null) {
    setCoverFile(file);
    setStep(2);
  }

  function handleSubmit() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set('title', data.title || '');
      formData.set('author', data.author || '');
      formData.set('pages', String(data.pages || ''));
      formData.set('published', data.published || '');
      if (coverFile) {
        formData.set('cover', coverFile);
      }

      const result = await addBookAction(null, formData);
      if (result?.error) {
        setSubmitError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
      <FormProgress currentStep={step} steps={STEPS} />

      {step === 0 && (
        <StepDetails data={data} errors={errors} onChange={handleChange} onNext={handleNextFromDetails} />
      )}
      {step === 1 && (
        <StepCover onNext={handleNextFromCover} onBack={() => setStep(0)} />
      )}
      {step === 2 && (
        <StepReview
          data={data as BookDetails}
          coverFile={coverFile}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          pending={pending}
          error={submitError}
          success={success}
        />
      )}
    </div>
  );
}
