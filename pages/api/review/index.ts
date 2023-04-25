import { prisma } from "@/lib/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(400).end();

  const reviews = await prisma.review.findMany({
    where: {
      user: {
        email: session.user?.email!,
      },
    },
    select: {
      movieId: true,
      watch: true,
      rating: true,
    },
  });

  res.status(200).json(reviews);
}
