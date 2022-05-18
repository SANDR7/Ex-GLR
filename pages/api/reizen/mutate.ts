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


  // gegevens ophalen van verzoek van de frontend
  const {
    title,
    description,
    destination,
    max,
    begin,
    end
  }: {
    title: string;
    description: string;
    destination: string;
    max: number;
    begin: string;
    end: string;
  } = req.body;

  const { id } = req.query;
  if (!user || user?.isLoggedIn === false || !m) {
    LOGGER.warn(
      `Gebruiker probeerde toegang te krijgen tot deze route zonder token`
    );
    res.status(401).end();
    return;
  }

  // ============================================================

  if (req.method === 'PUT') {
    // gegevens updaten
    if (m === 'udpateReis') {
      try {
        await prisma.reizen.update({
          where: {
            ID: id as string
          },
          data: {
            titel: title,
            omschrijving: description,
            bestemming: destination,
            maxAantal: max,
            beginDatum: begin,
            eindDatum: end
          }
        });

        LOGGER.info(`sucessvol reis met de naam: ${title} bijgewerkt`);
        return res.status(200).json({ ok: true });
      } catch (error) {
        LOGGER.info('Fout bij het maken van een reis');
        return res
          .status(500)
          .json({ message: (error as Error).message, ok: false });
      }
    }
    return res.status(201).json({ ok: true });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'POST') {
    // gegevens aanmaken / toevoegen
    if (m === 'createReis') {
      try {
        await prisma.administrator.update({
          where: {
            adminID: user.ID
          },
          data: {
            reizen: {
              connectOrCreate: {
                create: {
                  titel: title,
                  maxAantal: max,
                  bestemming: destination,
                  omschrijving: description,
                  beginDatum: begin,
                  eindDatum: end
                },
                where: {
                  ID: user.ID
                }
              }
            }
          }
        });
        LOGGER.info(`sucessvol reis met de naam: ${title} aangemaakt`);
        return res.status(200).json({ ok: true });
      } catch (error) {
        LOGGER.info('Fout bij het maken van een reis');
        return res
          .status(500)
          .json({ message: (error as Error).message, ok: false });
      }
    }

    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    return res.status(204).json({ ok: true });
  }
}
