import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

const LOGGER = logger(import.meta.url);

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, reisID } = req.body;

  const user = req.session.user as any;

  if (req.session.user) {
    if (req.method === 'PUT') {
      const aanmelding = (await prisma.accounts.findUnique({
        where: { email },
        select: {
          ID: true
        }
      })) as any;

      const aanmeldingsgegevens = (await prisma.reizen.findUnique({
        where: {
          ID: reisID
        },

        include: {
          _count: {
            select: {
              aanmeldingen: true
            }
          }
        }
      })) as any;

      if (aanmelding.ID !== user.ID) {
        LOGGER.info(`Gebruiker id komt niet overeen`);
        res.json({ message: 'Dit is niet je email' });
      }

      // maximun aantal personen vergelijken
      if (
        aanmeldingsgegevens.maxAantal <= aanmeldingsgegevens._count.aanmeldingen
      ) {
        LOGGER.info(`Reis met ID: ${reisID} is vol`);
        res.json({ message: 'Reis is vol geboekt', ok: false });
      } else {
        LOGGER.info(`Reis met ${reisID} is vol`);
        await prisma.reizen.update({
          where: {
            ID: reisID
          },
          data: {
            aanmeldingen: {
              connect: {
                studentID: aanmelding?.ID
              }
            }
          }
        });
        res.status(200).json({ ok: true });
      }

      return res.status(200).json({ ok: true });
    }
  } else {
    return res.json({
      isLoggedIn: false
    });
  }
}
