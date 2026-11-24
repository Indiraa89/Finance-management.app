import { useState } from 'react';
import { View } from 'react-native';
import { profileApi } from '@/api';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, SectionTitle, Stack, T, TextField, ToggleRow } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSettings, useUpdateSettings } from '@/hooks/queries';
import { useSubmit } from '@/hooks/useSubmit';
import { colors } from '@/theme';
import { ProfileHead } from './common';

/** 9.5. Редактирование профиля */
export function EditProfile() {
  const { user, setUser } = useAuth();
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const { loading, error, run } = useSubmit();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    birthDate: user?.birthDate ?? '',
    budgetLimit: String(user?.budgetLimit ?? ''),
  });

  const set = (key: keyof typeof form) => (v: string) => {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: v }));
  };

  const submit = async () => {
    const ok = await run(async () => {
      const updated = await profileApi.update({ ...form, budgetLimit: Number(form.budgetLimit) });
      setUser(updated);
    });
    setSaved(ok);
  };

  return (
    <Screen back title="Редактировать профиль" top={<View style={{ height: 60 }} />}>
      <ProfileHead user={user} />
      <Stack gap={16}>
        <SectionTitle size={18}>Настройки аккаунта</SectionTitle>
        <TextField label="Имя и фамилия" value={form.fullName} onChangeText={set('fullName')} />
        <TextField label="Телефон" keyboardType="phone-pad" value={form.phone} onChangeText={set('phone')} />
        <TextField label="E-mail" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={set('email')} />
        <TextField label="Дата рождения (ГГГГ-ММ-ДД)" value={form.birthDate} onChangeText={set('birthDate')} />
        <TextField
          label="Месячный лимит расходов, ₸"
          keyboardType="number-pad"
          value={form.budgetLimit}
          onChangeText={(v) => set('budgetLimit')(v.replace(/\D/g, ''))}
        />
        <ToggleRow
          label="Push-уведомления"
          checked={settings.data?.notifications.general ?? false}
          onChange={(v) => updateSettings.mutate({ notifications: { general: v } })}
        />
        {error ? <ErrorText>{error}</ErrorText> : null}
        {saved && (
          <T center color={colors.primaryDark}>
            Изменения сохранены ✓
          </T>
        )}
        <Button title="Сохранить изменения" disabled={loading} onPress={submit} />
      </Stack>
    </Screen>
  );
}
