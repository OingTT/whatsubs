import { MovieDetail, TVDetail } from '@/lib/client/interface';
import { Grid, Section } from '@/lib/client/style';
import { ContentType } from '@prisma/client';
import MiniCard from '../mini-card';
import MiniCardSkeleton from '../mini-card-skeleton';

interface CastsProps {
  contentDetail?: MovieDetail | TVDetail;
}

export default function Casts({ contentDetail }: CastsProps) {
  return (
    <Section>
      <h5>출연진</h5>
      <Grid>
        {contentDetail
          ? contentDetail.type === ContentType.MOVIE
            ? contentDetail.credits?.cast
                .slice(0, 9)
                .map(person => (
                  <MiniCard
                    key={person.id}
                    title={person.name}
                    subtitle={person.character}
                    src={`https://image.tmdb.org/t/p/w154${person.profile_path}`}
                    href={`/person/${person.id}`}
                  />
                ))
            : contentDetail.aggregate_credits?.cast
                .slice(0, 9)
                .map(person => (
                  <MiniCard
                    key={person.id}
                    title={person.name}
                    subtitle={person.roles[0].character}
                    src={`https://image.tmdb.org/t/p/w154${person.profile_path}`}
                    href={`/person/${person.id}`}
                  />
                ))
          : [...Array(9)].map((_, i) => <MiniCardSkeleton key={i} />)}
        {/* <Button>더보기</Button> */}
      </Grid>
    </Section>
  );
}
