import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

const LOGGER = logger(import.meta.url);

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    if (req.method === 'GET') {
      LOGGER.info('reis plaatsen ogehaald uit database');
      const plaatsen = await prisma.reizen.findMany();

      return res.status(200).json(plaatsen);
    }

    return res.status(500).end();
  } else {
    return res.status(500).json({
      isLoggedIn: false
    });
  }
}
