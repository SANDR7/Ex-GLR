import logger from '@/lib/logger';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

const LOGGER = logger(import.meta.url);

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(500).end();

  if (req.session.user) {
    LOGGER.info('Gebruiker is uitgelogd');
    
    req.session.destroy();
    res.json({ isLoggedIn: false, login: '' });
  }

  LOGGER.warn('Iemand probeert deze route op te vragen');
}
