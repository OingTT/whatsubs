import Layout from "@/components/layout/layout";
import styled from "@emotion/styled";
import { ArrowDown } from "@phosphor-icons/react";
import Button from "@/components/button/button";
import { Subscription } from "@prisma/client";
import useSWR from "swr";
import { Spacer } from "@/lib/client/style";
import useUser from "@/lib/client/useUser";
import Image from "next/image";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  gap: 24px;

  @media (min-width: 1200px) {
    width: 984px;
  }

  @media (max-width: 809px) {
    padding: 16px;
    gap: 16px;
  }
`;

const Costs = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
`;

const ProviderSelector = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 16px;
  gap: 24px;

  @media (max-width: 809px) {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  }
`;

const Columns = styled.div`
  width: 100%;
  display: flex;
`;

const Providers = styled.div`
  display: flex;
  gap: 12px;
`;

const Comparison = styled.div<{ comparison: number | undefined }>`
  color: ${({ comparison }) =>
    comparison && comparison > 0 ? "#ee4444" : "#1199ee"};
`;

interface fontWeight {
  weight?: number;
}

const Right = styled.div<fontWeight>`
  width: 80px;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${({ weight }) => weight && `font-weight: ${weight};`}
`;

const OttColumn = styled.div`
  width: 100%;
  display: flex;
`;

const Ott = styled(Image)`
  width: 40px;
  height: 40px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;

const CostColumn = ({
  title,
  cost,
  comparison,
}: {
  title: string;
  cost: number;
  comparison?: number;
}) => {
  const comparisonSymbol =
    comparison !== undefined && comparison > 0 ? "+" : "-";

  if (comparison == 0) comparison = undefined;

  return (
    <Columns>
      {title}
      <Spacer />
      {comparison !== undefined && (
        <Comparison comparison={comparison}>
          {comparisonSymbol}
          {Math.abs(comparison).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </Comparison>
      )}
      <Right>
        {cost.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
        원
      </Right>
    </Columns>
  );
};

const Recommender = ({
  title,
  ottData,
  myPrice,
  mySharing,
}: {
  title: string;
  ottData: number[];
  myPrice?: number;
  mySharing?: number;
}) => {
  const { data: subscriptions } = useSWR<Subscription[]>("/api/subscriptions");

  let ottPrice = 0;
  let ottSharing = 0;
  let ottPriceComparison = 0;
  let ottSharingComparison = 0;

  if (ottData && subscriptions) {
    ottPrice = subscriptions.reduce((sum, subscription) => {
      if (ottData.includes(subscription.id)) {
        return sum + subscription.price;
      }
      return sum;
    }, 0);
    ottSharing = subscriptions.reduce((sum, subscription) => {
      if (ottData.includes(subscription.id)) {
        return sum + subscription.price / subscription.sharing;
      }
      return sum;
    }, 0);
  }

  if (myPrice !== undefined && mySharing !== undefined) {
    ottPriceComparison = ottPrice - myPrice;
    ottSharingComparison = ottSharing - mySharing;
  }

  return (
    <ProviderSelector>
      <OttColumn>
        <Providers>
          {subscriptions?.map(
            (subscription) =>
              ottData?.includes(subscription.id) && (
                <Ott
                  key={subscription.id}
                  src={`/images/${subscription.key}.png`}
                  width={40}
                  height={40}
                  alt={subscription.name}
                />
              )
          )}
        </Providers>
        <Spacer />
        <Right weight={600}>{title}</Right>
      </OttColumn>
      <Costs>
        <CostColumn
          title="정가"
          cost={ottPrice}
          comparison={ottPriceComparison}
        />
        <CostColumn
          title="계정 공유 시 예상 가격"
          cost={ottSharing}
          comparison={ottSharingComparison}
        />
      </Costs>
      <Buttons>
        <Button onClick={() => window.open("https://pickle.plus/", "_blank")}>
          계정 공유 알아보기
        </Button>
      </Buttons>
    </ProviderSelector>
  );
};

export default function Suggestion() {
  const user = useUser();
  const { data: subscriptions } = useSWR<Subscription[]>("/api/subscriptions");
  const { data: userSubscriptions } = useSWR<number[]>(
    "/api/user/subscriptions"
  );
  const { data: recommenderData } = useSWR<number[][]>(
    user &&
      `${process.env.NEXT_PUBLIC_API_URL}/recommendation/ottcomb/${user.id}`
  );

  let myPrice = 0;
  let mySharing = 0;

  if (userSubscriptions && subscriptions) {
    myPrice = subscriptions.reduce((sum, subscription) => {
      if (userSubscriptions.includes(subscription.id)) {
        return sum + subscription.price;
      }
      return sum;
    }, 0);
    mySharing = subscriptions.reduce((sum, subscription) => {
      if (userSubscriptions.includes(subscription.id)) {
        return sum + subscription.price / subscription.sharing;
      }
      return sum;
    }, 0);
  }

  return (
    <Layout>
      <Wrapper>
        <Recommender title="현재 조합" ottData={userSubscriptions || []} />

        <ArrowDown color="#333" size={24} />
        {recommenderData?.map((ottData, index) => (
          <Recommender
            key={index}
            title={"추천 조합" + (index + 1)}
            ottData={ottData}
            myPrice={myPrice}
            mySharing={mySharing}
          />
        ))}
      </Wrapper>
    </Layout>
  );
}
