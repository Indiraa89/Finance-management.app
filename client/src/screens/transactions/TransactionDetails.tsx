import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { CategoryIcon } from '@/components/CategoryIcon';
import { FullWidth, Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { Button, Card, Empty, Hint, Row, Spinner, Stack, T } from '@/components/ui';
import { useCategories, useDeleteTransaction, useTransactions } from '@/hooks/queries';
import { useNav, useParams } from '@/navigation/types';
import { colors } from '@/theme';
import { money, shortDate, timeAndDate } from '@/utils/format';

/** Подробности операции и удаление */
export function TransactionDetails() {
  const { id } = useParams<'TransactionDetails'>();
  const navigation = useNav();
  const transactions = useTransactions();
  const categories = useCategories();
  const remove = useDeleteTransaction();
  const [confirm, setConfirm] = useState(false);

  const tx = transactions.data?.find((t) => t.id === id);
  const category = categories.data?.find((c) => c.id === tx?.categoryId);
  const expense = tx?.type === 'expense';

  const rows: [string, string][] = tx
    ? [
        ['Тип', expense ? 'Расход' : 'Доход'],
        ['Категория', category?.name ?? '—'],
        ['Дата', `${shortDate(tx.date)}, ${timeAndDate(tx.date).split(' · ')[0]}`],
        ...(tx.note ? ([['Заметка', tx.note]] as [string, string][]) : []),
      ]
    : [];

  return (
    <Screen back title="Операция">
      {transactions.isLoading ? (
        <Spinner />
      ) : !tx ? (
        <Empty>Операция не найдена</Empty>
      ) : (
        <Stack gap={22} center>
          <CategoryIcon icon={category?.icon ?? 'other'} size={80} radius={26} />
          <T size={20} weight="semibold" center>
            {tx.title}
          </T>
          <T size={30} weight="bold" color={expense ? colors.oceanBlue : colors.primaryDark}>
            {money(tx.amount, { negative: expense, plus: !expense })}
          </T>
          <Card style={{ alignSelf: 'stretch', gap: 12 }}>
            {rows.map(([k, v]) => (
              <Row key={k} between gap={16}>
                <T size={14} color={colors.muted}>
                  {k}
                </T>
                <View style={{ flex: 1 }}>
                  <T size={14} weight="medium" style={{ textAlign: 'right' }}>
                    {v}
                  </T>
                </View>
              </Row>
            ))}
          </Card>
          <Button title="Удалить" variant="secondary" icon={<Trash2 size={18} color={colors.dark} />} onPress={() => setConfirm(true)} />
        </Stack>
      )}

      <Modal open={confirm} title="Удалить операцию?" onClose={() => setConfirm(false)}>
        <Hint center>Сумма вернётся в баланс, а операция исчезнет из истории и аналитики.</Hint>
        <FullWidth>
          <Button
            title="Да, удалить"
            variant="danger"
            block
            disabled={remove.isPending}
            onPress={async () => {
              await remove.mutateAsync(id);
              setConfirm(false);
              navigation.goBack();
            }}
          />
          <Button title="Отмена" variant="secondary" block onPress={() => setConfirm(false)} />
        </FullWidth>
      </Modal>
    </Screen>
  );
}
