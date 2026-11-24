import { useState } from 'react';
import { profileApi } from '@/api';
import { FullWidth, Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { Button, Card, ErrorText, Hint, PasswordField, SectionTitle, Stack, T } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSubmit } from '@/hooks/useSubmit';
import { useNav } from '@/navigation/types';

/** 9.5. Удаление аккаунта (с подтверждением паролем) */
export function DeleteAccount() {
  const navigation = useNav();
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState(false);
  const { loading, error, run } = useSubmit();

  const remove = async () => {
    const ok = await run(() => profileApi.remove(password));
    setConfirm(false);
    // После удаления выходим; навигатор сам покажет экран входа
    if (ok) await logout({ forget: true });
  };

  return (
    <Screen tab="Profile" back title="Удалить аккаунт">
      <Stack gap={20}>
        <SectionTitle size={17} style={{ textAlign: 'center' }}>
          Вы уверены, что хотите удалить аккаунт?
        </SectionTitle>
        <Card style={{ gap: 6 }}>
          <T size={13}>Удаление аккаунта означает:</T>
          <T size={13}>• все ваши операции, категории и цели будут удалены;</T>
          <T size={13}>• восстановить данные будет невозможно;</T>
          <T size={13}>• входить в FinWise с этим e-mail больше не получится.</T>
        </Card>
        <PasswordField label="Введите пароль для подтверждения" value={password} onChangeText={setPassword} />
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Stack gap={12} center>
          <Button title="Да, удалить аккаунт" disabled={!password} onPress={() => setConfirm(true)} />
          <Button title="Отмена" variant="secondary" onPress={() => navigation.goBack()} />
        </Stack>
      </Stack>

      <Modal open={confirm} title="Удалить аккаунт" onClose={() => setConfirm(false)}>
        <Hint center>Это действие нельзя отменить. Все данные будут удалены навсегда.</Hint>
        <FullWidth>
          <Button title="Да, удалить" variant="danger" block disabled={loading} onPress={remove} />
          <Button title="Отмена" variant="secondary" block onPress={() => setConfirm(false)} />
        </FullWidth>
      </Modal>
    </Screen>
  );
}
