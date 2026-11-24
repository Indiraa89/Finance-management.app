import type { TransactionType } from '@finwise/shared';
import { ArrowDownToLine, ArrowUpFromLine, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Empty, Loadable, SectionTitle, T } from '@/components/ui';
import { useCategories, useSummary, useTransactions } from '@/hooks/queries';
import { useNav, useParams } from '@/navigation/types';
import { colors } from '@/theme';
import { groupByMonth, money } from '@/utils/format';
import { MiniCard } from '../home/AccountBalance';

/** 9.3.0–9.3.2. Транзакции: все / только доходы / только расходы */
export function Transactions() {
  const navigation = useNav();
  const params = useParams<'Transactions'>();
  const [type, setType] = useState<TransactionType | undefined>(params?.type);
  const summary = useSummary();
  const categories = useCategories();
  const query = useMemo(() => ({ type }), [type]);
  const transactions = useTransactions(query);

  const toggle = (t: TransactionType) => setType(type === t ? undefined : t);

  return (
    <Screen
      tab="Transactions"
      back
      title="Транзакции"
      floating={
        <Pressable
          style={s.fab}
          accessibilityLabel="Добавить операцию"
          onPress={() => navigation.navigate('AddTransaction', type ? { type } : undefined)}
        >
          <Plus size={28} color={colors.dark} />
        </Pressable>
      }
      top={
        <>
          <View style={s.balance}>
            <T size={14}>Общий баланс</T>
            <T size={24} weight="bold">
              {money(summary.data?.totalBalance ?? 0)}
            </T>
          </View>
          <View style={{ flexDirection: 'row', gap: 14, marginTop: 14 }}>
            <MiniCard
              active={type === 'income'}
              icon={<ArrowUpFromLine size={22} color={type === 'income' ? colors.white : colors.dark} />}
              label="Доходы"
              value={money(summary.data?.totalIncome ?? 0)}
              onPress={() => toggle('income')}
            />
            <MiniCard
              active={type === 'expense'}
              icon={<ArrowDownToLine size={22} color={type === 'expense' ? colors.white : colors.dark} />}
              label="Расходы"
              value={money(summary.data?.totalExpense ?? 0)}
              onPress={() => toggle('expense')}
            />
          </View>
        </>
      }
    >
      <Loadable query={transactions}>
        {(items) =>
          items.length === 0 ? (
            <Empty>Операций пока нет — добавьте первую!</Empty>
          ) : (
            <View style={{ gap: 26 }}>
              {groupByMonth(items).map((g) => (
                <View key={g.key} style={{ gap: 16 }}>
                  <SectionTitle size={16}>{g.title}</SectionTitle>
                  <TransactionList
                    items={g.items}
                    categories={categories.data}
                    onSelect={(tx) => navigation.navigate('TransactionDetails', { id: tx.id })}
                  />
                </View>
              ))}
            </View>
          )
        }
      </Loadable>
    </Screen>
  );
}

const s = StyleSheet.create({
  balance: { marginTop: 22, backgroundColor: colors.honeydew, borderRadius: 15, padding: 10, alignItems: 'center' },
  fab: {
    alignSelf: 'flex-end',
    marginRight: 26,
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
});
