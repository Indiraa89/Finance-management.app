import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { profileApi } from '@/api';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, PasswordField, Stack } from '@/components/ui';
import { useSubmit } from '@/hooks/useSubmit';
import type { SuccessState } from '../launch/SuccessScreen';

/** 9.5. Смена пароля */
export function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const { loading, error, setError, run } = useSubmit();
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.next !== form.confirm) return setError('Пароли не совпадают');
    const ok = await run(() => profileApi.changePassword({ currentPassword: form.current, newPassword: form.next }));
    if (ok) {
      const state: SuccessState = { message: 'Пароль успешно изменён', next: '/profile/settings' };
      navigate('/success', { replace: true, state });
    }
  };

  return (
    <Screen nav back="/profile/settings" title="Сменить пароль">
      <form onSubmit={submit}>
        <Stack $gap={22}>
          <PasswordField label="Текущий пароль" autoComplete="current-password" value={form.current} onChange={set('current')} required />
          <PasswordField label="Новый пароль" autoComplete="new-password" value={form.next} onChange={set('next')} required />
          <PasswordField label="Повторите новый пароль" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} required />
          {error && <ErrorText>{error}</ErrorText>}
          <Stack $center style={{ marginTop: 40 }}>
            <Button type="submit" disabled={loading}>
              Сменить пароль
            </Button>
          </Stack>
        </Stack>
      </form>
    </Screen>
  );
}
