import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { Button, Empty, Hint, Spinner, Stack } from '@/components/ui';
import { useCategories, useDeleteTransaction, useTransactions } from '@/hooks/queries';
import { colors } from '@/theme';
import { money, shortDate, timeAndDate } from '@/utils/format';

/** Подробности операции и удаление */
export function TransactionDetails() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const transactions = useTransactions();
  const categories = useCategories();
  const remove = useDeleteTransaction();
  const [confirm, setConfirm] = useState(false);

  const tx = transactions.data?.find((t) => t.id === id);
  const category = categories.data?.find((c) => c.id === tx?.categoryId);

  return (
    <Screen back title="Операция">
      {transactions.isLoading ? (
        <Spinner />
      ) : !tx ? (
        <Empty>Операция не найдена</Empty>
      ) : (
        <Stack $gap={22} $center>
          <CategoryIcon icon={category?.icon ?? 'other'} size={80} radius={26} />
          <h2>{tx.title}</h2>
          <Amount $expense={tx.type === 'expense'}>
            {money(tx.amount, { negative: tx.type === 'expense', plus: tx.type === 'income' })}
          </Amount>
          <Table>
            <dt>Тип</dt>
            <dd>{tx.type === 'expense' ? 'Расход' : 'Доход'}</dd>
            <dt>Категория</dt>
            <dd>{category?.name ?? '—'}</dd>
            <dt>Дата</dt>
            <dd>
              {shortDate(tx.date)}, {timeAndDate(tx.date).split(' · ')[0]}
            </dd>
            {tx.note && (
              <>
                <dt>Заметка</dt>
                <dd>{tx.note}</dd>
              </>
            )}
          </Table>
          <Button $variant="secondary" onClick={() => setConfirm(true)}>
            <Trash2 size={18} /> Удалить
          </Button>
        </Stack>
      )}

      <Modal open={confirm} title="Удалить операцию?" onClose={() => setConfirm(false)}>
        <Hint>Сумма вернётся в баланс, а операция исчезнет из истории и аналитики.</Hint>
        <Button
          $variant="danger"
          disabled={remove.isPending}
          onClick={async () => {
            await remove.mutateAsync(id);
            navigate(-1);
          }}
        >
          Да, удалить
        </Button>
        <Button $variant="secondary" onClick={() => setConfirm(false)}>
          Отмена
        </Button>
      </Modal>
    </Screen>
  );
}

const Amount = styled.p<{ $expense: boolean }>`
  font-size: 30px;
  font-weight: 700;
  color: ${({ $expense }) => ($expense ? colors.oceanBlue : colors.primaryDark)};
`;

const Table = styled.dl`
  width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px 16px;
  background: ${colors.lightGreen};
  border-radius: 20px;
  padding: 18px 22px;
  text-align: left;

  dt {
    color: ${colors.muted};
    font-size: 14px;
  }
  dd {
    margin: 0;
    font-weight: 500;
    font-size: 14px;
    text-align: right;
  }
`;
