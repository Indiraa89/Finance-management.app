import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { authApi } from '@/api';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, PasswordField, Stack } from '@/components/ui';
import { useSubmit } from '@/hooks/useSubmit';
import type { SuccessState } from '../launch/SuccessScreen';

/** 3.2-B. Новый пароль */
export function NewPassword() {
  const navigate = useNavigate();
  const resetToken = (useLocation().state as { resetToken?: string } | null)?.resetToken;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { loading, error, setError, run } = useSubmit();

  if (!resetToken) return <Navigate to="/forgot" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setError('Пароли не совпадают');
    const ok = await run(() => authApi.resetPassword({ resetToken, password }));
    if (ok) {
      const state: SuccessState = { message: 'Пароль успешно изменён', next: '/login' };
      navigate('/success', { replace: true, state });
    }
  };

  return (
    <Screen title="Новый пароль" bell={false} back sheetPadding="56px 36px 40px">
      <form onSubmit={submit}>
        <Stack $gap={24}>
          <PasswordField label="Новый пароль" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <PasswordField label="Повторите новый пароль" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          {error && <ErrorText>{error}</ErrorText>}
          <Stack $center style={{ marginTop: 120 }}>
            <Button type="submit" disabled={loading}>
              Сменить пароль
            </Button>
          </Stack>
        </Stack>
      </form>
    </Screen>
  );
}
