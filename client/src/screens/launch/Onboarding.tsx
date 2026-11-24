import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { CoinsHand, IllustrationCircle, PhoneHand } from '@/components/illustrations';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme';
import { ONBOARDING_KEY } from './Splash';

const slides = [
  { title: 'Добро пожаловать\nв менеджер расходов', Art: CoinsHand },
  { title: 'Готовы взять\nфинансы\nпод контроль?', Art: PhoneHand },
];

/** 2-A и 2-B. Онбординг из двух слайдов */
export function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { title, Art } = slides[step];

  const next = () => {
    if (step < slides.length - 1) return setStep(step + 1);
    try {
      localStorage.setItem(ONBOARDING_KEY, '1');
    } catch {
      /* хранилище недоступно */
    }
    navigate('/welcome', { replace: true });
  };

  return (
    <Screen
      bell={false}
      header={<Title>{title}</Title>}
      sheetPadding="48px 32px 40px"
    >
      <Body>
        <IllustrationCircle>
          <Art />
        </IllustrationCircle>
        <Next onClick={next}>{step < slides.length - 1 ? 'Далее' : 'Начать'}</Next>
        <Dots>
          {slides.map((s, i) => (
            <Dot key={s.title} $active={i === step} onClick={() => setStep(i)} aria-label={`Слайд ${i + 1}`} />
          ))}
        </Dots>
      </Body>
    </Screen>
  );
}

const Title = styled.h1`
  white-space: pre-line;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
  padding: 50px 0 60px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding-top: 10px;
`;

const Next = styled.button`
  font-size: 28px;
  font-weight: 600;
  color: ${colors.dark};
  margin-top: 10px;
`;

const Dots = styled.div`
  display: flex;
  gap: 10px;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1.5px solid ${({ $active }) => ($active ? colors.primary : colors.dark)};
  background: ${({ $active }) => ($active ? colors.primary : 'transparent')};
`;
