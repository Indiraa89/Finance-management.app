import { ArrowLeftRight, ChartNoAxesColumn, House, Layers, UserRound } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNav, type TabName } from '@/navigation/types';
import { colors } from '@/theme';

export const NAV_HEIGHT = 90;

const items: { tab: TabName; label: string; Icon: typeof House }[] = [
  { tab: 'Home', label: 'Главная', Icon: House },
  { tab: 'Analysis', label: 'Анализ', Icon: ChartNoAxesColumn },
  { tab: 'Transactions', label: 'Транзакции', Icon: ArrowLeftRight },
  { tab: 'Categories', label: 'Категории', Icon: Layers },
  { tab: 'Profile', label: 'Профиль', Icon: UserRound },
];

/** Нижнее меню из 5 вкладок (раздел 9 макета) */
export function BottomNav({ active }: { active: TabName | null }) {
  const navigation = useNav();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.nav, { height: NAV_HEIGHT + insets.bottom, paddingBottom: insets.bottom + 6 }]} accessibilityRole="tablist">
      {items.map(({ tab, label, Icon }) => {
        const isActive = tab === active;
        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: isActive }}
            style={[s.item, isActive && { backgroundColor: colors.primary }]}
            // Вкладка — это «корень»: сбрасываем историю и открываем экран вкладки
            onPress={() => !isActive && navigation.reset({ index: 0, routes: [{ name: tab }] })}
          >
            <Icon size={24} strokeWidth={1.8} color={colors.dark} />
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  nav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    paddingHorizontal: 30,
    backgroundColor: colors.lightGreen,
    borderTopLeftRadius: 56,
    borderTopRightRadius: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: colors.dark,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  item: { width: 56, height: 52, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
