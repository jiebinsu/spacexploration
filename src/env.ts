export const getEnv = (): ProcessEnvironment => {
  if (!process.env['SPACEX_API_BASE_URL']) {
    throw new Error('SPACEX_API_BASE_URL not defined');
  }

  return Object.freeze({
    SPACEX_API_BASE_URL: process.env['SPACEX_API_BASE_URL'],
  });
};
