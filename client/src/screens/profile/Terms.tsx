import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Screen } from '@/components/Screen';
import { Button, SectionTitle, Stack } from '@/components/ui';
import { colors } from '@/theme';

const sections = [
  'FinWise — учебное приложение для учёта личных финансов. Оно помогает записывать доходы и расходы, следить за лимитом и копить на цели.',
  'Вы сами отвечаете за правильность введённых данных. Приложение не связано с банками и не проводит реальных платежей.',
  'Пароль и PIN-код хранятся на сервере только в зашифрованном виде (хеш bcrypt). Мы не передаём ваши данные третьим лицам.',
  'Вы можете в любой момент изменить данные профиля или удалить аккаунт вместе со всеми операциями в разделе «Настройки».',
  'Используя приложение, вы соглашаетесь с этими условиями. Условия могут обновляться — об изменениях мы сообщим в уведомлениях.',
];

/** 9.5. Условия использования */
export function Terms() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  return (
    <Screen nav back="/profile/security" title="Условия использования">
      <Stack $gap={18}>
        <SectionTitle style={{ fontSize: 17 }}>Пожалуйста, прочитайте условия</SectionTitle>
        <List>
          {sections.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </List>
        <Check>
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />Я принимаю
          условия использования
        </Check>
        <Stack $center>
          <Button disabled={!accepted} onClick={() => navigate('/profile/security')}>
            Принять
          </Button>
        </Stack>
      </Stack>
    </Screen>
  );
}

const List = styled.ol`
  margin: 0;
  padding: 18px 18px 18px 36px;
  background: ${colors.lightGreen};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
  line-height: 1.5;
`;

const Check = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    accent-color: ${colors.primary};
  }
`;
