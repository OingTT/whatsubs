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
    body: { watch, comment: text },
  } = req;

  if (!Object.keys(ContentType).some(key => key.toLowerCase() === type))
    return res.status(400).end();

  const userId = session.user?.id!;
  const contentType = String(type).toUpperCase() as ContentType;
  const contentId = Number(id);

  if (!watch) {
    return res.status(500).end();
  }

  await prisma.comment.upsert({
    where: {
      userId_contentType_contentId_watch: {
        userId,
        contentType,
        contentId,
        watch,
      },
    },
    update: {
      text,
    },
    create: {
      userId,
      contentType,
      contentId,
      watch,
      text,
    },
  });

  return res.status(200).end();
}
