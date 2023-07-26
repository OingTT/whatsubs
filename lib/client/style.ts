import styled from '@emotion/styled';

export const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-rows: min-content;
  gap: 24px;

  @media (max-width: 809px) {
    gap: 16px;
  }
`;

export const VerticalBar = styled.div<{ size: number }>`
  width: 2px;
  border-radius: 1px;
  height: ${props => props.size}px;
  background-color: var(--text-secondary);
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const Description = styled.span`
  font-weight: 500;
  color: var(--text-secondary);
`;

export const Caption = styled.p`
  font-size: 0.875rem; // 14px
  line-height: 1.4;
  font-weight: 500;
`;

export const Container = styled.div<{
  fill?: boolean;
  compact?: boolean;
  fit?: boolean;
}>`
  width: ${props => (props.fill ? '100%' : '984px')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px ${props => (props.fill ? '0px' : '')};
  padding-top: ${props => (props.fit ? '8px' : '')};
  gap: ${props => (props.compact ? '24px' : '32px')};

  @media (max-width: 1199px) {
    width: 100%;
  }

  @media (max-width: 809px) {
    padding: 16px ${props => (props.fill ? '0px' : '')};
    padding-top: ${props => (props.fit ? '8px' : '')};
    gap: ${props => (props.compact ? '16px' : '24px')};
  }
`;

export const Section = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 809px) {
    gap: 12px;
  }
`;
