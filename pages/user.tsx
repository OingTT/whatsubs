import Layout from "@/components/layout";
import useUser from "@/lib/client/useUser";
import styled from "@emotion/styled";
import { signOut } from "next-auth/react";
import Image from "next/image";
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

const Profile = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  gap: 24px;
  border-radius: 16px;

  @media (max-width: 809px) {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  }
`;

const Avatar = styled(Image)`
  border-radius: 100%;
`;

const Name = styled.div`
  font-weight: 600;
  color: #333333;
  font-size: 16px;
`;

const Group = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  gap: 8px;
  border-radius: 16px;

  @media (max-width: 809px) {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  }
`;

const Tab = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  font-weight: 600;
  color: #333333;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`;

export default function Home() {
  const user = useUser();
  const router = useRouter();

  if (!user) return null;

  return (
    <Layout title="사용자 정보">
      <Wrapper>
        <Profile>
          <Avatar
            src={user.avatar || "/images/avatar.png"}
            width={64}
            height={64}
            alt="profile"
          />
          <Name>{user.name}</Name>
        </Profile>

        <Group>
          <Tab onClick={() => router.push("/new/1")}>초기설정 수정</Tab>
        </Group>

        <Group>
          <Tab onClick={() => signOut()}>로그아웃</Tab>
        </Group>
      </Wrapper>
    </Layout>
  );
}
