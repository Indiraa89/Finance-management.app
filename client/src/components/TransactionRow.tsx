import type { Category, Transaction } from '@finwise/shared';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { money, timeAndDate } from '@/utils/format';
import { CategoryIcon } from './CategoryIcon';
import { T, VDivider } from './ui';

/** Строка транзакции: иконка · название и время · категория · сумма */
export function TransactionRow({ tx, category, onPress }: { tx: Transaction; category?: Category; onPress?: () => void }) {
  const expense = tx.type === 'expense';
  return (
    <Pressable style={s.item} onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined}>
      <CategoryIcon icon={category?.icon ?? 'other'} />
      <View style={{ flex: 1.4, minWidth: 0 }}>
        <T size={15} weight="medium" numberOfLines={1}>
          {tx.title}
        </T>
        <T size={11} weight="semibold" color={colors.oceanBlue} numberOfLines={1}>
          {timeAndDate(tx.date)}
        </T>
      </View>
      <VDivider />
      <T size={11} weight="light" center numberOfLines={1} style={{ flex: 0.9 }}>
        {category?.name ?? '—'}
      </T>
      <VDivider />
      <T size={13} weight="medium" numberOfLines={1} color={expense ? colors.oceanBlue : colors.dark} style={{ flex: 1.1, textAlign: 'right' }}>
        {money(tx.amount, { negative: expense })}
      </T>
    </Pressable>
  );
}

export function TransactionList({
  items,
  categories,
  onSelect,
}: {
  items: Transaction[];
  categories: Category[] | undefined;
  onSelect?: (tx: Transaction) => void;
}) {
  const byId = new Map(categories?.map((c) => [c.id, c]));
  return (
    <View style={{ gap: 18 }}>
      {items.map((tx) => (
        <TransactionRow key={tx.id} tx={tx} category={byId.get(tx.categoryId)} onPress={onSelect ? () => onSelect(tx) : undefined} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
