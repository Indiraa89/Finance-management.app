import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { authApi } from '@/api';
import { PinInput } from '@/components/PinInput';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, SectionTitle, Stack } from '@/components/ui';
import { useSubmit } from '@/hooks/useSubmit';

/** 3.2-A. Ввод 6-значного кода безопасности */
export function SecurityCode() {
  const navigate = useNavigate();
  const state = useLocation().state as { email: string; demoCode: string } | null;
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState(state?.demoCode ?? '');
  const { loading, error, run } = useSubmit();

  if (!state?.email) return <Navigate to="/forgot" replace />;

  const accept = () =>
    run(async () => {
      const { resetToken } = await authApi.verifyCode(state.email, code);
      navigate('/forgot/new-password', { replace: true, state: { resetToken } });
    });

  const resend = () =>
    run(async () => {
      const res = await authApi.forgotPassword(state.email);
      setDemoCode(res.demoCode);
      setCode('');
    });

  return (
    <Screen title="Код безопасности" bell={false} back sheetPadding="56px 32px 40px">
      <Stack $gap={30} $center>
        <SectionTitle style={{ fontSize: 18 }}>Введите код безопасности</SectionTitle>
        <PinInput value={code} onChange={setCode} />
        <Hint>
          Учебный режим: письмо не отправляется, ваш код — <b>{demoCode}</b>
        </Hint>
        {error && <ErrorText>{error}</ErrorText>}
        <Stack $gap={12} $center>
          <Button $small disabled={loading || code.length !== 6} onClick={accept}>
            Подтвердить
          </Button>
          <Button $small $variant="secondary" disabled={loading} onClick={resend}>
            Отправить снова
          </Button>
        </Stack>
      </Stack>
    </Screen>
  );
}
