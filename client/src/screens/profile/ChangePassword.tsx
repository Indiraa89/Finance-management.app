import { useState } from 'react';
import { profileApi } from '@/api';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, PasswordField, Stack } from '@/components/ui';
import { useSubmit } from '@/hooks/useSubmit';
import { useNav } from '@/navigation/types';

/** 9.5. Смена пароля */
export function ChangePassword() {
  const navigation = useNav();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const { loading, error, setError, run } = useSubmit();
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (form.next !== form.confirm) return setError('Пароли не совпадают');
    const ok = await run(() => profileApi.changePassword({ currentPassword: form.current, newPassword: form.next }));
    if (ok) navigation.replace('Success', { message: 'Пароль успешно изменён', next: 'Settings' });
  };

  return (
    <Screen tab="Profile" back title="Сменить пароль">
      <Stack gap={22}>
        <PasswordField label="Текущий пароль" value={form.current} onChangeText={set('current')} />
        <PasswordField label="Новый пароль" value={form.next} onChangeText={set('next')} />
        <PasswordField label="Повторите новый пароль" value={form.confirm} onChangeText={set('confirm')} />
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Button title="Сменить пароль" disabled={loading} onPress={submit} style={{ marginTop: 40 }} />
      </Stack>
    </Screen>
  );
}
