import { prisma } from "@/lib/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) return res.status(400).end();

  const {
    query: { id },
    body: { watch, stars: rating },
  } = req;

  const review = await prisma.review.findFirst({
    where: {
      user: {
        email: session.user?.email!,
      },
      movieId: Number(id),
    },
  });

  if (req.method === "GET") {
    return res
      .status(200)
      .json(review ? { watch: review.watch, rating: review.rating } : null);
  }

  if (review) {
    if (watch) {
      await prisma.review.update({
        where: {
          id: review.id,
        },
        data: {
          watch,
          rating,
        },
      });
    } else {
      await prisma.review.delete({
        where: {
          id: review.id,
        },
      });
    }
  } else {
    await prisma.review.create({
      data: {
        user: {
          connect: {
            email: session.user?.email!,
          },
        },
        movieId: Number(id),
        watch,
      },
    });
  }

  return res.status(200).end();
}
