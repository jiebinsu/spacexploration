import { handleErrors } from '@/error-handler';
import { NextApiRequest, NextApiResponse } from 'next/types';

describe('handleErrors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 500 if handler throws error', async () => {
    const handler = jest.fn().mockRejectedValue(new Error('Any error msg'));
    const req = {} as NextApiRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as NextApiResponse;

    const error = new Error('Any error msg');
    await handleErrors(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });

  it('should return if handler does not throw error', async () => {
    const handler = jest.fn().mockResolvedValue({});
    const req = {} as NextApiRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as NextApiResponse;

    await handleErrors(handler)(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
