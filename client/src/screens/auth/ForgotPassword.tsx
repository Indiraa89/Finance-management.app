import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '@/api';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, SectionTitle, Stack, TextField } from '@/components/ui';
import { useSubmit } from '@/hooks/useSubmit';

/** 3.1-A. Забыли пароль: вводим e-mail и получаем 6-значный код */
export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { loading, error, run } = useSubmit();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await run(async () => {
      const res = await authApi.forgotPassword(email);
      navigate('/forgot/code', { state: { email, demoCode: res.demoCode } });
    });
  };

  return (
    <Screen title="Забыли пароль" bell={false} back sheetPadding="56px 36px 40px">
      <form onSubmit={submit}>
        <Stack $gap={20}>
          <div>
            <SectionTitle style={{ fontSize: 20, marginBottom: 8 }}>Сбросить пароль?</SectionTitle>
            <Hint>
              Укажите e-mail, который вы использовали при регистрации. Мы отправим 6-значный код
              для сброса пароля.
            </Hint>
          </div>
          <TextField
            label="E-mail"
            type="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginTop: 20 }}
          />
          {error && <ErrorText>{error}</ErrorText>}
          <Stack $center style={{ marginTop: 20 }}>
            <Button type="submit" $small disabled={loading}>
              {loading ? 'Отправляем…' : 'Далее'}
            </Button>
            <Button type="button" $small $variant="secondary" onClick={() => navigate('/signup')} style={{ marginTop: 60 }}>
              Регистрация
            </Button>
          </Stack>
        </Stack>
      </form>
    </Screen>
  );
}
