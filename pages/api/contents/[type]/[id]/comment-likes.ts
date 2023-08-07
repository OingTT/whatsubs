import { prisma } from '@/lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]';
import { ContentType } from '@prisma/client';

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(400).end();

  const {
    query: { type, id },
  } = req;

  if (!Object.keys(ContentType).some(key => key.toLowerCase() === type))
    return res.status(400).end();

  const contentType = String(type).toUpperCase() as ContentType;
  const contentId = Number(id);

  const likes = await prisma.commentLike.findMany({
    where: {
      userId: session.user.id,
      comment: {
        contentType,
        contentId,
      },
    },
    select: {
      commentId: true,
    },
  });

  return res.status(200).json(likes);
}
