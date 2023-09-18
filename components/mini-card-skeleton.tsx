import styled from '@emotion/styled';
import Skeleton from 'react-loading-skeleton';

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  aspect-ratio: 2/1;
`;

const Left = styled.div`
  flex: 1;
  height: 100%;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  line-height: 0;
`;

const Right = styled.div`
  flex: 2;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Titles = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 8px 0px 8px 12px;
  gap: 4px;
`;

const Title = styled.div`
  width: 100%;
  font-weight: 600;
  font-size: 0.875rem; // 14px
`;

const Subtitle = styled.div`
  width: 100%;
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.75rem; // 12px
  text-overflow: ellipsis;
`;

export default function MiniCardSkeleton() {
  return (
    <Wrapper>
      <Left>
        <Skeleton height="100%" width="100%" />
      </Left>
      <Right>
        <Titles>
          <Title>
            <Skeleton />
          </Title>
          <Subtitle>
            <Skeleton count={3} />
          </Subtitle>
        </Titles>
      </Right>
    </Wrapper>
  );
}
