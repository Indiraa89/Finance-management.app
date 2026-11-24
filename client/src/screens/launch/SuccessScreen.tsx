import { StackActions } from '@react-navigation/native';
import { useEffect } from 'react';
import { Pressable } from 'react-native';
import { SuccessRing } from '@/components/illustrations';
import { FullScreen } from '@/components/Screen';
import { T } from '@/components/ui';
import { useNav, useParams } from '@/navigation/types';

/**
 * 3.2-C и похожие экраны: «Пароль успешно изменён», «PIN изменён» и т.д.
 * Через 2 секунды переходит дальше.
 */
export function SuccessScreen() {
  const navigation = useNav();
  const { message, next } = useParams<'Success'>();

  const go = () => navigation.dispatch(StackActions.replace(next));

  useEffect(() => {
    const id = setTimeout(go, 2000);
    return () => clearTimeout(id);
  }, []); // один раз при открытии экрана

  return (
    <Pressable style={{ flex: 1 }} onPress={go}>
      <FullScreen>
        <SuccessRing />
        <T size={22} weight="semibold" center style={{ maxWidth: 260, lineHeight: 30 }}>
          {message}
        </T>
      </FullScreen>
    </Pressable>
  );
}
