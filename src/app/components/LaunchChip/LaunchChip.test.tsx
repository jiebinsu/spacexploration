/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import LaunchChip from '.';

describe('LaunchChip', () => {
  it('Renders Success LaunchChip successfully', () => {
    render(<LaunchChip success />);

    expect(screen.getByTestId('launch-chip')).toHaveTextContent('Success');
  });

  it('Renders Failed LaunchChip successfully', () => {
    render(<LaunchChip success={false} />);

    expect(screen.getByTestId('launch-chip')).toHaveTextContent('Failed');
  });
});
