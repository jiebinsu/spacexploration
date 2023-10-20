import { NextApiRequest, NextApiResponse } from 'next/types';

export const handleErrors = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    return handler(req, res).catch((error: Error) => {
      return res.status(500).json({ error: error.message });
    });
  };
};
