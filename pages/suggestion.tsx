import Layout from "@/components/layout";
import styled from "@emotion/styled";
import { ArrowDown } from "@phosphor-icons/react";
import Button from "@/components/button";
import { useRouter } from "next/router";

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

const Buttons = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  margin-top: 32px;
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
`;

const Columns = styled.div`
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: visible;
  position: relative;
  align-content: center;
  flex-wrap: nowrap;
`;

const Providers = styled.div`
  flex-shrink: 0;
  width: min-content;
  height: min-content;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: visible;
  position: relative;
  align-content: center;
  flex-wrap: nowrap;
  gap: 16px;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Comparison = styled.div<{ comparison: number | undefined }>`
  color: ${({ comparison }) =>
    comparison && comparison > 0 ? "#ee4444" : "#1199ee"};
`;

const Difference = styled.div<{ difference: number | undefined }>`
  color: ${({ difference }) =>
    difference && difference > 0 ? "#ee4444" : "#1199ee"};
  margin-left: 5px;
`;

interface fontWeight {
  weight?: number;
}

const Right = styled.div<fontWeight>`
  width: 80px;
  margin-right: 5px;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  ${({ weight }) => weight && `font-weight: ${weight};`}
`;

const OttColumn = styled.div`
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow: visible;
  position: relative;
  margin-bottom: 32px;
`;

const Ott = styled.div<{ imageUrl: string }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  background-image: ${({ imageUrl }) => `url(${imageUrl})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const CostColumn = ({
  title,
  cost,
  fontSize,
  comparison,
}: {
  title: string;
  cost: number;
  fontSize: number;
  comparison?: number;
}) => {
  const comparisonSymbol =
    comparison !== undefined && comparison > 0 ? "+" : "-";

  return (
    <Columns>
      {title}
      <Spacer />
      {comparison !== undefined && (
        <Comparison comparison={comparison}>
          {comparisonSymbol}
          {Math.abs(comparison)}
        </Comparison>
      )}
      <Right>{cost.toLocaleString()}원</Right>
    </Columns>
  );
};

const ContentColumn = ({
  title,
  difference,
}: {
  title: string;
  difference?: number;
}) => {
  const differenceSymbol =
    difference !== undefined && difference > 0 ? "증가" : "감소";

  return (
    <Columns>
      {title}
      <Spacer />
      {difference !== undefined && (
        <Right>
          {Math.abs(difference)}%
          <Difference difference={difference}>{differenceSymbol}</Difference>
        </Right>
      )}
    </Columns>
  );
};

export default function Suggestion() {
  const router = useRouter();

  return (
    <Layout>
      <Wrapper>
        <ProviderSelector>
          <OttColumn>
            <Providers>
              <Ott imageUrl="/images/netflix.png" />
              <Ott imageUrl="/images/tving.png" />
            </Providers>
            <Spacer />
            <Right weight={600}>현재 조합</Right>
          </OttColumn>
          <CostColumn title="정가" cost={34500} fontSize={16} />
          <CostColumn
            title="계정 공유 시 예상 가격"
            cost={12300}
            fontSize={16}
            comparison={-1000}
          />
          <CostColumn
            title="결합 공유 시 예상 가격"
            cost={8900}
            fontSize={16}
            comparison={2500}
          />
          <Buttons>
            <Button onClick={() => router.push("/suggestion")}>
              계정 공유 알아보기
            </Button>
            <Button onClick={() => router.push("/suggestion")}>
              결합 할인 알아보기
            </Button>
          </Buttons>
        </ProviderSelector>

        <ArrowDown color="#333" size={24} />

        <ProviderSelector>
          <OttColumn>
            <Providers>
              <Ott imageUrl="/images/netflix.png" />
              <Ott imageUrl="/images/wavve.png" />
              <Ott imageUrl="/images/appletvplus.png" />
            </Providers>
            <Spacer />
            <Right weight={600}>추천 조합1</Right>
          </OttColumn>
          <CostColumn
            title="정가"
            cost={33300}
            fontSize={16}
            comparison={-1200}
          />
          <CostColumn
            title="계정 공유 시 예상 가격"
            cost={12000}
            fontSize={16}
            comparison={-300}
          />
          <CostColumn
            title="결합 공유 시 예상 가격"
            cost={9000}
            fontSize={16}
            comparison={100}
          />

          <br />

          <ContentColumn title="중복 콘텐츠" difference={-12}></ContentColumn>
          <ContentColumn title="볼 만한 콘텐츠" difference={3}></ContentColumn>
          <Buttons>
            <Button onClick={() => router.push("/suggestion")}>
              계정 공유 알아보기
            </Button>
            <Button onClick={() => router.push("/suggestion")}>
              결합 할인 알아보기
            </Button>
          </Buttons>
        </ProviderSelector>

        <ProviderSelector>
          <OttColumn>
            <Providers>
              <Ott imageUrl="/images/netflix.png" />
              <Ott imageUrl="/images/tving.png" />
            </Providers>
            <Spacer />
            <Right weight={600}>추천 조합2</Right>
          </OttColumn>
          <CostColumn
            title="정가"
            cost={23400}
            fontSize={16}
            comparison={-11100}
          />
          <CostColumn
            title="계정 공유 시 예상 가격"
            cost={8000}
            fontSize={16}
            comparison={-4300}
          />
          <CostColumn
            title="결합 공유 시 예상 가격"
            cost={5900}
            fontSize={16}
            comparison={-3000}
          />

          <br />

          <ContentColumn title="중복 콘텐츠" difference={-12}></ContentColumn>
          <ContentColumn title="볼 만한 콘텐츠" difference={-9}></ContentColumn>
          <Buttons>
            <Button onClick={() => router.push("/suggestion")}>
              계정 공유 알아보기
            </Button>
            <Button onClick={() => router.push("/suggestion")}>
              결합 할인 알아보기
            </Button>
          </Buttons>
        </ProviderSelector>
      </Wrapper>
    </Layout>
  );
}
