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

  if (req.method === "GET") {
    const contentTypes = await prisma.contentTypesOnUsers.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        contentTypeId: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return res
      .status(200)
      .json(contentTypes.map((contentType) => contentType.contentTypeId));
  }

  if (req.method === "POST") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        contentTypes: {
          deleteMany: {},
          create: req.body.contentTypes.map((id: number, index: number) => ({
            contentTypeId: id,
            order: index,
          })),
        },
      },
    });

    return res.status(200).json(req.body.contentTypes);
  }
}
