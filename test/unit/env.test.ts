import { getEnv } from '@/env';

describe('missing envs', () => {
  beforeEach(() => {
    process.env = { NODE_ENV: 'test' };
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should error if SPACEX_API_BASE_URL env not provided', async () => {
    try {
      getEnv();
    } catch (e: any) {
      expect(e.message).toBe('SPACEX_API_BASE_URL not defined');
    }
  });

  it('should return process env if all env vars provided', async () => {
    const expectedEnv = {
      SPACEX_API_BASE_URL: 'https://spacex.com',
    };
    process.env = {
      ...expectedEnv,
      NODE_ENV: 'test',
      foo: 'bar',
      PING: 'PONG',
    };

    expect(getEnv()).toEqual(expectedEnv);
  });
});
