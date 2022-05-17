import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

const LOGGER = logger(import.meta.url);

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let aantal = 0;
  const { email, reisID } = req.body;

  if (req.session.user) {
    if (req.method === 'PUT') {
      const aanmelding = await prisma.accounts.findUnique({
        where: { email },
        select: {
            ID:true,
        }
      });

      await prisma.reizen.update({
        where: {
          ID: reisID as string
        },
        data: {
          aanmeldingen: {
            connect: {
                studentID: aanmelding?.ID
            }
          }
        }
      });

    


      return res.status(200).json({ ok: true });
    }
  } else {
    return res.json({
      isLoggedIn: false
    });
  }
}
