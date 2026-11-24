import { Logo } from '@/components/illustrations';
import { FullScreen } from '@/components/Screen';
import { Button, Hint, Stack, TextLink } from '@/components/ui';
import { useNav } from '@/navigation/types';
import { colors } from '@/theme';

/** 1-B. Стартовый экран: «Войти» / «Регистрация» / «Забыли пароль?» */
export function Welcome() {
  const navigation = useNav();
  return (
    <FullScreen bg={colors.honeydew}>
      <Logo color={colors.primary} markColor={colors.primary} />
      <Hint center style={{ maxWidth: 250, color: colors.dark }}>
        Следите за доходами и расходами, ставьте цели и копите — всё в одном приложении.
      </Hint>
      <Stack gap={12} center style={{ marginTop: 20 }}>
        <Button title="Войти" onPress={() => navigation.navigate('Login')} />
        <Button title="Регистрация" variant="secondary" onPress={() => navigation.navigate('SignUp')} />
        <TextLink title="Забыли пароль?" onPress={() => navigation.navigate('Forgot')} />
      </Stack>
    </FullScreen>
  );
}
