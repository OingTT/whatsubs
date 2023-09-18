import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';

const Wrapper = styled(Link)`
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
  font-weight: 600;
  font-size: 0.875rem; // 14px
`;

const Subtitle = styled.div`
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.75rem; // 12px
  text-overflow: ellipsis;
`;

interface MiniCardProps {
  src: string;
  title: string;
  subtitle: string;
  href: string;
}

export default function MiniCard({
  title,
  src,
  subtitle,
  href,
}: MiniCardProps) {
  return (
    <Wrapper href={href}>
      <Left>
        <Image src={src} alt={title} fill unoptimized />
      </Left>
      <Right>
        <Titles>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Titles>
      </Right>
    </Wrapper>
  );
}
