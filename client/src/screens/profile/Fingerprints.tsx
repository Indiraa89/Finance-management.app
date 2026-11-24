import { Fingerprint, Plus } from 'lucide-react-native';
import { FingerprintBadge } from '@/components/illustrations';
import { Screen } from '@/components/Screen';
import { Button, Empty, ErrorText, Hint, Loadable, SectionTitle, Stack, ToggleRow } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSettings, useUpdateSettings } from '@/hooks/queries';
import { useNav, useParams } from '@/navigation/types';
import { Menu, MenuRow } from './common';

/** 9.5. Список отпечатков */
export function Fingerprints() {
  const navigation = useNav();
  const settings = useSettings();
  const update = useUpdateSettings();
  const { user, setUser } = useAuth();

  return (
    <Screen tab="Profile" back title="Отпечаток пальца">
      <Stack gap={22}>
        <ToggleRow
          label="Вход по отпечатку"
          checked={user?.fingerprintEnabled ?? false}
          onChange={async (v) => setUser((await update.mutateAsync({ fingerprintEnabled: v })).user)}
        />
        <Loadable query={settings}>
          {(s) => (
            <Menu>
              {s.fingerprints.length === 0 && <Empty>Отпечатки ещё не добавлены</Empty>}
              {s.fingerprints.map((f) => (
                <MenuRow
                  key={f.id}
                  icon={Fingerprint}
                  label={f.name}
                  chevron
                  onPress={() => navigation.navigate('FingerprintDetail', { id: f.id })}
                />
              ))}
              <MenuRow icon={Plus} label="Добавить отпечаток" chevron onPress={() => navigation.navigate('AddFingerprint')} />
            </Menu>
          )}
        </Loadable>
      </Stack>
    </Screen>
  );
}

/** 9.5. Один отпечаток: удалить */
export function FingerprintDetail() {
  const { id } = useParams<'FingerprintDetail'>();
  const navigation = useNav();
  const settings = useSettings();
  const update = useUpdateSettings();
  const { setUser } = useAuth();
  const fp = settings.data?.fingerprints.find((f) => f.id === id);

  return (
    <Screen tab="Profile" back title={fp?.name ?? 'Отпечаток'}>
      <Stack gap={26} center>
        <FingerprintBadge />
        <SectionTitle size={18}>{fp?.name ?? ''}</SectionTitle>
        <Button
          title="Удалить"
          variant="secondary"
          block
          disabled={!fp || update.isPending}
          onPress={async () => {
            setUser((await update.mutateAsync({ removeFingerprintId: id })).user);
            navigation.goBack();
          }}
        />
      </Stack>
    </Screen>
  );
}

/** 9.5. Добавить отпечаток (учебная имитация сканирования) */
export function AddFingerprint() {
  const navigation = useNav();
  const settings = useSettings();
  const update = useUpdateSettings();
  const { user, setUser } = useAuth();

  const add = async () => {
    const n = (settings.data?.fingerprints.length ?? 0) + 1;
    const name = `Отпечаток ${user?.fullName.split(' ')[0] ?? ''} ${n}`.replace(/\s+/g, ' ').trim();
    setUser((await update.mutateAsync({ addFingerprint: name })).user);
    navigation.replace('Success', { message: 'Отпечаток успешно добавлен', next: 'Fingerprints' });
  };

  return (
    <Screen tab="Profile" back title="Новый отпечаток">
      <Stack gap={22} center>
        <FingerprintBadge />
        <SectionTitle size={18}>Используйте отпечаток для входа</SectionTitle>
        <Hint center>Приложите палец к сканеру. В учебной версии нажмите кнопку — сканирование будет имитировано.</Hint>
        {update.error ? <ErrorText>{update.error.message}</ErrorText> : null}
        <Button title="Сканировать отпечаток" variant="secondary" block disabled={update.isPending} onPress={add} />
      </Stack>
    </Screen>
  );
}
