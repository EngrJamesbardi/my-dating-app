import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from '../app/login/page';

test('renders login form', () => {
  render(<LoginPage />);
  expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
});
