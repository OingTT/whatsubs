import { prisma } from '@/lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { ContentType, Watch } from '@prisma/client';

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { type, id },
  } = req;

  if (type !== 'movie' && type !== 'tv') return res.status(400).end();

  const contentId = Number(id);
  const contentType = type === 'movie' ? ContentType.MOVIE : ContentType.TV;

  const counts = await prisma.review.groupBy({
    by: ['watch'],
    where: {
      contentId,
      contentType,
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
      contentId,
      contentType,
    },
  });

  return res.status(200).json({
    [Watch.WANT_TO_WATCH]:
      counts.find(count => count.watch === Watch.WANT_TO_WATCH)?._count.watch ||
      0,
    [Watch.WATCHING]:
      counts.find(count => count.watch === Watch.WATCHING)?._count.watch || 0,
    [Watch.WATCHED]:
      counts.find(count => count.watch === Watch.WATCHED)?._count.watch || 0,
    rating: rating._avg.rating,
  });
}
