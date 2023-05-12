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
    const categories = await prisma.categoriesOnUsers.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        categoryId: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return res
      .status(200)
      .json(categories.map((category) => category.categoryId));
  }

  if (req.method === "POST") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        categories: {
          deleteMany: {},
          create: req.body.categories.map((id: number, index: number) => ({
            categoryId: id,
            order: index,
          })),
        },
      },
    });

    return res.status(200).json(req.body.categories);
  }
}
