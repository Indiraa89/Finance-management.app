import { useState } from 'react';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, PasswordField, Stack, TextField, TextLink } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSubmit } from '@/hooks/useSubmit';
import { useNav } from '@/navigation/types';
import { ymd } from '@/utils/format';

/** 3.0-A. Создание аккаунта */
export function SignUp() {
  const { register } = useAuth();
  const navigation = useNav();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: ymd(new Date(2004, 0, 1)),
    password: '',
    confirm: '',
  });
  const { loading, error, setError, run } = useSubmit();
  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const submit = () => {
    if (form.password !== form.confirm) return setError('Пароли не совпадают');
    const { confirm: _c, ...body } = form;
    void run(() => register(body));
  };

  return (
    <Screen title="Создать аккаунт" bell={false} back sheetStyle={{ paddingTop: 40, paddingHorizontal: 32 }}>
      <Stack gap={14}>
        <TextField label="Имя и фамилия" placeholder="Индира Сапарова" value={form.fullName} onChangeText={set('fullName')} />
        <TextField
          label="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="example@example.com"
          value={form.email}
          onChangeText={set('email')}
        />
        <TextField label="Телефон" keyboardType="phone-pad" placeholder="+7 700 000 00 00" value={form.phone} onChangeText={set('phone')} />
        <TextField label="Дата рождения (ГГГГ-ММ-ДД)" placeholder="2004-01-01" value={form.birthDate} onChangeText={set('birthDate')} />
        <PasswordField label="Пароль" value={form.password} onChangeText={set('password')} />
        <PasswordField label="Повторите пароль" value={form.confirm} onChangeText={set('confirm')} />
        <Hint center>Продолжая, вы соглашаетесь с Условиями использования и Политикой конфиденциальности.</Hint>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Stack gap={10} center>
          <Button title={loading ? 'Создаём…' : 'Зарегистрироваться'} disabled={loading} onPress={submit} />
          <TextLink title="Уже есть аккаунт? Войти" onPress={() => navigation.navigate('Login')} />
        </Stack>
      </Stack>
    </Screen>
  );
}
