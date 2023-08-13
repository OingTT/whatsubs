import { prisma } from '@/lib/server/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
