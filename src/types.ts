type Launch = {
  id: string;
  launchName: string;
  rocketName: string;
  launchpadName: string;
  details: string;
  date: string;
  success: boolean;
};

type ApiResult = {
  results: Launch[];
};

type ProcessEnvironment = Readonly<{
  SPACEX_API_BASE_URL: string;
}>;
