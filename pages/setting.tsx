import Layout from '@/components/layout/layout';
import { Container } from '@/lib/client/style';
import useUser from '@/lib/client/useUser';
import styled from '@emotion/styled';
import { Watch } from '@prisma/client';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const Profile = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  background-color: var(--background-light);
  gap: 24px;
  border-radius: 16px;

  @media (max-width: 809px) {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  }
`;

const Avatar = styled(Image)`
  border-radius: 100%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;

const Email = styled.div`
  color: var(--text-secondary);
  font-size: 12px;
`;

const Counts = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  background-color: var(--background-light);
  border-radius: 16px;

  @media (max-width: 809px) {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  }
`;

const Count = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 8px;
`;

const CountNumber = styled.div`
  font-weight: 300;
  color: var(--text-secondary);
  font-size: 20px;
`;

const CountName = styled.div`
  font-weight: 600;
  font-size: 12px;
`;

const Group = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  background-color: var(--background-light);
  gap: 8px;
  border-radius: 16px;

  @media (max-width: 809px) {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  }
`;

const Tab = styled.h6`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: var(--secondary);
  }
`;

interface reviewCountResponse {
  [Watch.WANT_TO_WATCH]: number;
  [Watch.WATCHING]: number;
  [Watch.WATCHED]: number;
}

export default function User() {
  const user = useUser();
  const router = useRouter();
  const { data } = useSWR<reviewCountResponse>('/api/users/me/reviews/values');

  if (!user) return null;

  return (
    <Layout title="사용자 정보">
      <Container compact>
        <Profile>
          <Avatar
            src={user.avatar || '/images/avatar.png'}
            width={64}
            height={64}
            alt="profile"
            priority
            unoptimized
          />
          <Info>
            <h6>{user.name}</h6>
            <Email>{user.email}</Email>
          </Info>
        </Profile>

        <Counts>
          <Count>
            <CountNumber>{data ? data.WANT_TO_WATCH : '-'}</CountNumber>
            <CountName>찜하기</CountName>
          </Count>
          <Count>
            <CountNumber>{data ? data.WATCHING : '-'}</CountNumber>
            <CountName>보는중</CountName>
          </Count>
          <Count>
            <CountNumber>{data ? data.WATCHED : '-'}</CountNumber>
            <CountName>봤어요</CountName>
          </Count>
        </Counts>
      </Container>
      <Container compact>
        <Group>
          <Tab onClick={() => router.push('/new/1')}>초기설정 수정</Tab>
        </Group>

        <Group>
          <Tab onClick={() => router.push('/policy/terms')}>이용약관</Tab>
          <Tab onClick={() => router.push('/policy/privacy')}>
            개인정보처리방침
          </Tab>
        </Group>

        <Group>
          <Tab onClick={() => signOut()}>로그아웃</Tab>
        </Group>
      </Container>
    </Layout>
  );
}
