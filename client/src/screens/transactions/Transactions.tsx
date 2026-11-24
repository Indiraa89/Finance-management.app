import type { TransactionType } from '@finwise/shared';
import { ArrowDownToLine, ArrowUpFromLine, Plus } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import styled from 'styled-components';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Empty, Loadable, SectionTitle } from '@/components/ui';
import { useCategories, useSummary, useTransactions } from '@/hooks/queries';
import { colors } from '@/theme';
import { groupByMonth, money } from '@/utils/format';

/** 9.3.0–9.3.2. Транзакции: все / только доходы / только расходы */
export function Transactions() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const type = (params.get('type') as TransactionType | null) ?? undefined;
  const summary = useSummary();
  const categories = useCategories();
  const query = useMemo(() => ({ type }), [type]);
  const transactions = useTransactions(query);

  const toggle = (t: TransactionType) => setParams(type === t ? {} : { type: t }, { replace: true });

  return (
    <Screen
      nav
      back="/home"
      title="Транзакции"
      top={
        <>
          <BalanceCard>
            <span>Общий баланс</span>
            <b>{money(summary.data?.totalBalance ?? 0)}</b>
          </BalanceCard>
          <Filters>
            <Filter $active={type === 'income'} onClick={() => toggle('income')} aria-pressed={type === 'income'}>
              <ArrowUpFromLine size={22} />
              <span>Доходы</span>
              <b>{money(summary.data?.totalIncome ?? 0)}</b>
            </Filter>
            <Filter $active={type === 'expense'} onClick={() => toggle('expense')} aria-pressed={type === 'expense'}>
              <ArrowDownToLine size={22} />
              <span>Расходы</span>
              <b>{money(summary.data?.totalExpense ?? 0)}</b>
            </Filter>
          </Filters>
        </>
      }
    >
      <Loadable query={transactions}>
        {(items) =>
          items.length === 0 ? (
            <Empty>Операций пока нет — добавьте первую!</Empty>
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
      <Fab aria-label="Добавить операцию" onClick={() => navigate(`/transactions/new${type ? `?type=${type}` : ''}`)}>
        <Plus size={28} />
      </Fab>
    </Screen>
  );
}

const BalanceCard = styled.div`
  margin-top: 22px;
  background: ${colors.honeydew};
  border-radius: 15px;
  padding: 10px;
  text-align: center;

  span {
    font-size: 14px;
    display: block;
  }
  b {
    font-size: 24px;
  }
`;

const Filters = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 14px;
`;

const Filter = styled.button<{ $active: boolean }>`
  flex: 1;
  min-width: 0;
  border-radius: 15px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: background 0.2s;
  background: ${({ $active }) => ($active ? colors.oceanBlue : colors.honeydew)};
  color: ${({ $active }) => ($active ? colors.white : colors.dark)};

  span {
    font-size: 13px;
  }
  b {
    font-size: 15px;
    white-space: nowrap;
  }
`;

const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 26px;
`;

const Fab = styled.button`
  position: absolute;
  right: 26px;
  bottom: 112px;
  z-index: 21;
  width: 56px;
  height: 56px;
  border-radius: 20px;
  background: ${colors.primary};
  color: ${colors.dark};
  display: grid;
  place-items: center;
  box-shadow: 0 8px 20px rgba(0, 208, 158, 0.4);
`;
