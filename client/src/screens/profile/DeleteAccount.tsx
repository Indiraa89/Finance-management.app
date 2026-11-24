import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { profileApi } from '@/api';
import { Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, PasswordField, SectionTitle, Stack } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useSubmit } from '@/hooks/useSubmit';
import { colors } from '@/theme';

/** 9.5. Удаление аккаунта (с подтверждением паролем) */
export function DeleteAccount() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState(false);
  const { loading, error, run } = useSubmit();

  const remove = async () => {
    const ok = await run(() => profileApi.remove(password));
    if (ok) {
      logout();
      navigate('/welcome', { replace: true });
    } else setConfirm(false);
  };

  return (
    <Screen nav back="/profile/settings" title="Удалить аккаунт">
      <Stack $gap={20}>
        <SectionTitle style={{ fontSize: 17, textAlign: 'center' }}>
          Вы уверены, что хотите удалить аккаунт?
        </SectionTitle>
        <Box>
          <p>Удаление аккаунта означает:</p>
          <ul>
            <li>все ваши операции, категории и цели будут удалены;</li>
            <li>восстановить данные будет невозможно;</li>
            <li>входить в FinWise с этим e-mail больше не получится.</li>
          </ul>
        </Box>
        <PasswordField label="Введите пароль для подтверждения" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <ErrorText>{error}</ErrorText>}
        <Stack $gap={12} $center>
          <Button $variant="primary" disabled={!password} onClick={() => setConfirm(true)}>
            Да, удалить аккаунт
          </Button>
          <Button $variant="secondary" onClick={() => navigate(-1)}>
            Отмена
          </Button>
        </Stack>
      </Stack>

      <Modal open={confirm} title="Удалить аккаунт" onClose={() => setConfirm(false)}>
        <Hint>Это действие нельзя отменить. Все данные будут удалены навсегда.</Hint>
        <Button $variant="danger" disabled={loading} onClick={remove}>
          Да, удалить
        </Button>
        <Button $variant="secondary" onClick={() => setConfirm(false)}>
          Отмена
        </Button>
      </Modal>
    </Screen>
  );
}

const Box = styled.div`
  background: ${colors.lightGreen};
  border-radius: 20px;
  padding: 18px 20px;
  font-size: 13px;
  line-height: 1.5;

  ul {
    margin: 8px 0 0;
    padding-left: 18px;
  }
`;
