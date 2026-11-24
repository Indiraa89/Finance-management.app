import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { BalanceSummary } from '@/components/BalanceSummary';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Button, Empty, Loadable, SectionTitle } from '@/components/ui';
import { useCategories, useSummary, useTransactions } from '@/hooks/queries';
import { groupByMonth } from '@/utils/format';

/** 9.4.x. Экран категории (Еда, Транспорт, …) со списком операций */
export function CategoryDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const summary = useSummary();
  const categories = useCategories();
  const query = useMemo(() => ({ categoryId: id }), [id]);
  const transactions = useTransactions(query);
  const category = categories.data?.find((c) => c.id === id);

  return (
    <Screen
      nav
      back="/categories"
      title={category?.name ?? 'Категория'}
      top={<BalanceSummary summary={summary.data} />}
      sheetPadding="36px 24px 200px"
    >
      <Loadable query={transactions}>
        {(items) =>
          items.length === 0 ? (
            <Empty>В этой категории пока нет операций</Empty>
          ) : (
            groupByMonth(items).map((g) => (
              <Group key={g.key}>
                <SectionTitle style={{ fontSize: 16 }}>{g.title}</SectionTitle>
                <TransactionList
                  items={g.items}
                  categories={categories.data}
                  onSelect={(tx) => navigate(`/transactions/${tx.id}`)}
                />
              </Group>
            ))
          )
        }
      </Loadable>
      <Sticky>
        <Button
          $small
          onClick={() =>
            navigate(`/transactions/new?categoryId=${id}&type=${category?.type ?? 'expense'}`)
          }
        >
          {category?.type === 'income' ? 'Добавить доход' : 'Добавить расход'}
        </Button>
      </Sticky>
    </Screen>
  );
}

const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 26px;
`;

export const Sticky = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 112px;
  z-index: 21;
  display: flex;
  justify-content: center;
  pointer-events: none;

  button {
    pointer-events: auto;
    box-shadow: 0 8px 20px rgba(0, 208, 158, 0.35);
  }
`;
