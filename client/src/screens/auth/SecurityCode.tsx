import { useState } from 'react';
import { authApi } from '@/api';
import { PinInput } from '@/components/PinInput';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, SectionTitle, Stack, T } from '@/components/ui';
import { useSubmit } from '@/hooks/useSubmit';
import { useNav, useParams } from '@/navigation/types';

/** 3.2-A. Ввод 6-значного кода безопасности */
export function SecurityCode() {
  const navigation = useNav();
  const { email, demoCode: firstCode } = useParams<'SecurityCode'>();
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState(firstCode);
  const { loading, error, run } = useSubmit();

  const accept = () =>
    run(async () => {
      const { resetToken } = await authApi.verifyCode(email, code);
      navigation.replace('NewPassword', { resetToken });
    });

  const resend = () =>
    run(async () => {
      const res = await authApi.forgotPassword(email);
      setDemoCode(res.demoCode);
      setCode('');
    });

  return (
    <Screen title="Код безопасности" bell={false} back sheetStyle={{ paddingTop: 56 }}>
      <Stack gap={30} center>
        <SectionTitle size={18}>Введите код безопасности</SectionTitle>
        <PinInput value={code} onChange={setCode} />
        <Hint center>
          Учебный режим: письмо не отправляется, ваш код — <T size={12} weight="bold">{demoCode}</T>
        </Hint>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Stack gap={12} center>
          <Button title="Подтвердить" small disabled={loading || code.length !== 6} onPress={accept} />
          <Button title="Отправить снова" small variant="secondary" disabled={loading} onPress={resend} />
        </Stack>
      </Stack>
    </Screen>
  );
}
