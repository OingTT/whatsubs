import styled from "@emotion/styled";
import { BookmarkSimple, Check, Eye } from "@phosphor-icons/react";
import Stars from "./stars";
import React, { useEffect, useState } from "react";
import { Watch } from "@prisma/client";
import useSWR from "swr";
import useMutation from "@/lib/client/useMutation";

const Selector = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.div<{ selected?: boolean; large?: boolean }>`
  width: ${(props) => (props.large ? "48px" : "40px")};
  height: ${(props) => (props.large ? "48px" : "40px")};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.selected ? "black" : "#eee")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border-radius: 100%;
  cursor: pointer;
`;

const StarsWrapper = styled.div<{ absolute?: boolean }>`
  position: ${(props) => (props.absolute ? "absolute" : "static")};
  bottom: ${(props) => (props.absolute ? "-40px" : "0")};
`;

interface ReviewResponse {
  watch: Watch;
  rating: number;
}

interface WatchSelectorProps {
  id: number;
  large?: boolean;
  absoluteStars?: boolean;
}

export default function WatchSelector({
  id,
  large,
  absoluteStars,
}: WatchSelectorProps) {
  const [review] = useMutation(`/api/review/${id}`);
  const { data } = useSWR<ReviewResponse>(`/api/review/${id}`);
  const [watch, setWatch] = useState<Watch>();

  const handleWatch = (value: Watch) => {
    const newWatch = watch === value ? undefined : value;

    setWatch(newWatch);
    review({ watch: newWatch });
  };

  const handleStars = (stars: number) => {
    review({ watch, stars });
  };

  useEffect(() => {
    setWatch(data?.watch);
  }, [data?.watch]);

  return (
    <Selector>
      <Buttons>
        <Button
          selected={watch === "WANT_TO_WATCH"}
          onClick={() => handleWatch("WANT_TO_WATCH")}
          large={large}
        >
          <BookmarkSimple size={large ? 20 : 16} />
        </Button>
        <Button
          selected={watch === "WATCHING"}
          onClick={() => handleWatch("WATCHING")}
          large={large}
        >
          <Eye size={large ? 20 : 16} />
        </Button>
        <Button
          selected={watch === "WATCHED"}
          onClick={() => handleWatch("WATCHED")}
          large={large}
        >
          <Check size={large ? 20 : 16} />
        </Button>
      </Buttons>

      <StarsWrapper absolute={absoluteStars}>
        {watch === "WATCHED" && (
          <Stars rating={data?.rating} onChange={handleStars} />
        )}
      </StarsWrapper>
    </Selector>
  );
}
