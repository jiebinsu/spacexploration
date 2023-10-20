import axios from 'axios';
import { transformResponse } from './util';
import { getEnv } from '@/env';
import { logger } from '@/logger';

export const getLaunches = async (page: number = 1, limit: number = 10): Promise<SpaceXLaunchesResponse['docs']> => {
  const { SPACEX_API_BASE_URL } = getEnv();
  const body = {
    query: {
      upcoming: false,
    },
    options: {
      select: 'name rocket launchpad details date_utc success',
      page,
      limit,
      sort: {
        date_utc: 'desc',
      },
    },
  };

  return axios.post(`${SPACEX_API_BASE_URL}/launches/query`, body).then((res) => res.data.docs);
};

export const getRocketNamesById = async (rocketIds: string[]): Promise<Record<string, string>> => {
  if (rocketIds.length === 0) return {};

  const { SPACEX_API_BASE_URL } = getEnv();
  const params = {
    query: { _id: { $in: rocketIds } },
    options: { select: 'name' },
  };

  return axios.post(`${SPACEX_API_BASE_URL}/rockets/query`, params).then((res) => {
    const responseData: SpaceXRocketsResponse = res.data;
    if (responseData.totalDocs === 0) {
      logger.error(`No rockets found with ids: ${rocketIds}`);
    }
    return transformResponse(responseData);
  });
};

export const getLaunchPadNamesById = async (launchPadIds: string[]): Promise<Record<string, string>> => {
  if (launchPadIds.length === 0) return {};

  const { SPACEX_API_BASE_URL } = getEnv();
  const params = {
    query: { _id: { $in: launchPadIds } },
    options: { select: 'name' },
  };

  return axios.post(`${SPACEX_API_BASE_URL}/launchpads/query`, params).then((res) => {
    const responseData: SpaceXLaunchPadsResponse = res.data;
    if (responseData.totalDocs === 0) {
      logger.error(`No launchpads found with ids: ${launchPadIds}}`);
    }
    return transformResponse(responseData);
  });
};
