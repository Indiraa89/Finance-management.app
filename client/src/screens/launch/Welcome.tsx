import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Logo } from '@/components/illustrations';
import { FullScreen } from '@/components/Screen';
import { Button, Hint, Stack, TextLink } from '@/components/ui';
import { colors } from '@/theme';

/** 1-B. Стартовый экран: «Войти» / «Регистрация» / «Забыли пароль?» */
export function Welcome() {
  const navigate = useNavigate();
  return (
    <FullScreen $bg={colors.honeydew}>
      <Logo color={colors.primary} markColor={colors.primary} />
      <Text>
        Следите за доходами и расходами, ставьте цели и копите — всё в одном приложении.
      </Text>
      <Stack $gap={12} $center style={{ marginTop: 20 }}>
        <Button onClick={() => navigate('/login')}>Войти</Button>
        <Button $variant="secondary" onClick={() => navigate('/signup')}>
          Регистрация
        </Button>
        <TextLink onClick={() => navigate('/forgot')}>Забыли пароль?</TextLink>
      </Stack>
    </FullScreen>
  );
}

const Text = styled(Hint)`
  max-width: 250px;
  color: ${colors.dark};
`;
