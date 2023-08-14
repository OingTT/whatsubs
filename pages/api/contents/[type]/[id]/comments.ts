import { prisma } from '@/lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { ContentType } from '@prisma/client';

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { type, id },
  } = req;

  if (!Object.keys(ContentType).some(key => key.toLowerCase() === type))
    return res.status(400).end();

  const contentType = String(type).toUpperCase() as ContentType;
  const contentId = Number(id);

  const comments = await prisma.comment.findMany({
    distinct: ['userId'],
    where: {
      contentType,
      contentId,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          reviews: {
            take: 1,
            where: {
              contentType,
              contentId,
            },
            select: {
              rating: true,
            },
          },
          comments: {
            where: {
              contentType,
              contentId,
            },
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              text: true,
              watch: true,
              _count: {
                select: {
                  likes: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const users = comments.map(comment => comment.user);

  return res.status(200).json(users);
}
