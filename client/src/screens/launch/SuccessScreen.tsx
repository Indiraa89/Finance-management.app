import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { SuccessRing } from '@/components/illustrations';
import { FullScreen } from '@/components/Screen';

export interface SuccessState {
  message: string;
  next: string;
}

/**
 * 3.2-C и похожие экраны: «Пароль успешно изменён», «PIN изменён» и т.д.
 * Через 2 секунды переходит дальше.
 */
export function SuccessScreen() {
  const navigate = useNavigate();
  const state = (useLocation().state ?? { message: 'Готово!', next: '/home' }) as SuccessState;

  useEffect(() => {
    const id = setTimeout(() => navigate(state.next, { replace: true }), 2000);
    return () => clearTimeout(id);
  }, [navigate, state.next]);

  return (
    <FullScreen onClick={() => navigate(state.next, { replace: true })}>
      <SuccessRing />
      <Message>{state.message}</Message>
    </FullScreen>
  );
}

const Message = styled.p`
  font-size: 22px;
  font-weight: 600;
  max-width: 260px;
  line-height: 1.35;
`;
