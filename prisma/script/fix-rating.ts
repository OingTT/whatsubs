import { PrismaClient, Watch } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.review.updateMany({
    where: {
      OR: [{ rating: 0 }, { watch: Watch.WANT_TO_WATCH }],
    },
    data: {
      rating: null,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
