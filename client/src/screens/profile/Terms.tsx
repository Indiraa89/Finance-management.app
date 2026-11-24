import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button, Card, Row, SectionTitle, Stack, T } from '@/components/ui';
import { useNav } from '@/navigation/types';
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
  const navigation = useNav();
  const [accepted, setAccepted] = useState(false);
  return (
    <Screen tab="Profile" back title="Условия использования">
      <Stack gap={18}>
        <SectionTitle size={17}>Пожалуйста, прочитайте условия</SectionTitle>
        <Card style={{ gap: 10 }}>
          {sections.map((text, i) => (
            <T key={text} size={13} style={{ lineHeight: 19 }}>
              {i + 1}. {text}
            </T>
          ))}
        </Card>
        <Pressable onPress={() => setAccepted(!accepted)} accessibilityRole="checkbox" accessibilityState={{ checked: accepted }}>
          <Row gap={10}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: colors.primary,
                backgroundColor: accepted ? colors.primary : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {accepted && <Check size={14} color={colors.white} strokeWidth={3} />}
            </View>
            <T size={13}>Я принимаю условия использования</T>
          </Row>
        </Pressable>
        <Button title="Принять" disabled={!accepted} onPress={() => navigation.goBack()} />
      </Stack>
    </Screen>
  );
}
