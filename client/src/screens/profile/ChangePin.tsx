import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { profileApi } from '@/api';
import { PinInput } from '@/components/PinInput';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, SectionTitle, Stack } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSubmit } from '@/hooks/useSubmit';
import type { SuccessState } from '../launch/SuccessScreen';

/** 9.5. Смена PIN-кода */
export function ChangePin() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const { loading, error, setError, run } = useSubmit();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (next.length !== 6) return setError('PIN состоит из 6 цифр');
    if (next !== confirm) return setError('PIN-коды не совпадают');
    const ok = await run(() => profileApi.changePin({ currentPin: current || undefined, newPin: next }));
    if (ok && user) {
      setUser({ ...user, hasPin: true });
      const state: SuccessState = { message: 'PIN успешно изменён', next: '/profile/security' };
      navigate('/success', { replace: true, state });
    }
  };

  return (
    <Screen nav back="/profile/security" title="Сменить PIN">
      <form onSubmit={submit}>
        <Stack $gap={26} $center>
          {user?.hasPin && (
            <Stack $gap={12} $center>
              <SectionTitle>Текущий PIN</SectionTitle>
              <PinInput value={current} onChange={setCurrent} secret />
            </Stack>
          )}
          <Stack $gap={12} $center>
            <SectionTitle>Новый PIN</SectionTitle>
            <PinInput value={next} onChange={setNext} secret />
          </Stack>
          <Stack $gap={12} $center>
            <SectionTitle>Повторите PIN</SectionTitle>
            <PinInput value={confirm} onChange={setConfirm} secret />
          </Stack>
          {error && <ErrorText>{error}</ErrorText>}
          <Button type="submit" disabled={loading} style={{ marginTop: 20 }}>
            Сменить PIN
          </Button>
        </Stack>
      </form>
    </Screen>
  );
}
