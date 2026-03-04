/**
 * Pure Utility Functions
 *
 * KEY CONCEPT: Pure functions (same input → same output, no side effects)
 * are the easiest code to unit test. No mocking needed — just call the
 * function and assert the result. Start your testing journey here before
 * tackling components, hooks, or API calls.
 */

export function formatBookTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ');
}

export function calculateReadingTime(pages: number, pagesPerHour: number = 30): string {
  if (pages <= 0) return '0 min';
  const hours = Math.floor(pages / pagesPerHour);
  const minutes = Math.round((pages % pagesPerHour) / pagesPerHour * 60);
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
}

export function validateISBN(isbn: string): boolean {
  const cleaned = isbn.replace(/[-\s]/g, '');
  if (cleaned.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned[i]) * (10 - i);
    }
    const check = cleaned[9] === 'X' ? 10 : parseInt(cleaned[9]);
    return (sum + check) % 11 === 0;
  }
  if (cleaned.length === 13) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3);
    }
    return (10 - (sum % 10)) % 10 === parseInt(cleaned[12]);
  }
  return false;
}
