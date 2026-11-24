import { PiggyBank } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Ring } from '@/components/charts';
import { T } from '@/components/ui';
import { colors } from '@/theme';
import { money } from '@/utils/format';

interface Props {
  progress: number;
  goalName: string;
  revenueLastWeek: number;
  foodLastWeek: number;
  onPress?: () => void;
  /** Без своей подложки (для зелёной шапки «Быстрого анализа») */
  flat?: boolean;
}

/** Зелёная карточка: прогресс накоплений + доход и еда за неделю */
export function SavingsCard({ progress, goalName, revenueLastWeek, foodLastWeek, onPress, flat }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[s.card, flat ? { backgroundColor: 'transparent', paddingHorizontal: 0, paddingBottom: 0 } : null]}
    >
      <View style={s.left}>
        <Ring percent={progress} size={74} stroke={4}>
          <PiggyBank size={30} color={colors.dark} strokeWidth={1.6} />
        </Ring>
        <T size={11} weight="medium" center>
          {`Накопления\n${goalName} · ${progress}%`}
        </T>
      </View>
      <View style={s.divider} />
      <View style={{ flex: 1, gap: 8 }}>
        <View style={s.line}>
          <CategoryIcon icon="salary" size={36} bg="transparent" color={colors.dark} />
          <View style={{ flex: 1 }}>
            <T size={12}>Доход за неделю</T>
            <T size={15} weight="bold" numberOfLines={1}>
              {money(revenueLastWeek)}
            </T>
          </View>
        </View>
        <View style={s.hline} />
        <View style={s.line}>
          <CategoryIcon icon="food" size={36} bg="transparent" color={colors.dark} />
          <View style={{ flex: 1 }}>
            <T size={12}>Еда за неделю</T>
            <T size={15} weight="bold" color={colors.oceanBlue} numberOfLines={1}>
              {money(foodLastWeek, { negative: foodLastWeek > 0 })}
            </T>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.primary,
    borderRadius: 31,
    paddingVertical: 20,
    paddingHorizontal: 22,
    marginTop: 0,
  },
  left: { width: 92, alignItems: 'center', gap: 6 },
  divider: { width: 2, alignSelf: 'stretch', backgroundColor: colors.honeydew, borderRadius: 1 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hline: { height: 2, backgroundColor: colors.honeydew, borderRadius: 1 },
});
