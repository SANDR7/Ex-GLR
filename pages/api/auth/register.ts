import logger from '@/lib/logger';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

const LOGGER = logger(import.meta.url);

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {}
