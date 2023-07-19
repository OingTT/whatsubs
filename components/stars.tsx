import styled from '@emotion/styled';
import Star from './star-button';
import { useState } from 'react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

interface StarsProps {
  rating?: number;
  onChange?: (stars: number) => void;
}

export default function Stars({ rating = 0, onChange }: StarsProps) {
  const [stars, setStars] = useState(rating);

  const handleClick = (index: number) => {
    const newStars = index === stars ? 0 : index;
    setStars(newStars);
    onChange && onChange(newStars);
  };

  return (
    <Wrapper>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          fill={star <= stars}
          onClick={() => handleClick(star)}
        />
      ))}
    </Wrapper>
  );
}
