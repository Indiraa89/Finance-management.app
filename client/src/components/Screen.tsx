import { ArrowLeft, Bell } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications } from '@/hooks/queries';
import { useNav, type TabName } from '@/navigation/types';
import { colors, radius } from '@/theme';
import { BottomNav, NAV_HEIGHT } from './BottomNav';
import { T } from './ui';

interface ScreenProps {
  /** Заголовок в зелёной шапке */
  title?: string;
  /** Кнопка «назад» */
  back?: boolean;
  /** Колокольчик уведомлений справа */
  bell?: boolean;
  /** Своё содержимое шапки вместо заголовка (например, приветствие на Главной) */
  header?: ReactNode;
  /** Содержимое зелёной зоны под заголовком (баланс и т.д.) */
  top?: ReactNode;
  /** Нижнее меню: какая вкладка подсвечена (null — меню есть, но ничего не выбрано) */
  tab?: TabName | null;
  /** Кнопка, которая «висит» над нижним меню (плюс, «Добавить расход»…) */
  floating?: ReactNode;
  /** Отступы внутри светлой «шторки» */
  sheetStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * Каркас почти всех экранов из макета:
 * зелёная шапка → светлая «шторка» со скруглёнными углами → (нижнее меню).
 */
export function Screen({ title, back, bell = true, header, top, tab, floating, sheetStyle, children }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const hasNav = tab !== undefined;
  const bottomSpace = hasNav ? NAV_HEIGHT + insets.bottom + 40 : insets.bottom + 40;

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={s.root}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[s.top, { paddingTop: insets.top + 20 }]}>
          {header ?? (
            <View style={s.headerRow}>
              {back ? <BackButton /> : <View style={s.side} />}
              <T size={20} weight="semibold" center style={{ flex: 1 }} numberOfLines={1}>
                {title}
              </T>
              {bell ? <BellButton /> : <View style={s.side} />}
            </View>
          )}
          {top}
        </View>
        <View style={[s.sheet, { paddingBottom: bottomSpace + (floating ? 60 : 0) }, sheetStyle]}>{children}</View>
      </ScrollView>
      {floating && <View style={[s.floating, { bottom: (hasNav ? NAV_HEIGHT : 0) + insets.bottom + 16 }]} pointerEvents="box-none">{floating}</View>}
      {hasNav && <BottomNav active={tab ?? null} />}
    </KeyboardAvoidingView>
  );
}

function BackButton() {
  const navigation = useNav();
  return (
    <Pressable
      accessibilityLabel="Назад"
      hitSlop={12}
      style={s.side}
      onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.reset({ index: 0, routes: [{ name: 'Home' }] }))}
    >
      <ArrowLeft size={24} strokeWidth={2.4} color={colors.white} />
    </Pressable>
  );
}

export function BellButton() {
  const navigation = useNav();
  const { data } = useNotifications();
  const unread = data?.some((n) => !n.read) ?? false;
  return (
    <Pressable accessibilityLabel="Уведомления" style={s.bell} onPress={() => navigation.navigate('Notifications')}>
      <Bell size={17} strokeWidth={2.2} color={colors.dark} />
      {unread && <View style={s.dot} />}
    </Pressable>
  );
}

/** Полностью зелёный (или любой) экран по центру: сплэш, «Пароль изменён» */
export function FullScreen({ children, bg = colors.primary }: { children: ReactNode; bg?: string }) {
  return <View style={[s.full, { backgroundColor: bg }]}>{children}</View>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  top: { backgroundColor: colors.primary, paddingHorizontal: 28, paddingBottom: 28 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 32 },
  side: { width: 32, height: 32, justifyContent: 'center' },
  bell: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { position: 'absolute', top: 6, right: 7, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.oceanBlue },
  sheet: {
    flexGrow: 1,
    backgroundColor: colors.honeydew,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: 36,
    paddingHorizontal: 24,
  },
  floating: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 21 },
  full: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40 },
});
