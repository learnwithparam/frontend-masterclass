/**
 * Accessible Field Error Component
 *
 * KEY CONCEPT: aria-describedby links the error message to the input.
 * Screen readers announce "Title is required" when the user focuses the
 * title input. Without this, blind users see errors but don't know which
 * field they belong to.
 */

interface FieldErrorProps {
  id: string;
  message?: string;
}

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p id={id} className="mt-1 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}
