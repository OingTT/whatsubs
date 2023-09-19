import { getTmdbImagePath } from '@/lib/client/api';
import { TVDetail } from '@/lib/client/interface';
import { Grid, Section } from '@/lib/client/style';
import { useState } from 'react';
import Button from '../button/button';
import MiniCard from '../mini-card';
import MiniCardSkeleton from '../mini-card-skeleton';

interface SeasonsProps {
  contentDetail?: TVDetail;
}

export default function Seasons({ contentDetail }: SeasonsProps) {
  const [index, setIndex] = useState(0);

  const handleClick = () => {
    setIndex(index => ++index);
  };

  return (
    <Section>
      <h5>시즌</h5>
      <Grid>
        {contentDetail
          ? [...contentDetail.seasons]
              .reverse()
              .slice(0, 10 * (index + 1) - 1)
              .map(season => (
                <MiniCard
                  key={season.id}
                  title={season.name}
                  subtitle={season.air_date}
                  src={getTmdbImagePath(season.poster_path)}
                  // href={`/contents/tv/${contentDetail.id}/season/${season.season_number}`}
                />
              ))
          : [...Array(9)].map((_, i) => <MiniCardSkeleton key={i} />)}
        {contentDetail && contentDetail.seasons.length >= 10 * (index + 1) && (
          <Button onClick={handleClick}>더보기</Button>
        )}
      </Grid>
    </Section>
  );
}
