/**
 * @jest-environment node
 */

import axios from 'axios';
import { getLaunchPadNamesById, getLaunches, getRocketNamesById } from '@/services/spacex';
import nock from 'nock';

const nockSuccessfulResponse = (path: string, docs: SpaceXRocket[] | SpaceXLaunchPad[]) => {
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

describe('SpaceX Service', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  describe('getLaunches', () => {
    it('should return empty list if no items (docs) in response', async () => {
      nockSuccessfulResponse('/launches/query', []);

      await expect(getLaunches()).resolves.toEqual([]);
    });

    it('should return items (docs) from response', async () => {
      const launches: SpaceXLaunch[] = [
        {
          id: '1',
          name: 'Launch 1',
          rocket: '1',
          launchpad: '1',
          details: 'Details 1',
          date_utc: '2021-01-01T00:00:00.000Z',
          success: true,
        },
        {
          id: '2',
          name: 'Launch 2',
          rocket: '2',
          launchpad: '2',
          details: 'Details 2',
          date_utc: '2021-01-02T00:00:00.000Z',
          success: true,
        },
      ];
      nockSuccessfulResponse('/launches/query', launches);

      await expect(getLaunches()).resolves.toEqual(launches);
    });

    it.each([400, 401, 403, 500])('should throw error if response fails', async (statusCode) => {
      nockErrorResponse('/launches/query', statusCode, 'Any error msg');

      await expect(getLaunches()).rejects.toThrow(`Request failed with status code ${statusCode}`);
    });

    it('calls external api with default params', async () => {
      const spy = jest.spyOn(axios, 'post');
      nockSuccessfulResponse('/launches/query', []);

      await getLaunches();

      const expectedUrl = `${process.env.SPACEX_API_BASE_URL}/launches/query`;
      const expectedParams = {
        query: {
          upcoming: false,
        },
        options: {
          limit: 10,
          page: 1,
          select: 'name rocket launchpad details date_utc success',
          sort: {
            date_utc: 'asc',
          },
        },
      };
      expect(spy).toHaveBeenCalledWith(expectedUrl, expectedParams);
      spy.mockRestore();
    });

    it.each([
      [1, 10, 'asc'],
      [1, 10, 'desc'],
      [2, 10, 'asc'],
      [1, 5, 'asc'],
      [4, 5, 'desc'],
    ])('calls external api with correct params', async (page, limit, sort) => {
      const spy = jest.spyOn(axios, 'post');
      nockSuccessfulResponse('/launches/query', []);

      await getLaunches(page, limit, sort as 'asc' | 'desc');

      const expectedUrl = `${process.env.SPACEX_API_BASE_URL}/launches/query`;
      const expectedParams = {
        query: {
          upcoming: false,
        },
        options: {
          limit,
          page,
          select: 'name rocket launchpad details date_utc success',
          sort: {
            date_utc: sort,
          },
        },
      };
      expect(spy).toHaveBeenCalledWith(expectedUrl, expectedParams);
      spy.mockRestore();
    });
  });

  describe('getRocketNamesById', () => {
    it('should return empty list if no items (docs) in response', async () => {
      nockSuccessfulResponse('/rockets/query', []);

      await expect(getRocketNamesById(['any', 'test'])).resolves.toEqual({});
    });

    it('should return empty list if empty array passed as input', async () => {
      await expect(getRocketNamesById([])).resolves.toEqual({});
    });

    it('should return items (docs) from response', async () => {
      const rockets: SpaceXRocket[] = [
        {
          id: '1',
          name: 'Rocket 1',
        },
        {
          id: '2',
          name: 'Rocket 2',
        },
      ];
      nockSuccessfulResponse('/rockets/query', rockets);
      const expected = {
        '1': 'Rocket 1',
        '2': 'Rocket 2',
      };

      await expect(getRocketNamesById(['1', '2'])).resolves.toEqual(expected);
    });

    it.each([400, 401, 403, 500])('should throw error if response fails', async (statusCode) => {
      nockErrorResponse('/rockets/query', statusCode, 'Any error msg');

      await expect(getRocketNamesById(['any'])).rejects.toThrow(`Request failed with status code ${statusCode}`);
    });
  });

  describe('getLaunchPadNamesById', () => {
    it('should return empty list if no items (docs) in response', async () => {
      nockSuccessfulResponse('/launchpads/query', []);

      await expect(getLaunchPadNamesById(['any', 'test'])).resolves.toEqual({});
    });

    it('should return empty list if empty array passed as input', async () => {
      await expect(getLaunchPadNamesById([])).resolves.toEqual({});
    });

    it('should return items (docs) from response', async () => {
      const launchpads: SpaceXRocket[] = [
        {
          id: '1',
          name: 'LaunchPad A',
        },
        {
          id: '2',
          name: 'LaunchPad B',
        },
        {
          id: '3',
          name: 'LaunchPad C',
        },
      ];
      nockSuccessfulResponse('/launchpads/query', launchpads);
      const expected = {
        '1': 'LaunchPad A',
        '2': 'LaunchPad B',
        '3': 'LaunchPad C',
      };

      await expect(getLaunchPadNamesById(['1', '2'])).resolves.toEqual(expected);
    });

    it.each([400, 401, 403, 500])('should throw error if response fails', async (statusCode) => {
      nockErrorResponse('/launchpads/query', statusCode, 'Any error msg');

      await expect(getLaunchPadNamesById(['any'])).rejects.toThrow(`Request failed with status code ${statusCode}`);
    });
  });
});
