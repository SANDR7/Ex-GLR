import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { ApiUserMutations } from '@/types/server';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

const LOGGER = logger(import.meta.url);

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = req.session.user as any;
  const { m } = req.query as ApiUserMutations; // if m as mutation e.g. posts

  if (!user || user?.isLoggedIn === false || !m) {
    LOGGER.warn(
      `Gebruiker probeerde toegang te krijgen tot deze route zonder token`
    );
    res.status(401).end();
    return;
  }

  // ============================================================

  if (req.method === 'PUT') {
    return res.status(201).json({ ok: true });
  }

  if (req.method === 'GET') {
    if (m === 'withRole') {
      const userSession = await prisma.accounts.findUnique({
        where: {
          ID: user.ID
        },
        select: {
          rol: true
        }
      });
      return res.json({ userSession, ok: true });
    }

    if (m === 'withNumbers') {
      const { p } = req.query;

      const userSession = await prisma.reizen.findFirst({
        where: {
          ID: p as string
        },
        select: {
          aanmeldingen: {
            select: {
              naam: true,
              studentNummer: true
            }
          }
        }
      });

      res.status(200).json({ ok: true, userSession });
    }

    if (m === 'withName') {
      const userSession = await prisma.accounts.findUnique({
        where: {
          ID: user.ID
        },
        select: {
          student: { select: { naam: true } },
          admin: { select: { naam: true } }
        }
      });

      return res.json({ userSession, ok: true });
    }

    return res
      .status(200)
      .json({ message: "geen 'm' parameter meegegeven", ok: true });
  }

  if (req.method === 'POST') {
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    return res.status(204).json({ ok: true });
  }
}
