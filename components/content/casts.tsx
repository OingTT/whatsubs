import { getTmdbImagePath } from '@/lib/client/api';
import { MovieDetail, TVDetail } from '@/lib/client/interface';
import { Grid, Section } from '@/lib/client/style';
import { ContentType } from '@prisma/client';
import { useEffect, useState } from 'react';
import Button from '../button/button';
import MiniCard from '../mini-card';
import MiniCardSkeleton from '../mini-card-skeleton';

interface CastsProps {
  contentDetail?: MovieDetail | TVDetail;
}

export default function Casts({ contentDetail }: CastsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [contentDetail]);

  const handleClick = () => {
    setIndex(index => ++index);
  };

  const casts =
    contentDetail && contentDetail.type === ContentType.MOVIE
      ? contentDetail.credits.cast.map(person => ({
          id: person.id,
          name: person.name,
          character: person.character,
          profile_path: person.profile_path,
        }))
      : contentDetail?.aggregate_credits.cast.map(person => ({
          id: person.id,
          name: person.name,
          character: person.roles[0].character,
          profile_path: person.profile_path,
        }));

  return (
    <Section>
      <h5>출연진</h5>
      <Grid>
        {casts
          ? casts
              .slice(0, 10 * (index + 1) - 1)
              .map(person => (
                <MiniCard
                  key={person.id}
                  title={person.name}
                  subtitle={person.character}
                  src={getTmdbImagePath(person.profile_path, 'w154')}
                  href={`/person/${person.id}`}
                />
              ))
          : [...Array(9)].map((_, i) => <MiniCardSkeleton key={i} />)}
        {casts && casts.length >= 10 * (index + 1) && (
          <Button onClick={handleClick}>더보기</Button>
        )}
      </Grid>
    </Section>
  );
}
