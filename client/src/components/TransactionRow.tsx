import type { Category, Transaction } from '@finwise/shared';
import styled from 'styled-components';
import { colors } from '@/theme';
import { money, timeAndDate } from '@/utils/format';
import { CategoryIcon } from './CategoryIcon';
import { VDivider } from './ui';

/** Строка транзакции: иконка · название и время · категория · сумма */
export function TransactionRow({
  tx,
  category,
  onClick,
}: {
  tx: Transaction;
  category?: Category;
  onClick?: () => void;
}) {
  const expense = tx.type === 'expense';
  return (
    <Item as={onClick ? 'button' : 'div'} onClick={onClick}>
      <CategoryIcon icon={category?.icon ?? 'other'} size={46} radius={16} />
      <Main>
        <Name>{tx.title}</Name>
        <Time>{timeAndDate(tx.date)}</Time>
      </Main>
      <VDivider />
      <Cat>{category?.name ?? '—'}</Cat>
      <VDivider />
      <Amount $expense={expense}>{money(tx.amount, { negative: expense })}</Amount>
    </Item>
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
    <List>
      {items.map((tx) => (
        <TransactionRow
          key={tx.id}
          tx={tx}
          category={byId.get(tx.categoryId)}
          onClick={onSelect ? () => onSelect(tx) : undefined}
        />
      ))}
    </List>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
`;

const Main = styled.div`
  flex: 1.4;
  min-width: 0;
`;

const Name = styled.p`
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Time = styled.p`
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  color: ${colors.oceanBlue};
`;

const Cat = styled.p`
  flex: 0.9;
  min-width: 0;
  font-size: 11px;
  font-weight: 300;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Amount = styled.p<{ $expense: boolean }>`
  flex: 1.1;
  text-align: right;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  color: ${({ $expense }) => ($expense ? colors.oceanBlue : colors.dark)};
`;
