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

  if (req.method === 'GET') {
    const subscriptions = await prisma.subscription.findMany({
      where: { users: { some: { id: session.user.id } } },
      select: {
        id: true,
      },
    });

    return res
      .status(200)
      .json(subscriptions.map(subscription => subscription.id));
  }

  if (req.method === 'POST') {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptions: {
          set: req.body.subscriptions.map((id: string) => ({
            id: Number(id),
          })),
        },
      },
    });

    return res.status(200).json(req.body.subscriptions);
  }
}
