import styled from "@emotion/styled";
import { Subscription } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

const Selector = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #eee;
  border-radius: 16px;
`;

const Providers = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SubsWrapper = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  aspect-ratio: 64/92;
  cursor: pointer;
`;

const SubsImage = styled(Image)`
  border-radius: 10px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  filter: contrast(50%) opacity(50%);
`;

const Input = styled.input`
  display: none;

  &:checked ~ img {
    filter: none;
  }
`;

const Line = styled.div`
  width: 2px;
  height: 20px;
  background-color: #999;
`;

const SuggestionLink = styled(Link)`
  color: #333;
  font-weight: bold;
`;

interface SubsForm {
  subscriptions: string[];
}

interface SubsSelectorProps {
  onChange?: (value: Subscription[]) => void;
}

export default function SubsSelector({ onChange }: SubsSelectorProps) {
  const { data: subscriptions } = useSWR<Subscription[]>("/api/subscriptions");
  const { data: userSubscriptions } = useSWR<number[]>(
    "/api/user/subscriptions"
  );
  const { register, setValue, watch } = useForm<SubsForm>();

  useEffect(() => {
    if (userSubscriptions) {
      setValue("subscriptions", userSubscriptions.map(String));

      onChange?.(
        userSubscriptions.map((id) => subscriptions?.find((s) => s.id === id)!)
      );
    }
  }, [onChange, setValue, subscriptions, userSubscriptions]);

  const handleChange = () => {
    onChange?.(
      watch("subscriptions").map(
        (id) => subscriptions?.find((s) => s.id === Number(id))!
      )
    );
  };

  return (
    <Selector>
      <Providers>
        {subscriptions?.map(
          (subscription) =>
            userSubscriptions?.includes(subscription.id) && (
              <SubsWrapper
                key={subscription.id}
                htmlFor={subscription.id.toString()}
              >
                <Input
                  id={subscription.id.toString()}
                  type="checkbox"
                  {...register("subscriptions", { onChange: handleChange })}
                  value={subscription.id}
                />
                <SubsImage
                  src={`/images/${subscription.key}.png`}
                  width="40"
                  height="40"
                  alt={subscription.name}
                />
              </SubsWrapper>
            )
        )}
        <Line />
        {subscriptions?.map(
          (subscription) =>
            !userSubscriptions?.includes(subscription.id) && (
              <SubsWrapper
                key={subscription.id}
                htmlFor={subscription.id.toString()}
              >
                <Input
                  id={subscription.id.toString()}
                  type="checkbox"
                  {...register("subscriptions", { onChange: handleChange })}
                  value={subscription.id}
                />
                <SubsImage
                  src={`/images/${subscription.key}.png`}
                  width="40"
                  height="40"
                  alt={subscription.name}
                />
              </SubsWrapper>
            )
        )}
      </Providers>

      <SuggestionLink href="/">조합 추천받기</SuggestionLink>
    </Selector>
  );
}
