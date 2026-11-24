import { FingerprintBadge } from '@/components/illustrations';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, SectionTitle, Stack, TextLink } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSubmit } from '@/hooks/useSubmit';
import { useNav } from '@/navigation/types';

/** 3.3-A. Вход по отпечатку (учебная имитация: подтверждаем сохранённую сессию) */
export function FingerprintLogin() {
  const navigation = useNav();
  const { loginWithFingerprint } = useAuth();
  const { loading, error, run } = useSubmit();

  return (
    <Screen title="Вход по отпечатку" bell={false} back sheetStyle={{ paddingTop: 48, paddingHorizontal: 32 }}>
      <Stack gap={22} center>
        <FingerprintBadge />
        <SectionTitle size={18}>Используйте отпечаток для входа</SectionTitle>
        <Hint center>
          Приложите палец к сканеру — и вы в приложении без ввода пароля. В учебной версии нажмите кнопку ниже, чтобы
          имитировать сканирование.
        </Hint>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Button
          title={loading ? 'Сканируем…' : 'Использовать Touch ID'}
          variant="secondary"
          block
          disabled={loading}
          onPress={() => run(() => loginWithFingerprint())}
        />
        <TextLink title="Или войдите с паролем" onPress={() => navigation.navigate('Login')} />
      </Stack>
    </Screen>
  );
}
