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

  const values = await prisma.review.groupBy({
    by: ['watch'],
    where: {
      userId: session.user?.id!,
    },
    _count: {
      watch: true,
    },
    _avg: {
      rating: true,
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
    rating: values.find(count => count.watch === Watch.WATCHED)?._avg.rating,
  });
}
