import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookCard } from '@/components/book-card';

describe('BookCard', () => {
  const defaultProps = {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    pages: 180,
    published: '1925',
  };

  it('renders the book title', () => {
    render(<BookCard {...defaultProps} />);
    expect(screen.getByText('The Great Gatsby')).toBeDefined();
  });

  it('renders the author with "by" prefix', () => {
    render(<BookCard {...defaultProps} />);
    expect(screen.getByText('by F. Scott Fitzgerald')).toBeDefined();
  });

  it('renders page count and published year', () => {
    render(<BookCard {...defaultProps} />);
    expect(screen.getByText('180 pages | Published: 1925')).toBeDefined();
  });

  it('has data-testid for E2E selection', () => {
    render(<BookCard {...defaultProps} />);
    expect(screen.getByTestId('book-card')).toBeDefined();
  });
});
