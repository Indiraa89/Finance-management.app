import { useState } from 'react';
import { authApi } from '@/api';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, SectionTitle, Stack, TextField } from '@/components/ui';
import { useSubmit } from '@/hooks/useSubmit';
import { useNav } from '@/navigation/types';

/** 3.1-A. Забыли пароль: вводим e-mail и получаем 6-значный код */
export function ForgotPassword() {
  const navigation = useNav();
  const [email, setEmail] = useState('');
  const { loading, error, run } = useSubmit();

  const submit = () =>
    run(async () => {
      const res = await authApi.forgotPassword(email);
      navigation.navigate('SecurityCode', { email, demoCode: res.demoCode });
    });

  return (
    <Screen title="Забыли пароль" bell={false} back sheetStyle={{ paddingTop: 56, paddingHorizontal: 32 }}>
      <Stack gap={20}>
        <Stack gap={8}>
          <SectionTitle size={20}>Сбросить пароль?</SectionTitle>
          <Hint>Укажите e-mail, который вы использовали при регистрации. Мы отправим 6-значный код для сброса пароля.</Hint>
        </Stack>
        <TextField
          label="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="example@example.com"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={submit}
        />
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Stack center gap={60} style={{ marginTop: 20 }}>
          <Button title={loading ? 'Отправляем…' : 'Далее'} small disabled={loading || !email} onPress={submit} />
          <Button title="Регистрация" small variant="secondary" onPress={() => navigation.navigate('SignUp')} />
        </Stack>
      </Stack>
    </Screen>
  );
}
