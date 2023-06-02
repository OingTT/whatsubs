import { prisma } from "@/lib/server/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { ContentType, Watch } from "@prisma/client";

export default async function session(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(400).end();

  const {
    query: { type, id },
    body: { watch, rating },
  } = req;

  if (type !== "movie" && type !== "tv") return res.status(400).end();

  const contentType = type === "movie" ? ContentType.MOVIE : ContentType.TV;

  if (req.method === "GET") {
    const WANT_TO_WATCH = await prisma.review.count({
      where: {
        contentId: Number(id),
        contentType,
        watch: Watch.WANT_TO_WATCH,
      },
    });

    const WATCHING = await prisma.review.count({
      where: {
        contentId: Number(id),
        contentType,
        watch: Watch.WATCHING,
      },
    });

    const WATCHED = await prisma.review.count({
      where: {
        contentId: Number(id),
        contentType,
        watch: Watch.WATCHED,
      },
    });

    const rating = await prisma.review.aggregate({
      where: {
        contentId: Number(id),
        contentType,
        watch: Watch.WATCHED,
        rating: {
          not: 0,
        },
      },
      _avg: {
        rating: true,
      },
    });

    return res.status(200).json({
      WANT_TO_WATCH,
      WATCHING,
      WATCHED,
      rating: rating._avg.rating || 0,
    });
  }

  if (req.method === "POST") {
    if (!watch) {
      // HACK: Delete is not working as expected
      try {
        await prisma.review.delete({
          where: {
            userId_contentType_contentId: {
              userId: session.user?.id!,
              contentType,
              contentId: Number(id),
            },
          },
        });
      } catch (error) {}
    } else {
      // HACK: Upsert is not working as expected
      try {
        await prisma.review.upsert({
          where: {
            userId_contentType_contentId: {
              userId: session.user?.id!,
              contentType,
              contentId: Number(id),
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
            contentType,
            contentId: Number(id),
            watch,
          },
        });
      } catch (error) {
        await prisma.review.update({
          where: {
            userId_contentType_contentId: {
              userId: session.user?.id!,
              contentType,
              contentId: Number(id),
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
}
