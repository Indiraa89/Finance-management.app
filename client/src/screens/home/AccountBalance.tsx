import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import { BalanceSummary } from '@/components/BalanceSummary';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Loadable, Row, SectionTitle, Stack } from '@/components/ui';
import { useCategories, useSummary, useTransactions } from '@/hooks/queries';
import { colors } from '@/theme';
import { money } from '@/utils/format';

/** 6-A. Баланс счёта */
export function AccountBalance() {
  const navigate = useNavigate();
  const summary = useSummary();
  const categories = useCategories();
  const transactions = useTransactions({ limit: 6 });

  return (
    <Screen
      nav
      back
      title="Баланс счёта"
      top={
        <>
          <BalanceSummary summary={summary.data} />
          <Cards>
            <MiniCard to="/transactions?type=income">
              <ArrowUpFromLine size={22} color={colors.primary} />
              <span>Доход за месяц</span>
              <b>{money(summary.data?.monthIncome ?? 0)}</b>
            </MiniCard>
            <MiniCard to="/transactions?type=expense">
              <ArrowDownToLine size={22} color={colors.oceanBlue} />
              <span>Расход за месяц</span>
              <b style={{ color: colors.oceanBlue }}>{money(summary.data?.monthExpense ?? 0)}</b>
            </MiniCard>
          </Cards>
        </>
      }
    >
      <Stack $gap={20}>
        <Row $between>
          <SectionTitle style={{ fontSize: 17 }}>Транзакции</SectionTitle>
          <SeeAll to="/transactions">Смотреть все</SeeAll>
        </Row>
        <Loadable query={transactions}>
          {(items) => (
            <TransactionList
              items={items}
              categories={categories.data}
              onSelect={(tx) => navigate(`/transactions/${tx.id}`)}
            />
          )}
        </Loadable>
      </Stack>
    </Screen>
  );
}

export const Cards = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 18px;
`;

export const MiniCard = styled(Link)`
  flex: 1;
  min-width: 0;
  background: ${colors.honeydew};
  border-radius: 15px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;

  span {
    font-size: 13px;
  }
  b {
    font-size: 16px;
    white-space: nowrap;
  }
`;

const SeeAll = styled(Link)`
  font-size: 13px;
`;
