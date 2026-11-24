import { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { BalanceSummary } from '@/components/BalanceSummary';
import { BellButton, Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Empty, Loadable, Segmented, Stack, T } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useCategories, useSummary, useTransactions } from '@/hooks/queries';
import { useNav } from '@/navigation/types';
import { greeting, ymd } from '@/utils/format';
import { SavingsCard } from './SavingsCard';

type Range = 'day' | 'week' | 'month';

function rangeStart(range: Range): string {
  const d = new Date();
  if (range === 'week') d.setDate(d.getDate() - 6);
  if (range === 'month') d.setDate(1);
  return ymd(d);
}

/** 4-A. Главная */
export function Home() {
  const { user } = useAuth();
  const navigation = useNav();
  const [range, setRange] = useState<Range>('month');
  const summary = useSummary();
  const categories = useCategories();
  const query = useMemo(() => ({ from: rangeStart(range) }), [range]);
  const transactions = useTransactions(query);
  const firstName = user?.fullName.split(' ')[0] ?? '';

  return (
    <Screen
      tab="Home"
      header={
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <T size={20} weight="semibold">
              Привет, {firstName}!
            </T>
            <T size={14}>{greeting()}</T>
          </View>
          <BellButton />
        </View>
      }
      top={
        <Pressable onPress={() => navigation.navigate('Balance')} accessibilityLabel="Открыть баланс счёта">
          <BalanceSummary summary={summary.data} />
        </Pressable>
      }
    >
      <Stack gap={26}>
        {summary.data && (
          <SavingsCard
            onPress={() => navigation.navigate('QuickAnalysis')}
            progress={summary.data.savingsProgress}
            goalName={summary.data.savingsGoalName}
            revenueLastWeek={summary.data.revenueLastWeek}
            foodLastWeek={summary.data.foodLastWeek}
          />
        )}
        <Segmented
          value={range}
          onChange={setRange}
          options={[
            { value: 'day', label: 'День' },
            { value: 'week', label: 'Неделя' },
            { value: 'month', label: 'Месяц' },
          ]}
        />
        <Loadable query={transactions}>
          {(items) =>
            items.length === 0 ? (
              <Empty>За этот период операций нет</Empty>
            ) : (
              <TransactionList
                items={items}
                categories={categories.data}
                onSelect={(tx) => navigation.navigate('TransactionDetails', { id: tx.id })}
              />
            )
          }
        </Loadable>
      </Stack>
    </Screen>
  );
}
