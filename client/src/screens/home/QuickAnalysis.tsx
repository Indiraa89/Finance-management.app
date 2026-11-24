import { BarChart, ChartCard } from '@/components/charts';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Loadable, Stack } from '@/components/ui';
import { useCategories, useQuickAnalysis, useTransactions } from '@/hooks/queries';
import { useNav } from '@/navigation/types';
import { SavingsCard } from './SavingsCard';

/** 7-A. Быстрый анализ */
export function QuickAnalysis() {
  const navigation = useNav();
  const quick = useQuickAnalysis();
  const categories = useCategories();
  const transactions = useTransactions({ limit: 4 });
  const q = quick.data;

  return (
    <Screen
      tab={null}
      back
      title="Быстрый анализ"
      top={
        q && (
          <SavingsCard
            flat
            onPress={() => navigation.navigate('Savings')}
            progress={q.savingsProgress}
            goalName={q.savingsGoalName}
            revenueLastWeek={q.revenueLastWeek}
            foodLastWeek={q.foodLastWeek}
          />
        )
      }
    >
      <Stack gap={26}>
        <Loadable query={quick}>
          {(data) => (
            <ChartCard title={data.title}>
              <BarChart points={data.points} />
            </ChartCard>
          )}
        </Loadable>
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
