import styled from '@emotion/styled';
import Skeleton from 'react-loading-skeleton';

const Wrapper = styled.div`
  min-width: 168px;
  aspect-ratio: 2/3;
  border-radius: 16px;
  position: relative;
  overflow: hidden;

  @media (max-width: 809px) {
    min-width: 120px;
  }
`;

export default function PosterSkeleton() {
  return (
    <Wrapper>
      <Skeleton width="100%" height="100%" />
    </Wrapper>
  );
}
