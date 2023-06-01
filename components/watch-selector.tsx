import styled from "@emotion/styled";
import { BookmarkSimple, Check, Eye } from "@phosphor-icons/react";
import Stars from "./stars";
import React, { useEffect, useState } from "react";
import { ContentType, Review, Watch } from "@prisma/client";
import useSWR from "swr";
import useMutation from "@/lib/client/useMutation";

const Selector = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
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
  background-color: ${(props) => (props.selected ? "black" : "#eee")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border-radius: 100%;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;

  @media (min-width: 810px) {
    width: ${(props) => (props.small ? "40px" : "48px")};
    height: ${(props) => (props.small ? "40px" : "48px")};
  }
`;

const Icon = styled.div<{ small?: boolean }>`
  @media (min-width: 810px) {
    width: ${(props) => (props.small ? "16px" : "20px")};
    height: ${(props) => (props.small ? "16px" : "20px")};
  }
`;

const StarsWrapper = styled.div<{ absolute?: boolean }>`
  position: ${(props) => (props.absolute ? "absolute" : "static")};
  bottom: ${(props) => (props.absolute ? "-40px" : "0")};
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
  const [updateReview] = useMutation(`/api/review/${type.toLowerCase()}/${id}`);
  const { data: reviewCounts, mutate } = useSWR<ReviewCountsResponse>(
    count && `/api/review/${type.toLowerCase()}/${id}`
  );
  const { data } = useSWR<Review[]>("/api/review");
  const [watch, setWatch] = useState<Watch>();
  const [review, setReview] = useState<Review>();

  const handleWatch = (value: Watch) => {
    const newWatch = watch === value ? undefined : value;

    setWatch(newWatch);
    updateReview({ watch: newWatch });
    if (reviewCounts) {
      mutate(
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
    updateReview({ watch, rating: stars });
  };

  useEffect(() => {
    setReview(data?.find((review) => review.contentId === id));
  }, [data, id]);

  useEffect(() => {
    setWatch(review?.watch);
  }, [review?.watch]);

  return (
    <Selector>
      <Buttons>
        <Button
          selected={watch === "WANT_TO_WATCH"}
          onClick={() => handleWatch("WANT_TO_WATCH")}
          small={small}
        >
          <Icon as={BookmarkSimple} small={small} />
          {count && (reviewCounts ? reviewCounts.WANT_TO_WATCH : "-")}
        </Button>
        <Button
          selected={watch === "WATCHING"}
          onClick={() => handleWatch("WATCHING")}
          small={small}
        >
          <Icon as={Eye} small={small} />
          {count && (reviewCounts ? reviewCounts.WATCHING : "-")}
        </Button>
        <Button
          selected={watch === "WATCHED"}
          onClick={() => handleWatch("WATCHED")}
          small={small}
        >
          <Icon as={Check} small={small} />
          {count && (reviewCounts ? reviewCounts.WATCHED : "-")}
        </Button>
      </Buttons>

      <StarsWrapper absolute={absoluteStars}>
        {watch === "WATCHED" && (
          <Stars rating={review?.rating} onChange={handleStars} />
        )}
      </StarsWrapper>
    </Selector>
  );
}
