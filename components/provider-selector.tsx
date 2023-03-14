import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

const Selector = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #eee;
  border-radius: 16px;

  @media (min-width: 1200px) {
    width: 936px;
  }
`;

const Providers = styled.div`
  display: flex;
  gap: 12px;
`;

const Provider = styled(Image)`
  border-radius: 100%;
`;

const SuggestionLink = styled(Link)`
  color: #333;
  font-weight: 600;
`;

export default function ProviderSelector() {
  return (
    <Selector>
      <Providers>
        <Provider
          src={`/images/whatsubs-dark.png`}
          width="40"
          height="40"
          alt="logo"
        />
        <Provider
          src={`/images/whatsubs-dark.png`}
          width="40"
          height="40"
          alt="logo"
        />
        <Provider
          src={`/images/whatsubs-dark.png`}
          width="40"
          height="40"
          alt="logo"
        />
      </Providers>

      <SuggestionLink href="/">조합 추천받기</SuggestionLink>
    </Selector>
  );
}
