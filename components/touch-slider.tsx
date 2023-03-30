import styled from "@emotion/styled";

const Slider = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  overflow: visible;
  align-content: flex-start;
  flex-wrap: nowrap;
`;

const Title = styled.div`
  font-size: 20px;
  padding-left: 24px;
  font-weight: bold;
  color: #333;

  @media (max-width: 810px) {
    padding-left: 16px;
    font-size: 16px;
  }
`;

const Contents = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 24px 24px 24px;
  overflow: scroll;
  gap: 24px;

  @media (max-width: 810px) {
    padding: 8px 16px 16px 16px;
    gap: 16px;
  }
`;

const Poster = styled.div`
  min-width: 168px;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.25);
  background-color: #333333;
  aspect-ratio: 2/3;
  border-radius: 16px;

  @media (max-width: 810px) {
    min-width: 120px;
  }
`;

export default function TouchSlider() {
  return (
    <Slider>
      <Title>Title</Title>
      <Contents>
        {Array.from({ length: 20 }, (_, index) => (
          <Poster key={index} />
        ))}
      </Contents>
    </Slider>
  );
}
