/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import Page from './page';

it('Renders page successfully', () => {
  render(<Page />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Docs');
});
