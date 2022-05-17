import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { accounts } from '.prisma/client';

const LOGGER = logger(import.meta.url);

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    LOGGER.info('Ongeldig verzoek bij inloggen');
    return res.status(405).json({ message: 'Ongeldig verzoek' });
  }

  const { email, password } = req.body;

  const loggedInUser = await prisma.accounts.findFirst({
    where: { email, wachtwoord: password },
    select: { ID: true }
  });
  try {
    const findUser = await prisma.accounts.findFirst({
      where: {
        email,
        wachtwoord: password
      },
      select: {
        ID: true,
        email: true,
        wachtwoord: true
      }
    });

    // wanneer er geen gebuiker is gevonden geen sessie mee
    if (!findUser) {
      LOGGER.error(`Onbekend account: ${email}`);
      return res.json({
        message: `Geen account met email: ${email}`,
        ok: false
      });
    }

    req.session.user = loggedInUser as accounts;
    await req.session.save();

    return res.status(200).json({ user: findUser, ok: true });
  } catch (error) {
    //   Wanneer request ongeldig is
    if (loggedInUser?.ID === undefined) {
      LOGGER.info('Inlog poging mislukt vanwege niet bestaand account');
      return res.json({ message: 'Gebruiker bestaat niet', ok: false });
    }
    return res
      .status(500)
      .json({ message: (error as Error).message, ok: false });
  }
}
