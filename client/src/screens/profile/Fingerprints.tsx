import { Fingerprint, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { FingerprintBadge } from '@/components/illustrations';
import { Screen } from '@/components/Screen';
import { Button, Empty, ErrorText, Hint, Loadable, SectionTitle, Stack, Toggle } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSettings, useUpdateSettings } from '@/hooks/queries';
import type { SuccessState } from '../launch/SuccessScreen';
import { Menu, MenuRow, ToggleRow } from './common';

/** 9.5. Список отпечатков */
export function Fingerprints() {
  const settings = useSettings();
  const update = useUpdateSettings();
  const { user, setUser } = useAuth();

  return (
    <Screen nav back="/profile/security" title="Отпечаток пальца">
      <Stack $gap={22}>
        <ToggleRow>
          Вход по отпечатку
          <Toggle
            label="Вход по отпечатку"
            checked={user?.fingerprintEnabled ?? false}
            onChange={async (v) => {
              const res = await update.mutateAsync({ fingerprintEnabled: v });
              setUser(res.user);
            }}
          />
        </ToggleRow>
        <Loadable query={settings}>
          {(s) => (
            <Menu>
              {s.fingerprints.length === 0 && <Empty>Отпечатки ещё не добавлены</Empty>}
              {s.fingerprints.map((f) => (
                <MenuRow key={f.id} icon={Fingerprint} label={f.name} to={`/profile/security/fingerprints/${f.id}`} chevron />
              ))}
              <MenuRow icon={Plus} label="Добавить отпечаток" to="/profile/security/fingerprints/add" chevron />
            </Menu>
          )}
        </Loadable>
      </Stack>
    </Screen>
  );
}

/** 9.5. Один отпечаток: удалить */
export function FingerprintDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const settings = useSettings();
  const update = useUpdateSettings();
  const { setUser } = useAuth();
  const fp = settings.data?.fingerprints.find((f) => f.id === id);

  return (
    <Screen nav back="/profile/security/fingerprints" title={fp?.name ?? 'Отпечаток'}>
      <Stack $gap={26} $center>
        <FingerprintBadge />
        <SectionTitle style={{ fontSize: 18 }}>{fp?.name}</SectionTitle>
        <Button
          $variant="secondary"
          $block
          disabled={!fp || update.isPending}
          onClick={async () => {
            const res = await update.mutateAsync({ removeFingerprintId: id });
            setUser(res.user);
            navigate('/profile/security/fingerprints', { replace: true });
          }}
        >
          Удалить
        </Button>
      </Stack>
    </Screen>
  );
}

/** 9.5. Добавить отпечаток (имитация сканирования) */
export function AddFingerprint() {
  const navigate = useNavigate();
  const settings = useSettings();
  const update = useUpdateSettings();
  const { user, setUser } = useAuth();

  const add = async () => {
    const n = (settings.data?.fingerprints.length ?? 0) + 1;
    const name = `Отпечаток ${user?.fullName.split(' ')[0] ?? ''} ${n}`.replace(/\s+/g, ' ').trim();
    const res = await update.mutateAsync({ addFingerprint: name });
    setUser(res.user);
    const state: SuccessState = { message: 'Отпечаток успешно добавлен', next: '/profile/security/fingerprints' };
    navigate('/success', { replace: true, state });
  };

  return (
    <Screen nav back="/profile/security/fingerprints" title="Новый отпечаток">
      <Stack $gap={22} $center>
        <FingerprintBadge />
        <SectionTitle style={{ fontSize: 18 }}>Используйте отпечаток для входа</SectionTitle>
        <Hint>Приложите палец к сканеру. В браузере нажмите кнопку — сканирование будет имитировано.</Hint>
        {update.error && <ErrorText>{update.error.message}</ErrorText>}
        <Button $variant="secondary" $block disabled={update.isPending} onClick={add}>
          Сканировать отпечаток
        </Button>
      </Stack>
    </Screen>
  );
}
