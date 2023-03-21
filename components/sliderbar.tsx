import styled from "@emotion/styled";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Contents = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media screen and (min-width: 1200px) {
    width: 936px;
  }
  @media screen and (max-width: 810px) {
    width: 390px;
    gap: 16px;
  }
`;

const ContentsTitle = styled.h2`
  line-height: 1.2;
`;

const Poster = styled.div`
  max-width: 168px;
  height: 252px;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  background-image: url(https://via.placeholder.com/168x252);
  background-size: cover;
  padding: 24px;

  @media screen and (max-width: 810px) {
    max-width: 120px;
    height: 180px;
    background-image: url(https://via.placeholder.com/120x180);
  }
`;

export default function sliderbar() {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 810,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <Contents>
      <ContentsTitle>시청 중인 콘텐츠</ContentsTitle>
      <Slider {...settings}>
        <Poster>1</Poster>
        <Poster>2</Poster>
        <Poster>3</Poster>
        <Poster>4</Poster>
        <Poster>5</Poster>
        <Poster>6</Poster>
        <Poster>7</Poster>
        <Poster>8</Poster>
        <Poster>9</Poster>
        <Poster>10</Poster>
      </Slider>
      <ContentsTitle>찜한 콘텐츠</ContentsTitle>
      <Slider {...settings}>
        <Poster>1</Poster>
        <Poster>2</Poster>
        <Poster>3</Poster>
        <Poster>4</Poster>
        <Poster>5</Poster>
        <Poster>6</Poster>
        <Poster>7</Poster>
        <Poster>8</Poster>
        <Poster>9</Poster>
        <Poster>10</Poster>
      </Slider>
      <ContentsTitle>추천 콘텐츠</ContentsTitle>
      <Slider {...settings}>
        <Poster>1</Poster>
        <Poster>2</Poster>
        <Poster>3</Poster>
        <Poster>4</Poster>
        <Poster>5</Poster>
        <Poster>6</Poster>
        <Poster>7</Poster>
        <Poster>8</Poster>
        <Poster>9</Poster>
        <Poster>10</Poster>
      </Slider>
      <ContentsTitle>인기 콘텐츠</ContentsTitle>
      <Slider {...settings}>
        <Poster>1</Poster>
        <Poster>2</Poster>
        <Poster>3</Poster>
        <Poster>4</Poster>
        <Poster>5</Poster>
        <Poster>6</Poster>
        <Poster>7</Poster>
        <Poster>8</Poster>
        <Poster>9</Poster>
        <Poster>10</Poster>
      </Slider>
    </Contents>
  );
}
