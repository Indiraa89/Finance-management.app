import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import { BalanceSummary } from '@/components/BalanceSummary';
import { BellButton, Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Empty, Loadable, Segmented, Stack } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useCategories, useSummary, useTransactions } from '@/hooks/queries';
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
  const navigate = useNavigate();
  const [range, setRange] = useState<Range>('month');
  const summary = useSummary();
  const categories = useCategories();
  const query = useMemo(() => ({ from: rangeStart(range) }), [range]);
  const transactions = useTransactions(query);
  const firstName = user?.fullName.split(' ')[0] ?? '';

  return (
    <Screen
      nav
      header={
        <Head>
          <div>
            <h1>Привет, {firstName}!</h1>
            <p>{greeting()}</p>
          </div>
          <BellButton />
        </Head>
      }
      top={
        <Link to="/balance" aria-label="Открыть баланс счёта">
          <BalanceSummary summary={summary.data} />
        </Link>
      }
    >
      <Stack $gap={26}>
        {summary.data && (
          <SavingsCard
            to="/quick-analysis"
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
                onSelect={(tx) => navigate(`/transactions/${tx.id}`)}
              />
            )
          }
        </Loadable>
      </Stack>
    </Screen>
  );
}

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  h1 {
    font-size: 20px;
    font-weight: 600;
  }
  p {
    font-size: 14px;
  }
`;
