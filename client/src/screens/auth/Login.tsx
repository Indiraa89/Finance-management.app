import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, PasswordField, Stack, T, TextField, TextLink } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSubmit } from '@/hooks/useSubmit';
import { useNav } from '@/navigation/types';
import { colors } from '@/theme';

/** 3.0-A. Вход */
export function Login() {
  const { login, fingerprintAvailable } = useAuth();
  const navigation = useNav();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, error, run } = useSubmit();

  // После успешного входа навигатор сам переключится на экраны приложения
  const submit = () => run(() => login({ email, password }));

  return (
    <Screen title="Добро пожаловать" bell={false} sheetStyle={{ paddingTop: 56, paddingHorizontal: 32 }}>
      <Stack gap={22}>
        <TextField
          label="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="example@example.com"
          value={email}
          onChangeText={setEmail}
        />
        <PasswordField label="Пароль" autoComplete="password" value={password} onChangeText={setPassword} onSubmitEditing={submit} />
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Stack gap={12} center style={{ marginTop: 18 }}>
          <Button title={loading ? 'Входим…' : 'Войти'} disabled={loading || !email || !password} onPress={submit} />
          <TextLink title="Забыли пароль?" onPress={() => navigation.navigate('Forgot')} />
          <Button title="Регистрация" variant="secondary" onPress={() => navigation.navigate('SignUp')} />
          {fingerprintAvailable && (
            <TextLink title="Войти по отпечатку пальца" color={colors.oceanBlue} onPress={() => navigation.navigate('FingerprintLogin')} />
          )}
        </Stack>
        <View style={{ backgroundColor: colors.lightGreen, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4 }}>
          <T size={12} center>
            Демо-аккаунт: <T size={12} weight="bold">demo@finwise.kz</T> / <T size={12} weight="bold">Demo1234</T>
          </T>
          <Pressable
            onPress={() => {
              setEmail('demo@finwise.kz');
              setPassword('Demo1234');
            }}
          >
            <T size={12} weight="semibold" color={colors.oceanBlue}>
              подставить
            </T>
          </Pressable>
        </View>
      </Stack>
    </Screen>
  );
}
