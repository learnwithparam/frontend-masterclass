import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useActionState: () => [null, '/api/stub', false],
  };
});

vi.mock('@/app/actions/auth', () => ({
  addBookAction: vi.fn(),
  logoutAction: vi.fn(),
}));

import DashboardPage from '@/app/dashboard/page';

describe('DashboardPage', () => {
  it('renders all book input fields', () => {
    render(<DashboardPage />);
    expect(screen.getByLabelText('Title')).toBeDefined();
    expect(screen.getByLabelText('Author')).toBeDefined();
    expect(screen.getByLabelText('Pages')).toBeDefined();
    expect(screen.getByText('Add Book')).toBeDefined();
  });
});
