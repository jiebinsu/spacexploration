type SpaceXResponse = {
  totalDocs: number;
  pages: number;
  totalPages: number;
  page: number;
  prevPage: number | null;
  nextPage: number | null;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

type SpaceXLaunch = {
  id: string;
  name: string;
  rocket: string;
  launchpad: string;
  details: string;
  date_utc: string;
  success: boolean;
};

type SpaceXRocket = {
  id: string;
  name: string;
};

type SpaceXLaunchPad = {
  id: string;
  name: string;
};

type SpaceXLaunchesResponse = SpaceXResponse & { docs: SpaceXLaunch[] };
type SpaceXRocketsResponse = SpaceXResponse & { docs: SpaceXRocket[] };
type SpaceXLaunchPadsResponse = SpaceXResponse & { docs: SpaceXLaunchPad[] };
