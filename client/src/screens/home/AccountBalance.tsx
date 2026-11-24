import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BalanceSummary } from '@/components/BalanceSummary';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Loadable, Row, SectionTitle, Stack, T, TextLink } from '@/components/ui';
import { useCategories, useSummary, useTransactions } from '@/hooks/queries';
import { useNav } from '@/navigation/types';
import { colors } from '@/theme';
import { money } from '@/utils/format';

/** 6-A. Баланс счёта */
export function AccountBalance() {
  const navigation = useNav();
  const summary = useSummary();
  const categories = useCategories();
  const transactions = useTransactions({ limit: 6 });

  return (
    <Screen
      tab={null}
      back
      title="Баланс счёта"
      top={
        <>
          <BalanceSummary summary={summary.data} />
          <View style={{ flexDirection: 'row', gap: 14, marginTop: 18 }}>
            <MiniCard
              icon={<ArrowUpFromLine size={22} color={colors.primary} />}
              label="Доход за месяц"
              value={money(summary.data?.monthIncome ?? 0)}
              onPress={() => navigation.navigate('Transactions', { type: 'income' })}
            />
            <MiniCard
              icon={<ArrowDownToLine size={22} color={colors.oceanBlue} />}
              label="Расход за месяц"
              value={money(summary.data?.monthExpense ?? 0)}
              valueColor={colors.oceanBlue}
              onPress={() => navigation.navigate('Transactions', { type: 'expense' })}
            />
          </View>
        </>
      }
    >
      <Stack gap={20}>
        <Row between>
          <SectionTitle size={17}>Транзакции</SectionTitle>
          <TextLink title="Смотреть все" onPress={() => navigation.navigate('Transactions')} />
        </Row>
        <Loadable query={transactions}>
          {(items) => (
            <TransactionList
              items={items}
              categories={categories.data}
              onSelect={(tx) => navigation.navigate('TransactionDetails', { id: tx.id })}
            />
          )}
        </Loadable>
      </Stack>
    </Screen>
  );
}

export function MiniCard({
  icon,
  label,
  value,
  valueColor = colors.dark,
  onPress,
  active,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueColor?: string;
  onPress?: () => void;
  active?: boolean;
}) {
  return (
    <Pressable style={[s.mini, active && { backgroundColor: colors.oceanBlue }]} onPress={onPress} accessibilityRole="button">
      {icon}
      <T size={13} color={active ? colors.white : colors.dark}>
        {label}
      </T>
      <T size={15} weight="bold" color={active ? colors.white : valueColor} numberOfLines={1}>
        {value}
      </T>
    </Pressable>
  );
}

const s = StyleSheet.create({
  mini: { flex: 1, backgroundColor: colors.honeydew, borderRadius: 15, padding: 12, alignItems: 'center', gap: 2 },
});
