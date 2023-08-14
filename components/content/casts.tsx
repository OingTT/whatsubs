import { Grid, Section } from '@/lib/client/style';
import Person from '../person';
import { ContentType } from '@prisma/client';
import { MovieDetail, TVDetail } from '@/lib/client/interface';
import Button from '../button/button';

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
                  <Person
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    profilePath={person.profile_path}
                    info={person.character}
                  />
                ))
            : contentDetail.aggregate_credits?.cast
                .slice(0, 9)
                .map(person => (
                  <Person
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    profilePath={person.profile_path}
                    info={person.roles[0].character}
                  />
                ))
          : null}
        {/* <Button>더보기</Button> */}
      </Grid>
    </Section>
  );
}
