import SignupLayout from "@/components/layout/signup-layout";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  width: 256px;
  height: 256px;
  background-image: url(https://em-content.zobj.net/source/microsoft-teams/337/party-popper_1f389.png);
`;

export default function Genres() {
  return (
    <SignupLayout
      progress={400 / 6}
      title="잘 구독하고 있어요!"
      subtitle="가입을 마치고 콘텐츠에 평점을 남겨주세요. 더 정확한 조합 추천을 제공해드려요."
      nextLink="/new/5"
    >
      <Wrapper />
    </SignupLayout>
  );
}
