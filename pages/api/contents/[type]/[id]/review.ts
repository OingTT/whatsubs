import { prisma } from '@/lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]';
import { ContentType, Watch } from '@prisma/client';

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(400).end();

  const {
    query: { type, id },
    body: { watch, rating: userRating },
  } = req;

  if (!Object.keys(ContentType).some(key => key.toLowerCase() === type))
    return res.status(400).end();

  const userId = session.user?.id!;
  const rating =
    (watch !== Watch.WATCHING && watch !== Watch.WATCHED) ||
    (userRating > 0 && userRating <= 5)
      ? userRating
      : null;
  const contentType = String(type).toUpperCase() as ContentType;
  const contentId = Number(id);

  if (!watch) {
    // HACK: Delete is not working as expected
    try {
      await prisma.review.delete({
        where: {
          userId_contentType_contentId: {
            userId,
            contentType,
            contentId,
          },
        },
      });
    } catch (error) {}
  } else {
    // HACK: Upsert is not working as expected
    try {
      await prisma.review.upsert({
        where: {
          userId_contentType_contentId: {
            userId,
            contentType,
            contentId,
          },
        },
        update: {
          watch,
          rating,
        },
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
          contentType,
          contentId,
          watch,
        },
      });
    } catch (error) {
      await prisma.review.update({
        where: {
          userId_contentType_contentId: {
            userId,
            contentType,
            contentId,
          },
        },
        data: {
          watch,
          rating,
        },
      });
    }
  }

  return res.status(200).end();
}
