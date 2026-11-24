import type { ReactNode } from 'react';
import { Modal as RNModal, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { T } from './ui';

/** Всплывающее окно поверх экрана (выход, удаление, новая категория…) */
export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <RNModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        {/* Нажатие по самой карточке не закрывает окно */}
        <Pressable style={s.card} onPress={() => undefined}>
          <T size={20} weight="semibold" center>
            {title}
          </T>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.honeydew,
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 26,
    gap: 16,
    alignItems: 'center',
  },
});

/** Полоса на всю ширину внутри модального окна */
export const FullWidth = ({ children }: { children: ReactNode }) => <View style={{ alignSelf: 'stretch', gap: 12 }}>{children}</View>;
