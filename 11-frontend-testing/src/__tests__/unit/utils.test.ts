import { describe, it, expect } from 'vitest';
import { formatBookTitle, calculateReadingTime, validateISBN } from '@/lib/utils';

describe('formatBookTitle', () => {
  it('trims whitespace', () => {
    expect(formatBookTitle('  Hello World  ')).toBe('Hello World');
  });

  it('collapses multiple spaces', () => {
    expect(formatBookTitle('The   Great   Gatsby')).toBe('The Great Gatsby');
  });

  it('handles empty string', () => {
    expect(formatBookTitle('')).toBe('');
  });
});

describe('calculateReadingTime', () => {
  it('returns minutes for short books', () => {
    expect(calculateReadingTime(15)).toBe('30 min');
  });

  it('returns hours for exact multiples', () => {
    expect(calculateReadingTime(300)).toBe('10h');
  });

  it('returns combined format', () => {
    expect(calculateReadingTime(45)).toBe('1h 30min');
  });

  it('handles zero pages', () => {
    expect(calculateReadingTime(0)).toBe('0 min');
  });

  it('handles negative pages', () => {
    expect(calculateReadingTime(-10)).toBe('0 min');
  });
});

describe('validateISBN', () => {
  it('validates correct ISBN-13', () => {
    expect(validateISBN('978-0-306-40615-7')).toBe(true);
  });

  it('rejects invalid ISBN-13', () => {
    expect(validateISBN('978-0-306-40615-0')).toBe(false);
  });

  it('rejects random strings', () => {
    expect(validateISBN('not-an-isbn')).toBe(false);
  });
});
