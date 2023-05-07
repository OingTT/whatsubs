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

  const {
    query: { id },
    body: { watch, rating },
  } = req;

  if (!watch) {
    // HACK: Delete is not working as expected
    try {
      await prisma.review.delete({
        where: {
          userId_movieId: {
            userId: session.user?.id!,
            movieId: Number(id),
          },
        },
      });
    } catch (error) {}
  } else {
    // HACK: Upsert is not working as expected
    try {
      await prisma.review.upsert({
        where: {
          userId_movieId: {
            userId: session.user?.id!,
            movieId: Number(id),
          },
        },
        update: {
          watch,
          rating,
        },
        create: {
          user: {
            connect: {
              id: session.user?.id!,
            },
          },
          movieId: Number(id),
          watch,
        },
      });
    } catch (error) {
      await prisma.review.update({
        where: {
          userId_movieId: {
            userId: session.user?.id!,
            movieId: Number(id),
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
