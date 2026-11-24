import { useEffect, useState, type FormEvent } from 'react';
import { profileApi } from '@/api';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, SectionTitle, Stack, TextField, Toggle } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSettings, useUpdateSettings } from '@/hooks/queries';
import { useSubmit } from '@/hooks/useSubmit';
import { colors } from '@/theme';
import { ProfileHead, ToggleRow } from './common';

/** 9.5. Редактирование профиля */
export function EditProfile() {
  const { user, setUser } = useAuth();
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const { loading, error, run } = useSubmit();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', birthDate: '', budgetLimit: '' });

  useEffect(() => {
    if (user)
      setForm({
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        birthDate: user.birthDate,
        budgetLimit: String(user.budgetLimit),
      });
  }, [user]);

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await run(async () => {
      const updated = await profileApi.update({ ...form, budgetLimit: Number(form.budgetLimit) });
      setUser(updated);
    });
    setSaved(ok);
  };

  return (
    <Screen back="/profile" title="Редактировать профиль" top={<div style={{ height: 60 }} />}>
      <ProfileHead user={user} />
      <form onSubmit={submit}>
        <Stack $gap={16}>
          <SectionTitle style={{ fontSize: 18 }}>Настройки аккаунта</SectionTitle>
          <TextField label="Имя и фамилия" value={form.fullName} onChange={set('fullName')} required />
          <TextField label="Телефон" type="tel" value={form.phone} onChange={set('phone')} required />
          <TextField label="E-mail" type="email" value={form.email} onChange={set('email')} required />
          <TextField label="Дата рождения" type="date" value={form.birthDate} onChange={set('birthDate')} />
          <TextField
            label="Месячный лимит расходов, ₸"
            inputMode="numeric"
            value={form.budgetLimit}
            onChange={(e) => set('budgetLimit')({ target: { value: e.target.value.replace(/\D/g, '') } })}
          />
          <ToggleRow>
            Push-уведомления
            <Toggle
              label="Push-уведомления"
              checked={settings.data?.notifications.general ?? false}
              onChange={(v) => updateSettings.mutate({ notifications: { general: v } })}
            />
          </ToggleRow>
          {error && <ErrorText>{error}</ErrorText>}
          {saved && <p style={{ textAlign: 'center', color: colors.primaryDark }}>Изменения сохранены ✓</p>}
          <Stack $center>
            <Button type="submit" disabled={loading}>
              Сохранить изменения
            </Button>
          </Stack>
        </Stack>
      </form>
    </Screen>
  );
}
