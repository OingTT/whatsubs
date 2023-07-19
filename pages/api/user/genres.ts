import { prisma } from '@/lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(400).end();

  if (req.method === 'GET') {
    const genres = await prisma.genre.findMany({
      where: { users: { some: { id: session.user.id } } },
      select: {
        id: true,
      },
    });

    return res.status(200).json(genres.map(genre => genre.id.toString()));
  }

  if (req.method === 'POST') {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        genres: {
          set: req.body.genres.map((id: string) => ({
            id: Number(id),
          })),
        },
      },
    });

    return res.status(200).json(req.body.genres);
  }
}
