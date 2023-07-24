import { prisma } from '@/lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(400).end();

  const { avatar, name } = req.body;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      avatar,
      name,
    },
  });

  return res.status(200).json(req.body);
}
