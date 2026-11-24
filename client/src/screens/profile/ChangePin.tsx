import { useState } from 'react';
import { profileApi } from '@/api';
import { PinInput } from '@/components/PinInput';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, SectionTitle, Stack } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSubmit } from '@/hooks/useSubmit';
import { useNav } from '@/navigation/types';

/** 9.5. Смена PIN-кода */
export function ChangePin() {
  const navigation = useNav();
  const { user, setUser } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const { loading, error, setError, run } = useSubmit();

  const submit = async () => {
    if (next.length !== 6) return setError('PIN состоит из 6 цифр');
    if (next !== confirm) return setError('PIN-коды не совпадают');
    const ok = await run(() => profileApi.changePin({ currentPin: current || undefined, newPin: next }));
    if (ok && user) {
      setUser({ ...user, hasPin: true });
      navigation.replace('Success', { message: 'PIN успешно изменён', next: 'Security' });
    }
  };

  return (
    <Screen tab="Profile" back title="Сменить PIN">
      <Stack gap={26} center>
        {user?.hasPin && (
          <Stack gap={12} center>
            <SectionTitle>Текущий PIN</SectionTitle>
            <PinInput value={current} onChange={setCurrent} secret label="Текущий PIN" />
          </Stack>
        )}
        <Stack gap={12} center>
          <SectionTitle>Новый PIN</SectionTitle>
          <PinInput value={next} onChange={setNext} secret label="Новый PIN" />
        </Stack>
        <Stack gap={12} center>
          <SectionTitle>Повторите PIN</SectionTitle>
          <PinInput value={confirm} onChange={setConfirm} secret label="Повторите PIN" />
        </Stack>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Button title="Сменить PIN" disabled={loading} onPress={submit} style={{ marginTop: 20 }} />
      </Stack>
    </Screen>
  );
}
