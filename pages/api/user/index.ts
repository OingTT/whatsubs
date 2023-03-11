import { prisma } from "@/lib/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) return res.json(null);

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email!,
    },
  });

  res.json(user);
}
