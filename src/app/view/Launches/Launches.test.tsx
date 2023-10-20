/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import Launches from '.';
import { SWRConfig } from 'swr';

const NoCacheLaunches = () => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <Launches />
  </SWRConfig>
);

describe('Launches', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders Launches View with skeleton cards on load', async () => {
    render(<NoCacheLaunches />);

    expect(screen.getAllByTestId('skeleton-card').length).toBe(5);
  });

  it('Renders Launches View with error message after failed load', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce({});
    render(<NoCacheLaunches />);

    expect(screen.getAllByTestId('skeleton-card').length).toBe(5);

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(screen.getByText('Error loading data...')).toBeInTheDocument());
  });

  it('Renders Launches View with no data', async () => {
    const emptyData: ApiResult = { results: [] };
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: emptyData });

    render(<NoCacheLaunches />);

    act(() => {
      jest.runAllTimers();
    });
    await waitFor(() => expect(screen.getByText('No launch data...')).toBeInTheDocument());
    jest.clearAllTimers();
  });

  it('Renders Launches View with data after successful call', async () => {
    const dummyData: ApiResult = {
      results: [
        {
          id: '1',
          launchName: 'Test Launch',
          rocketName: 'Test Rocket',
          launchpadName: 'Test Launchpad',
          details: 'Test Details',
          date: '2021-09-15T10:00:00.000Z',
          success: true,
        },
        {
          id: '2',
          launchName: 'Test Launch 2',
          rocketName: 'Test Rocket 2',
          launchpadName: 'Test Launchpad 2',
          details: 'Test Details 2',
          date: '2022-10-12T12:00:00.000Z',
          success: false,
        },
      ],
    };
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: dummyData });

    render(<NoCacheLaunches />);

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => expect(screen.getAllByTestId('launch-card').length).toBe(2));
  });

  it('Renders Launches View with cached data', async () => {
    const firstResponse: ApiResult = {
      results: [
        {
          id: '1',
          launchName: 'Test Launch',
          rocketName: 'Test Rocket',
          launchpadName: 'Test Launchpad',
          details: 'Test Details',
          date: '2021-09-15T10:00:00.000Z',
          success: true,
        },
      ],
    };
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: firstResponse });

    const { rerender } = render(<NoCacheLaunches />);

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => expect(screen.getByTestId('launch-chip')).toHaveTextContent('Success'));

    const secondResponse: ApiResult = {
      results: [
        {
          id: '2',
          launchName: 'Test Launch 2',
          rocketName: 'Test Rocket 2',
          launchpadName: 'Test Launchpad 2',
          details: 'Test Details 2',
          date: '2022-10-12T12:00:00.000Z',
          success: false,
        },
      ],
    };
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: secondResponse });

    rerender(<NoCacheLaunches />);

    act(() => {
      jest.runAllTimers();
    });

    // Assert data has not changed from first response
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(firstResponse.results[0].launchName);
    await waitFor(() => expect(screen.getByTestId('launch-chip')).toHaveTextContent('Success'));
  });
});
