import { useNavigate } from 'react-router';
import { FingerprintBadge } from '@/components/illustrations';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, SectionTitle, Stack, TextLink } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSubmit } from '@/hooks/useSubmit';

/** 3.3-A. Вход по отпечатку (в браузере — имитация: подтверждаем сохранённую сессию) */
export function FingerprintLogin() {
  const navigate = useNavigate();
  const { loginWithFingerprint } = useAuth();
  const { loading, error, run } = useSubmit();

  const use = async () => {
    const ok = await run(() => loginWithFingerprint());
    if (ok) navigate('/home', { replace: true });
  };

  return (
    <Screen title="Вход по отпечатку" bell={false} back sheetPadding="48px 36px 40px">
      <Stack $gap={22} $center>
        <FingerprintBadge />
        <SectionTitle style={{ fontSize: 18 }}>Используйте отпечаток для входа</SectionTitle>
        <Hint>
          Приложите палец к сканеру — и вы в приложении без ввода пароля. В браузере нажмите кнопку
          ниже, чтобы имитировать сканирование.
        </Hint>
        {error && <ErrorText>{error}</ErrorText>}
        <Button $variant="secondary" $block disabled={loading} onClick={use}>
          {loading ? 'Сканируем…' : 'Использовать Touch ID'}
        </Button>
        <TextLink onClick={() => navigate('/login')}>Или войдите с паролем</TextLink>
      </Stack>
    </Screen>
  );
}
