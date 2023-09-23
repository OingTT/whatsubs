import {
  MovieDetail,
  SubscriptionWithUrl,
  TVDetail,
} from '@/lib/client/interface';
import { VerticalBar } from '@/lib/client/style';
import usePlayLinks from '@/lib/client/usePlayLinks';
import styled from '@emotion/styled';
import { IconPlayerPlayFilled } from '@tabler/icons-react';
import Image from 'next/image';
import { UseFormRegisterReturn, useForm } from 'react-hook-form';
import useSWR from 'swr';

const Wrapper = styled.form`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
`;

const PlayButton = styled.div<{ disabled: boolean }>`
  width: 96px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  box-shadow: ${props =>
    props.disabled ? 'none' : '0px 2px 8px rgba(0, 0, 0, 0.25)'};
  background-color: var(
    ${props => (props.disabled ? '--secondary' : '--primary')}
  );
  color: var(--text-primary);
  border-radius: 8px;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
`;

const Providers = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Provider = styled(Image)`
  border-radius: 100%;
`;

const Input = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;

  &:checked ~ label > img {
    filter: none;
  }
`;

const Label = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;

  & > img {
    filter: contrast(50%) opacity(50%);
  }
`;

interface RadioProps {
  provider: SubscriptionWithUrl;
  index: number;
  register: UseFormRegisterReturn;
}

function Radio({ provider, index, register }: RadioProps) {
  return (
    <div>
      <Input
        id={provider.key}
        value={index}
        type="radio"
        {...register}
        defaultChecked={index === 0}
        onKeyDown={(
          e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          e.key === 'Enter' && e.preventDefault();
        }}
      />
      <Label htmlFor={provider.key}>
        <Provider
          src={`/images/subs/${provider.key}.png`}
          width={32}
          height={32}
          alt="Provider"
        />
      </Label>
    </div>
  );
}

interface SelectorForm {
  index: number;
}

interface PlaySelectorProps {
  contentDetail?: MovieDetail | TVDetail;
}

export default function PlaySelector({ contentDetail }: PlaySelectorProps) {
  const providers = usePlayLinks(
    contentDetail?.['watch/providers']?.results?.KR
  );
  const { register, watch } = useForm<SelectorForm>({
    defaultValues: {
      index: 0,
    },
  });
  const { data: userSubscriptions } = useSWR<number[]>(
    '/api/users/me/subscriptions'
  );

  const userProviders = providers?.filter(
    provider =>
      userSubscriptions?.find(subscription => subscription === provider.id)
  );

  return (
    <Wrapper>
      <a href={providers?.[watch('index')]?.url} target="_blank" rel="noopener">
        <PlayButton disabled={providers?.[watch('index')]?.url === undefined}>
          <IconPlayerPlayFilled size={16} />
        </PlayButton>
      </a>

      <Providers>
        {providers?.map((provider, index) => {
          return (
            provider &&
            userSubscriptions?.includes(provider.id) && (
              <Radio
                key={provider.id}
                provider={provider}
                index={index}
                register={register('index', { valueAsNumber: true })}
              />
            )
          );
        })}

        {providers &&
          userProviders &&
          userProviders.length > 0 &&
          userProviders.length < providers.length && <VerticalBar size={16} />}

        {providers?.map((provider, index) => {
          return (
            provider &&
            !userSubscriptions?.includes(provider.id) && (
              <Radio
                key={provider.id}
                provider={provider}
                index={index}
                register={register('index', { valueAsNumber: true })}
              />
            )
          );
        })}
      </Providers>
    </Wrapper>
  );
}
