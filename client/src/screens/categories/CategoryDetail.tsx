import { useMemo } from 'react';
import { View } from 'react-native';
import { BalanceSummary } from '@/components/BalanceSummary';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Button, Empty, Loadable, SectionTitle } from '@/components/ui';
import { useCategories, useSummary, useTransactions } from '@/hooks/queries';
import { useNav, useParams } from '@/navigation/types';
import { groupByMonth } from '@/utils/format';

/** 9.4.x. Экран категории (Еда, Транспорт, …) со списком операций */
export function CategoryDetail() {
  const { id } = useParams<'CategoryDetail'>();
  const navigation = useNav();
  const summary = useSummary();
  const categories = useCategories();
  const query = useMemo(() => ({ categoryId: id }), [id]);
  const transactions = useTransactions(query);
  const category = categories.data?.find((c) => c.id === id);
  const income = category?.type === 'income';

  return (
    <Screen
      tab="Categories"
      back
      title={category?.name ?? 'Категория'}
      top={<BalanceSummary summary={summary.data} />}
      floating={
        <Button
          title={income ? 'Добавить доход' : 'Добавить расход'}
          small
          onPress={() => navigation.navigate('AddTransaction', { categoryId: id, type: category?.type ?? 'expense' })}
        />
      }
    >
      <Loadable query={transactions}>
        {(items) =>
          items.length === 0 ? (
            <Empty>В этой категории пока нет операций</Empty>
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
