import { MovieDetail, TVDetail } from '@/lib/client/interface';
import { Caption, Section } from '@/lib/client/style';
import { ContentType } from '@prisma/client';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';

interface DetailsProps {
  contentDetail?: MovieDetail | TVDetail;
}

export default function Details({ contentDetail }: DetailsProps) {
  const directorNames =
    contentDetail?.type === ContentType.MOVIE
      ? contentDetail.credits?.crew
          .filter(crew => crew.job === 'Director')
          .map(crew => crew.name)
      : undefined;
  const writerNames =
    contentDetail?.type === ContentType.MOVIE
      ? contentDetail.credits?.crew
          .filter(crew => crew.job === 'Writer' || crew.job === 'Screenplay')
          .map(crew => crew.name)
      : undefined;
  const { data: translatedDirectors } = useSWR(
    directorNames &&
      `/api/translate/${encodeURIComponent(directorNames.join(','))}`
  );
  const { data: translatedWriters } = useSWR(
    writerNames && `/api/translate/${encodeURIComponent(writerNames.join(','))}`
  );

  const director =
    translatedDirectors?.translatedText || directorNames?.join(', ');
  const writer = translatedWriters?.translatedText || writerNames?.join(', ');

  const creatorNames =
    contentDetail?.type === ContentType.TV
      ? contentDetail.created_by.map(creator => creator.name)
      : undefined;
  const { data: translatedCreators } = useSWR(
    creatorNames &&
      `/api/translate/${encodeURIComponent(creatorNames.join(','))}`
  );

  const creator =
    translatedCreators?.translatedText || creatorNames?.join(', ');

  return (
    <Section>
      <h5>상세 정보</h5>
      <Caption>
        {contentDetail ? (
          contentDetail.type === ContentType.MOVIE ? (
            <>
              감독: {director || '정보 없음'}
              <br />
              각본: {writer || '정보 없음'}
            </>
          ) : (
            <>크리에이터: {creator || '정보 없음'}</>
          )
        ) : (
          <Skeleton width={160} />
        )}
      </Caption>
    </Section>
  );
}
