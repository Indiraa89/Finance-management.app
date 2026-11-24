import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, PasswordField, Stack, TextField } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSubmit } from '@/hooks/useSubmit';
import { Small } from './Login';

/** 3.0-A. Создание аккаунта */
export function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
    confirm: '',
  });
  const { loading, error, setError, run } = useSubmit();

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Пароли не совпадают');
    const { confirm: _c, ...body } = form;
    const ok = await run(() => register(body));
    if (ok) navigate('/home', { replace: true });
  };

  return (
    <Screen title="Создать аккаунт" bell={false} back="/welcome" sheetPadding="40px 36px 40px">
      <form onSubmit={submit}>
        <Stack $gap={14}>
          <TextField label="Имя и фамилия" placeholder="Индира Сапарова" value={form.fullName} onChange={set('fullName')} required />
          <TextField label="E-mail" type="email" placeholder="example@example.com" value={form.email} onChange={set('email')} required />
          <TextField label="Телефон" type="tel" placeholder="+7 700 000 00 00" value={form.phone} onChange={set('phone')} required />
          <TextField label="Дата рождения" type="date" value={form.birthDate} onChange={set('birthDate')} required />
          <PasswordField label="Пароль" autoComplete="new-password" value={form.password} onChange={set('password')} required />
          <PasswordField label="Повторите пароль" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} required />
          <Hint style={{ textAlign: 'center' }}>
            Продолжая, вы соглашаетесь с <b>Условиями использования</b> и <b>Политикой конфиденциальности</b>.
          </Hint>
          {error && <ErrorText>{error}</ErrorText>}
          <Stack $gap={10} $center>
            <Button type="submit" disabled={loading}>
              {loading ? 'Создаём…' : 'Зарегистрироваться'}
            </Button>
            <Small>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </Small>
          </Stack>
        </Stack>
      </form>
    </Screen>
  );
}
