import { logger } from '@/logger';
import { getLaunchPadNamesById, getLaunches, getRocketNamesById } from '@/services/spacex';
import type { NextApiRequest, NextApiResponse } from 'next';
import { handleErrors } from '@/error-handler';

export default handleErrors(async function handler(_req: NextApiRequest, res: NextApiResponse<ApiResult>) {
  const spaceXLaunches = await getLaunches();
  logger.info(`Retrieved ${spaceXLaunches.length} launches`);

  const uniqueRocketIds = [...new Set(spaceXLaunches.map((launch) => launch.rocket))];
  const uniqueLaunchPadIds = [...new Set(spaceXLaunches.map((launch) => launch.launchpad))];

  const [rocketNamesResult, launchPadNamesResult] = await Promise.allSettled([
    getRocketNamesById(uniqueRocketIds),
    getLaunchPadNamesById(uniqueLaunchPadIds),
  ]);

  const rocketToNameMap = rocketNamesResult.status === 'fulfilled' ? rocketNamesResult.value : {};
  const launchPadToNameMap = launchPadNamesResult.status === 'fulfilled' ? launchPadNamesResult.value : {};

  const launches: Launch[] = spaceXLaunches.map((launch) => ({
    id: launch.id,
    launchName: launch.name,
    rocketName: rocketToNameMap[launch.rocket] ?? 'Unknown',
    launchpadName: launchPadToNameMap[launch.launchpad] ?? 'Unknown',
    details: launch.details,
    date: launch.date_utc,
    success: launch.success,
  }));

  res.status(200).json({ results: launches });
  logger.info(`Successfully returned ${launches.length} launches`);
});
