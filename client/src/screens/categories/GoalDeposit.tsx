import { useState } from 'react';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, Stack, TextField } from '@/components/ui';
import { useDeposit, useGoal } from '@/hooks/queries';
import { useNav, useParams } from '@/navigation/types';
import { money, ymd } from '@/utils/format';
import { parseDate } from '../transactions/AddTransaction';

/** Пополнение цели: сумма уходит из баланса в категорию «Накопления» */
export function GoalDeposit() {
  const { id } = useParams<'GoalDeposit'>();
  const navigation = useNav();
  const goal = useGoal(id);
  const deposit = useDeposit(id);
  const [date, setDate] = useState(ymd(new Date()));
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const submit = async () => {
    const value = Number(amount.replace(',', '.').replace(/\s/g, ''));
    const when = parseDate(date);
    if (!value || value <= 0) return setError('Введите сумму больше нуля');
    if (!when) return setError('Дата в формате ГГГГ-ММ-ДД');
    try {
      await deposit.mutateAsync({ amount: value, date: when.toISOString() });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  return (
    <Screen back title="Пополнить цель" sheetStyle={{ paddingTop: 40, paddingHorizontal: 32 }}>
      <Stack gap={20}>
        <TextField label="Цель" value={goal.data?.name ?? ''} editable={false} />
        <TextField label="Дата (ГГГГ-ММ-ДД)" value={date} onChangeText={setDate} />
        <TextField
          label="Сумма, ₸"
          keyboardType="decimal-pad"
          placeholder="0"
          value={amount}
          onChangeText={(v) => setAmount(v.replace(/[^\d.,\s]/g, ''))}
        />
        {goal.data && (
          <Hint center>
            Накоплено {money(goal.data.saved)} из {money(goal.data.target)}
          </Hint>
        )}
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Button title="Сохранить" small disabled={deposit.isPending} onPress={submit} style={{ marginTop: 20 }} />
      </Stack>
    </Screen>
  );
}
