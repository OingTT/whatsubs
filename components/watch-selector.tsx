import styled from '@emotion/styled';
import Stars from './stars';
import React, { useEffect, useState } from 'react';
import { ContentType, Review, Watch } from '@prisma/client';
import useSWR from 'swr';
import useMutation from '@/lib/client/useMutation';
import { IconBookmark, IconCheck, IconEye } from '@tabler/icons-react';
import useUser from '@/lib/client/useUser';

const Selector = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  user-select: none;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.div<{ selected?: boolean; small?: boolean }>`
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(
    ${props => (props.selected ? '--primary' : '--secondary')}
  );
  color: var(${props => (props.selected ? '--text-primary' : '--text')});
  border-radius: 100%;
  cursor: pointer;

  @media (min-width: 810px) {
    width: ${props => (props.small ? '40px' : '48px')};
    height: ${props => (props.small ? '40px' : '48px')};
  }
`;

const Count = styled.div`
  font-size: 10px;
  font-weight: 600;
`;

const StarsWrapper = styled.div<{ absolute?: boolean }>`
  position: ${props => (props.absolute ? 'absolute' : 'static')};
  bottom: -36px;

  @media (max-width: 809px) {
    bottom: -32px;
  }
`;

interface ReviewCountsResponse {
  [Watch.WANT_TO_WATCH]: number;
  [Watch.WATCHING]: number;
  [Watch.WATCHED]: number;
}

interface WatchSelectorProps {
  type: ContentType;
  id: number;
  small?: boolean;
  absoluteStars?: boolean;
  count?: boolean;
}

export default function WatchSelector({
  type,
  id,
  small,
  absoluteStars,
  count,
}: WatchSelectorProps) {
  const user = useUser();
  const [updateReview] = useMutation(
    `/api/contents/${type.toLowerCase()}/${id}/review`
  );
  const { data: reviewCounts, mutate: mutateReviewCounts } =
    useSWR<ReviewCountsResponse>(
      count && `/api/contents/${type.toLowerCase()}/${id}/reviews/values`
    );
  const { data: reviews, mutate: mutateReviews } = useSWR<Review[]>(
    '/api/users/me/reviews'
  );
  const [watch, setWatch] = useState<Watch>();
  const [review, setReview] = useState<Review>();

  const handleWatch = (value: Watch) => {
    const newWatch = watch === value ? undefined : value;
    const rating =
      (newWatch !== 'WATCHING' && newWatch !== 'WATCHED') ||
      review?.rating === 0
        ? null
        : review?.rating;

    setWatch(newWatch);
    updateReview({ watch: newWatch, rating });
    if (reviews) {
      mutateReviews(
        reviews
          .filter(
            review => review.contentId !== id || review.contentType !== type
          )
          .concat(
            newWatch
              ? [
                  {
                    userId: user?.id,
                    contentId: id,
                    contentType: type,
                    watch: newWatch,
                    rating,
                  } as Review,
                ]
              : []
          ),
        false
      );
    }
    if (reviewCounts) {
      mutateReviewCounts(
        {
          ...reviewCounts,
          ...(watch && { [watch]: reviewCounts[watch] - 1 }),
          ...(newWatch && { [newWatch]: reviewCounts[newWatch] + 1 }),
        },
        false
      );
    }
  };

  const handleStars = (stars: number) => {
    const rating = stars === 0 ? null : stars;
    updateReview({ watch, rating });
    if (reviews) {
      mutateReviews(
        reviews.reduce(
          (acc, cur) =>
            cur.contentId === id && cur.contentType === type
              ? [...acc, { ...cur, rating }]
              : [...acc, cur],
          [] as Review[]
        ),
        false
      );
    }
  };

  useEffect(() => {
    setReview(
      reviews?.find(
        review => review.contentType === type && review.contentId === id
      )
    );
  }, [id, reviews, type]);

  useEffect(() => {
    setWatch(review?.watch);
  }, [review?.watch]);

  return (
    <Selector>
      <Buttons>
        <Button
          selected={watch === 'WANT_TO_WATCH'}
          onClick={() => handleWatch('WANT_TO_WATCH')}
          small={small}
        >
          <IconBookmark size={20} stroke={1.5} />
          {count && (
            <Count>{reviewCounts ? reviewCounts.WANT_TO_WATCH : '-'}</Count>
          )}
        </Button>
        <Button
          selected={watch === 'WATCHING'}
          onClick={() => handleWatch('WATCHING')}
          small={small}
        >
          <IconEye size={20} stroke={1.5} />
          {count && <Count>{reviewCounts ? reviewCounts.WATCHING : '-'}</Count>}
        </Button>
        <Button
          selected={watch === 'WATCHED'}
          onClick={() => handleWatch('WATCHED')}
          small={small}
        >
          <IconCheck size={20} stroke={1.5} />
          {count && <Count>{reviewCounts ? reviewCounts.WATCHED : '-'}</Count>}
        </Button>
      </Buttons>

      <StarsWrapper absolute={absoluteStars}>
        {(watch === 'WATCHING' || watch === 'WATCHED') && (
          <Stars rating={review?.rating ?? 0} onChange={handleStars} />
        )}
      </StarsWrapper>
    </Selector>
  );
}
