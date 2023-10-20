/**
 * @jest-environment node
 */

import nock from 'nock';
import handler from '@/pages/api/launches';
import { NextApiRequest, NextApiResponse } from 'next/types';

const nockSuccessfulResponse = (path: string, docs: SpaceXRocket[]) => {
  const totalDocs = docs.length;
  return nock(process.env.SPACEX_API_BASE_URL!).post(path).once().reply(200, {
    docs,
    totalDocs,
    pages: 1,
    totalPages: 1,
    page: 1,
    prevPage: null,
    nextPage: null,
    hasPrevPage: false,
    hasNextPage: false,
  });
};

const nockErrorResponse = (path: string, status: number, message: string) => {
  return nock(process.env.SPACEX_API_BASE_URL!).post(path).once().reply(status, { message });
};

const mockedStatus = jest.fn();
const mockedJson = jest.fn();
const res: jest.Mocked<NextApiResponse> = {
  status: mockedStatus.mockReturnThis(),
  json: mockedJson,
} as unknown as jest.Mocked<NextApiResponse>;

const req = {} as NextApiRequest;

describe('/launches endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully returns launches', async () => {
    const launchesResponse: SpaceXLaunch[] = [
      {
        id: '1',
        name: 'Launch 1',
        rocket: 'abcd',
        launchpad: '1234',
        details: 'Details 1',
        date_utc: '2021-01-01T00:00:00.000Z',
        success: true,
      },
      {
        id: '2',
        name: 'Launch 2',
        rocket: 'qwer',
        launchpad: '7890',
        details: 'Details 2',
        date_utc: '2021-01-02T00:00:00.000Z',
        success: false,
      },
    ];
    nockSuccessfulResponse('/launches/query', launchesResponse);

    const rocketsResponse: SpaceXRocket[] = [
      {
        id: 'abcd',
        name: 'Rocket 1',
      },
      {
        id: 'qwer',
        name: 'Rocket 2',
      },
    ];
    nockSuccessfulResponse('/rockets/query', rocketsResponse);

    const launchpadResponse: SpaceXLaunchPad[] = [
      {
        id: '1234',
        name: 'Launchpad 1',
      },
      {
        id: '7890',
        name: 'Launchpad 2',
      },
    ];
    nockSuccessfulResponse('/launchpads/query', launchpadResponse);

    const expectedResults = [
      {
        id: '1',
        launchName: 'Launch 1',
        rocketName: 'Rocket 1',
        launchpadName: 'Launchpad 1',
        details: 'Details 1',
        date: new Date('2021-01-01T00:00:00.000Z'),
        success: true,
      },
      {
        id: '2',
        launchName: 'Launch 2',
        rocketName: 'Rocket 2',
        launchpadName: 'Launchpad 2',
        details: 'Details 2',
        date: new Date('2021-01-02T00:00:00.000Z'),
        success: false,
      },
    ];
    await handler(req, res);

    expect(mockedStatus).toHaveBeenCalledWith(200);
    expect(mockedJson).toHaveBeenCalledWith({ results: expectedResults });
  });

  it('returns empty results if no launches', async () => {
    nockSuccessfulResponse('/launches/query', []);
    await handler(req, res);

    expect(mockedStatus).toHaveBeenCalledWith(200);
    expect(mockedJson).toHaveBeenCalledWith({ results: [] });
  });

  it('returns unknown for rocket if rocket name not found', async () => {
    const launchesResponse: SpaceXLaunch[] = [
      {
        id: '1',
        name: 'Launch 1',
        rocket: 'abcd',
        launchpad: '1234',
        details: 'Details 1',
        date_utc: '2021-01-01T00:00:00.000Z',
        success: true,
      },
    ];
    nockSuccessfulResponse('/launches/query', launchesResponse);
    nockSuccessfulResponse('/rockets/query', []);

    const launchpadResponse: SpaceXLaunchPad[] = [
      {
        id: '1234',
        name: 'Launchpad 1',
      },
    ];
    nockSuccessfulResponse('/launchpads/query', launchpadResponse);

    const expectedResults = [
      {
        id: '1',
        launchName: 'Launch 1',
        rocketName: 'Unknown',
        launchpadName: 'Launchpad 1',
        details: 'Details 1',
        date: new Date('2021-01-01T00:00:00.000Z'),
        success: true,
      },
    ];
    await handler(req, res);

    expect(mockedStatus).toHaveBeenCalledWith(200);
    expect(mockedJson).toHaveBeenCalledWith({ results: expectedResults });
  });

  it('returns unknown for launchpadName if launchpad name not found', async () => {
    const launchesResponse: SpaceXLaunch[] = [
      {
        id: '1',
        name: 'Launch 1',
        rocket: 'abcd',
        launchpad: '1234',
        details: 'Details 1',
        date_utc: '2021-01-01T00:00:00.000Z',
        success: true,
      },
    ];
    nockSuccessfulResponse('/launches/query', launchesResponse);

    const rocketsResponse: SpaceXRocket[] = [
      {
        id: 'abcd',
        name: 'Rocket 1',
      },
    ];
    nockSuccessfulResponse('/rockets/query', rocketsResponse);
    nockSuccessfulResponse('/launchpads/query', []);

    const expectedResults = [
      {
        id: '1',
        launchName: 'Launch 1',
        rocketName: 'Rocket 1',
        launchpadName: 'Unknown',
        details: 'Details 1',
        date: new Date('2021-01-01T00:00:00.000Z'),
        success: true,
      },
    ];
    await handler(req, res);

    expect(mockedStatus).toHaveBeenCalledWith(200);
    expect(mockedJson).toHaveBeenCalledWith({ results: expectedResults });
  });

  it.each([400, 401, 403, 500])('should return 500 if error occurs', async (statusCode) => {
    nockErrorResponse('/launches/query', statusCode, 'Any error msg');

    await handler(req, res);

    expect(mockedStatus).toHaveBeenCalledWith(500);
    expect(mockedJson).toHaveBeenCalledWith({ error: `Request failed with status code ${statusCode}` });
  });

  it('returns unknown if get name queries fails', async () => {
    const launchesResponse: SpaceXLaunch[] = [
      {
        id: '1',
        name: 'Launch 1',
        rocket: 'abcd',
        launchpad: '1234',
        details: 'Details 1',
        date_utc: '2021-01-01T00:00:00.000Z',
        success: true,
      },
    ];
    nockSuccessfulResponse('/launches/query', launchesResponse);
    nockErrorResponse('/rockets/query', 500, 'Any error msg');
    nockErrorResponse('/launchpads/query', 500, 'Any error msg');

    const expectedResults = [
      {
        id: '1',
        launchName: 'Launch 1',
        rocketName: 'Unknown',
        launchpadName: 'Unknown',
        details: 'Details 1',
        date: new Date('2021-01-01T00:00:00.000Z'),
        success: true,
      },
    ];
    await handler(req, res);

    expect(mockedStatus).toHaveBeenCalledWith(200);
    expect(mockedJson).toHaveBeenCalledWith({ results: expectedResults });
  });
});
