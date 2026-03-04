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
  loginAction: vi.fn(),
}));

import LoginPage from '@/app/login/page';

describe('LoginPage', () => {
  it('renders username and password fields', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText('Username')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
  });

  it('password field has type="password"', () => {
    render(<LoginPage />);
    const input = screen.getByLabelText('Password') as HTMLInputElement;
    expect(input.type).toBe('password');
  });
});
