import { prisma } from '@/lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(400).end();

  const subscriptions = await prisma.subscription.findMany({
    select: {
      id: true,
      key: true,
      name: true,
      providerId: true,
      networkId: true,
      price: true,
      sharing: true,
    },
  });

  return res.json(subscriptions);
}
