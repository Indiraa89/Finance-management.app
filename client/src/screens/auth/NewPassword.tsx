import { useState } from 'react';
import { authApi } from '@/api';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, PasswordField, Stack } from '@/components/ui';
import { useSubmit } from '@/hooks/useSubmit';
import { useNav, useParams } from '@/navigation/types';

/** 3.2-B. Новый пароль */
export function NewPassword() {
  const navigation = useNav();
  const { resetToken } = useParams<'NewPassword'>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { loading, error, setError, run } = useSubmit();

  const submit = async () => {
    if (password !== confirm) return setError('Пароли не совпадают');
    const ok = await run(() => authApi.resetPassword({ resetToken, password }));
    if (ok) navigation.replace('Success', { message: 'Пароль успешно изменён', next: 'Login' });
  };

  return (
    <Screen title="Новый пароль" bell={false} back sheetStyle={{ paddingTop: 56, paddingHorizontal: 32 }}>
      <Stack gap={24}>
        <PasswordField label="Новый пароль" value={password} onChangeText={setPassword} />
        <PasswordField label="Повторите новый пароль" value={confirm} onChangeText={setConfirm} />
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Button title="Сменить пароль" disabled={loading} onPress={submit} style={{ marginTop: 100 }} />
      </Stack>
    </Screen>
  );
}
