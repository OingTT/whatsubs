import styled from "@emotion/styled";
import Image from "next/image";

const Bar = styled.div`
  box-sizing: border-box;
  width: 936px;
  height: min-content;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 16px 16px 16px;
  background-color: #eeeeee;
  overflow: hidden;
  align-content: center;
  flex-wrap: nowrap;
  gap: 12;
  position: absolute;
  border-radius: 16px;
`;

const Logo = styled(Image)`
  overflow: hidden;
  border-radius: 100%;
`;

const Button = styled.button`
  width: 100px;
  height: 40px;
  float: right;
`;

export default function ProviderSelector() {
  return (
    <Bar>
      <Logo src={`/images/netflix.png`} width="40" height="40" alt="logo" />
      <Logo src={`/images/watcha.png`} width="40" height="40" alt="logo" />
      <Logo src={`/images/disneyplus.png`} width="40" height="40" alt="logo" />
      <Button>
        <h3>조합 추천받기</h3>
      </Button>
    </Bar>
  );
}
