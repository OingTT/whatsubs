import { prisma } from '@/lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]';
import { Watch } from '@prisma/client';

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(400).end();

  const {
    query: { id },
  } = req;

  const userId = id === 'me' ? session.user?.id! : String(id);

  const values = await prisma.review.groupBy({
    by: ['watch'],
    where: {
      userId,
    },
    _count: {
      watch: true,
    },
  });

  const rating = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      userId,
    },
  });

  res.status(200).json({
    [Watch.WANT_TO_WATCH]:
      values.find(count => count.watch === Watch.WANT_TO_WATCH)?._count.watch ||
      0,
    [Watch.WATCHING]:
      values.find(count => count.watch === Watch.WATCHING)?._count.watch || 0,
    [Watch.WATCHED]:
      values.find(count => count.watch === Watch.WATCHED)?._count.watch || 0,
    rating: rating._avg.rating,
  });
}
