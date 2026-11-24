import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, PasswordField, Stack, TextField, TextLink } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSubmit } from '@/hooks/useSubmit';
import { colors } from '@/theme';

/** 3.0-A. Вход */
export function Login() {
  const { login, canUseFingerprint } = useAuth();
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/home';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, run } = useSubmit();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await run(() => login({ email, password }));
    if (ok) navigate(from, { replace: true });
  };

  return (
    <Screen title="Добро пожаловать" bell={false} sheetPadding="56px 36px 40px">
      <form onSubmit={submit}>
        <Stack $gap={22}>
          <TextField
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordField
            label="Пароль"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorText>{error}</ErrorText>}
          <Stack $gap={12} $center style={{ marginTop: 18 }}>
            <Button type="submit" disabled={loading}>
              {loading ? 'Входим…' : 'Войти'}
            </Button>
            <TextLink type="button" onClick={() => navigate('/forgot')}>
              Забыли пароль?
            </TextLink>
            <Button type="button" $variant="secondary" onClick={() => navigate('/signup')}>
              Регистрация
            </Button>
            {canUseFingerprint() && (
              <Small>
                Войти по <Link to="/fingerprint">отпечатку пальца</Link>
              </Small>
            )}
          </Stack>
          <Demo>
            Демо-аккаунт: <b>demo@finwise.kz</b> / <b>Demo1234</b>{' '}
            <TextLink
              type="button"
              onClick={() => {
                setEmail('demo@finwise.kz');
                setPassword('Demo1234');
              }}
            >
              подставить
            </TextLink>
          </Demo>
        </Stack>
      </form>
    </Screen>
  );
}

export const Small = styled.p`
  font-size: 13px;
  color: ${colors.dark};

  a {
    color: ${colors.oceanBlue};
    font-weight: 500;
  }
`;

const Demo = styled(Hint)`
  text-align: center;
  background: ${colors.lightGreen};
  border-radius: 14px;
  padding: 10px 12px;
  color: ${colors.dark};

  button {
    color: ${colors.oceanBlue};
    font-size: 12px;
  }
`;
