import SignupLayout from '@/components/layout/signup-layout';
import useMutation from '@/lib/client/useMutation';
import styled from '@emotion/styled';
import { Subscription } from '@prisma/client';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(1px, 1fr));
  gap: 16px;
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
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  filter: contrast(50%) opacity(50%);
`;

const Input = styled.input`
  display: none;

  &:checked ~ img {
    filter: none;
  }

  &:not(:checked) ~ h6 {
    opacity: 0.25;
  }
`;

interface SubscriptionsForm {
  subscriptions: string[];
}

export default function Subscriptions() {
  const router = useRouter();
  const { data: userSubscription, mutate } = useSWR<number[]>(
    '/api/users/me/subscriptions'
  );
  const { data: subscriptions } = useSWR<Subscription[]>('/api/subscriptions');
  const { register, handleSubmit, setValue } = useForm<SubscriptionsForm>();
  const [updateSubscriptions, { loading, data }] = useMutation<number[]>(
    '/api/users/me/subscriptions'
  );

  useEffect(() => {
    if (userSubscription) {
      setValue('subscriptions', userSubscription.map(String));
    }
  }, [setValue, userSubscription]);

  useEffect(() => {
    if (data) {
      mutate(data);
      router.push('/new/2');
    }
  }, [data, mutate, router]);

  const onSubmit = (data: SubscriptionsForm) => {
    if (loading) return;
    updateSubscriptions(data);
  };

  return (
    <SignupLayout
      progress={100 / 6}
      title="무엇을 구독하고 계신가요?"
      subtitle="구독 중인 서비스를 선택해주세요."
      onSubmit={handleSubmit(onSubmit)}
      onBack={() => signOut({ callbackUrl: '/login' })}
      nextText={loading ? '저장 중...' : undefined}
    >
      <Wrapper>
        {subscriptions?.map(subscription => (
          <SubsWrapper
            key={subscription.id}
            htmlFor={subscription.id.toString()}
          >
            <Input
              id={subscription.id.toString()}
              type="checkbox"
              {...register('subscriptions')}
              value={subscription.id}
            />
            <SubsImage
              src={`/images/subs/${subscription.key}.png`}
              width="64"
              height="64"
              alt={subscription.name}
            />
            <h6>{subscription.name}</h6>
          </SubsWrapper>
        ))}
      </Wrapper>
    </SignupLayout>
  );
}
