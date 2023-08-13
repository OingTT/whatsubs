import { prisma } from '@/lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  const {
    query: { id },
  } = req;

  if (!session && id === 'me') {
    return res.status(200).json([]);
  }

  const userId = id === 'me' ? session?.user?.id! : String(id);

  const reviews = await prisma.review.findMany({
    where: {
      userId: userId,
    },
    select: {
      contentType: true,
      contentId: true,
      watch: true,
      rating: true,
    },
  });

  res.status(200).json(reviews);
}
