import styled from '@emotion/styled';
import Button from '../button/button';

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
`;

interface GenresProps {
  genres?: Array<{ id: number; name: string }>;
}

export default function Genres({ genres }: GenresProps) {
  return (
    <Wrapper>
      {genres?.map(genre => (
        <Button small key={genre.id}>
          {genre.name}
        </Button>
      )) || [...Array(3)].map((_, i) => <Button key={i} small loading />)}
    </Wrapper>
  );
}
