import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled, { keyframes } from 'styled-components';
import { Logo } from '@/components/illustrations';
import { FullScreen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';

export const ONBOARDING_KEY = 'finwise.onboardingDone';

/** 1-A. Сплэш: зелёный экран с логотипом, через 1,8 с — дальше */
export function Splash() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const id = setTimeout(() => {
      let onboardingDone = false;
      try {
        onboardingDone = localStorage.getItem(ONBOARDING_KEY) === '1';
      } catch {
        /* хранилище недоступно */
      }
      navigate(user ? '/home' : onboardingDone ? '/welcome' : '/onboarding', { replace: true });
    }, 1800);
    return () => clearTimeout(id);
  }, [loading, user, navigate]);

  return (
    <FullScreen>
      <Pop>
        <Logo />
      </Pop>
    </FullScreen>
  );
}

const pop = keyframes`
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
`;

const Pop = styled.div`
  animation: ${pop} 0.7s ease-out both;
`;
