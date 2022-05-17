import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

const LOGGER = logger(import.meta.url);

export default withIronSessionApiRoute(handler, sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.session.user) {
    if (req.method === 'GET') {
        LOGGER.info(`reis met id: ${id} opgehaald uit database`);

      const plaats = await prisma.reizen.findUnique({
        where: {
          ID: id as string,
        },
        include: {
          createdBy: {
            select: {
              naam: true,
            }
          },
        
          _count: {
            select: {
              aanmeldingen: true,
            }
          },
          aanmeldingen: {
            select: {
              naam: true,
            }
          }
        }
      })

      res.status(200).json({plaats, ok: true})
    }

     if (req.method === 'DELETE') {
         LOGGER.info("Reis successvol verwijderd");

       await prisma.reizen.delete({
           where: {
               ID: id as string
           }
       });

       return res.status(200).json({ok: true})

     }
  } else {
    return res.status(500).json({
      isLoggedIn: false
    });
  }
}
