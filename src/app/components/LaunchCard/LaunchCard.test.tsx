/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import LaunchCard from '.';

const successDummyData: Launch = {
  id: '1',
  launchName: 'Test Launch',
  rocketName: 'Test Rocket',
  launchpadName: 'Test Launchpad',
  details: 'Test Details',
  date: '2021-09-15T10:00:00.000Z',
  success: true,
};

const failedDummyData: Launch = {
  id: '2',
  launchName: 'Fail Launch',
  rocketName: 'Fail Rocket',
  launchpadName: 'Fail Launchpad',
  details: 'Fail Details',
  date: '2006-03-24T22:30:00.000Z',
  success: false,
};

describe('LaunchCard', () => {
  it('Renders Success LaunchCard successfully', () => {
    render(<LaunchCard data={successDummyData} />);

    expect(screen.getAllByTestId('launch-card').length).toBe(1);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(successDummyData.launchName);
    expect(screen.getByTestId('launch-date')).toHaveTextContent('9/15/2021, 11:00:00 AM');
    expect(screen.getByTestId('launch-chip')).toHaveTextContent('Success');
    expect(screen.getByText(`Rocket Name: ${successDummyData.rocketName}`)).toBeInTheDocument();
    expect(screen.getByText(`Launchpad Name: ${successDummyData.launchpadName}`)).toBeInTheDocument();
    expect(screen.getByText(successDummyData.details)).toBeInTheDocument();
  });

  it('Renders Failed LaunchCard successfully', () => {
    render(<LaunchCard data={failedDummyData} />);

    expect(screen.getAllByTestId('launch-card').length).toBe(1);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(failedDummyData.launchName);
    expect(screen.getByTestId('launch-date')).toHaveTextContent('3/24/2006, 10:30:00 PM');
    expect(screen.getByTestId('launch-chip')).toHaveTextContent('Failed');
    expect(screen.getByText(`Rocket Name: ${failedDummyData.rocketName}`)).toBeInTheDocument();
    expect(screen.getByText(`Launchpad Name: ${failedDummyData.launchpadName}`)).toBeInTheDocument();
    expect(screen.getByText(failedDummyData.details)).toBeInTheDocument();
  });
});
