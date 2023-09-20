import { MovieDetail, TVDetail } from '@/lib/client/interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const delay = 10;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Delete all content
  await prisma.content.deleteMany({});

  // Get all content
  const contents = await prisma.review.findMany({
    distinct: ['contentType', 'contentId'],
    select: {
      contentType: true,
      contentId: true,
    },
  });

  // Create content
  contents.forEach(async (content, index) => {
    await sleep(index * delay);
    console.log(index);

    const contentDetail: MovieDetail | TVDetail = await fetch(
      `https://api.themoviedb.org/3/${content.contentType.toLowerCase()}/${
        content.contentId
      }?api_key=${process.env.TMDB_API_KEY}`
    ).then(res => res.json());

    contentDetail.type = content.contentType;

    const isMovie = contentDetail.type === 'MOVIE';
    const genresString = contentDetail.genres
      .map(genre => genre.name)
      .join(',');
    const releaseDate = new Date(
      isMovie ? contentDetail.release_date : contentDetail.first_air_date
    );
    const runtime = isMovie
      ? contentDetail.runtime
      : contentDetail.episode_run_time[0];

    await prisma.content.create({
      data: {
        type: content.contentType,
        id: content.contentId,
        genresString,
        releaseDate,
        runtime,
      },
    });
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
