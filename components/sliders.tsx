import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "@emotion/styled";

const Container = styled.div`
  width: 70%;
  margin: auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  .slick-prev:before {
    color: black;
    left: 0;
  }
  .slick-next:before {
    color: black;
  }
`;

const Box = styled.div`
  max-width: 168px;
  height: 252px;
  display: block;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.25);
  overflow: visible;
  position: relative;
  border-radius: 16px;
  background-image: url(https://via.placeholder.com/168x252);
  background-size: cover;
  padding: 20px;
`;

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
    };
    return (
      <Container>
        <h2>시청중인 컨텐츠</h2>
        <Slider {...settings}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Slider>
        <h2>찜한 콘텐츠</h2>
        <Slider {...settings}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Slider>
        <h2>추천 콘텐츠</h2>
        <Slider {...settings}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Slider>
        <h2>인기 콘텐츠</h2>
        <Slider {...settings}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i}>{i}</Box>
          ))}
        </Slider>
      </Container>
    );
  }
}
