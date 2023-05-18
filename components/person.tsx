import styled from "@emotion/styled";
import Image from "next/image";

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  aspect-ratio: 2/1;
  cursor: pointer;
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

const Texts = styled.div`
  flex: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 8px 0px 8px 12px;
  gap: 4px;
`;

const Name = styled.div`
  white-space: pre-wrap;
  font-weight: 600;
  color: #333333;
  font-size: 14px;
`;

const Info = styled.div`
  white-space: pre-wrap;
  font-weight: 500;
  color: #999999;
  font-size: 12px;
`;

interface PersonProps {
  id: number;
  name: string;
  profilePath: string;
  info: string;
}

export default function Person({ id, name, profilePath, info }: PersonProps) {
  return (
    <Wrapper>
      <Left>
        <Image
          src={
            profilePath
              ? `https://image.tmdb.org/t/p/w92${profilePath}`
              : "/images/profile.png"
          }
          fill
          alt="Cast"
          unoptimized
        />
      </Left>
      <Right>
        <Texts>
          <Name>{name}</Name>
          <Info>{info}</Info>
        </Texts>
      </Right>
    </Wrapper>
  );
}
