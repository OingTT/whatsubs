import styled from '@emotion/styled';
import { Subscription } from '@prisma/client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { checkedSubsState, selectedSubsState } from '@/lib/client/state';
import { VerticalBar } from '@/lib/client/style';
import useUser from '@/lib/client/useUser';

const Selector = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: var(--secondary);
  overflow: auto;
  border-radius: 16px;
  user-select: none;
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

const TextButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: 16px;
  gap: 8px;
`;

const TextButton = styled.h6`
  cursor: pointer;
`;

interface SubsForm {
  subscriptions: string[];
}

export default function SubsSelector() {
  const user = useUser();
  const [selectedSubs, setSelectedSubs] = useRecoilState(selectedSubsState);
  const [checkedSubs, setCheckedSubs] = useRecoilState(checkedSubsState);
  const router = useRouter();
  const { data: subscriptions } = useSWR<Subscription[]>('/api/subscriptions');
  const { data: userSubscriptions } = useSWR<number[]>(
    '/api/users/me/subscriptions'
  );
  const { register, setValue, watch } = useForm<SubsForm>({
    defaultValues: {
      subscriptions: checkedSubs.map(sub => sub.id.toString()),
    },
  });

  // If selectedSubs is empty, set checkedSubs to userSubscriptions
  useEffect(() => {
    if (subscriptions && userSubscriptions && selectedSubs.length === 0) {
      if (userSubscriptions.length === 0) {
        // If userSubscriptions is empty, set checkedSubs to all subscriptions
        setValue(
          'subscriptions',
          subscriptions.map(sub => sub.id.toString())
        );
        setCheckedSubs(subscriptions);
      } else {
        // If userSubscriptions is not empty, set checkedSubs to userSubscriptions
        setValue('subscriptions', userSubscriptions.map(String));
        setCheckedSubs(
          userSubscriptions.map(id => subscriptions.find(s => s.id === id)!)
        );
      }
    }
  }, [
    selectedSubs.length,
    setCheckedSubs,
    setValue,
    subscriptions,
    userSubscriptions,
  ]);

  // If selectedSubs is empty, set checkedSubs to target subscription
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedSubs.length === 0) {
      setValue('subscriptions', [e.target.value]);
      setCheckedSubs([
        subscriptions?.find(s => s.id === Number(e.target.value))!,
      ]);
      setSelectedSubs([
        subscriptions?.find(s => s.id === Number(e.target.value))!,
      ]);
    } else {
      setSelectedSubs(
        subscriptions?.filter(sub =>
          watch('subscriptions').includes(sub.id.toString())
        )!
      );
      setCheckedSubs(
        subscriptions?.filter(sub =>
          watch('subscriptions').includes(sub.id.toString())
        )!
      );
    }
  };

  const handleSelectAll = () => {
    if (subscriptions) {
      if (selectedSubs.length === subscriptions.length) {
        setValue('subscriptions', []);
        setSelectedSubs([]);
        setCheckedSubs([]);
      } else {
        setValue(
          'subscriptions',
          subscriptions.map(subscription => subscription.id.toString())
        );
        setSelectedSubs(subscriptions);
        setCheckedSubs(subscriptions);
      }
    }
  };

  return (
    <Selector>
      <Providers>
        {subscriptions?.map(
          subscription =>
            userSubscriptions?.includes(subscription.id) && (
              <SubsWrapper
                key={subscription.id}
                htmlFor={subscription.id.toString()}
              >
                <Input
                  id={subscription.id.toString()}
                  type="checkbox"
                  {...register('subscriptions', { onChange: handleChange })}
                  value={subscription.id}
                />
                <SubsImage
                  src={`/images/subs/${subscription.key}.png`}
                  width="40"
                  height="40"
                  alt={subscription.name}
                  priority
                />
              </SubsWrapper>
            )
        )}

        {subscriptions &&
          userSubscriptions &&
          userSubscriptions.length > 0 &&
          userSubscriptions.length < subscriptions.length && (
            <VerticalBar size={20} />
          )}

        {subscriptions?.map(
          subscription =>
            !userSubscriptions?.includes(subscription.id) && (
              <SubsWrapper
                key={subscription.id}
                htmlFor={subscription.id.toString()}
              >
                <Input
                  id={subscription.id.toString()}
                  type="checkbox"
                  {...register('subscriptions', { onChange: handleChange })}
                  value={subscription.id}
                />
                <SubsImage
                  src={`/images/subs/${subscription.key}.png`}
                  width="40"
                  height="40"
                  alt={subscription.name}
                  priority
                />
              </SubsWrapper>
            )
        )}
      </Providers>

      <TextButtons>
        <TextButton onClick={handleSelectAll}>{`${
          selectedSubs.length === subscriptions?.length
            ? '전체 해제'
            : '전체 선택'
        }`}</TextButton>
        <VerticalBar size={12} />
        <TextButton onClick={() => router.push('/suggestion')}>
          조합 추천받기
        </TextButton>
      </TextButtons>
    </Selector>
  );
}
