import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Hint, Stack, TextField } from '@/components/ui';
import { useDeposit, useGoal } from '@/hooks/queries';
import { money, ymd } from '@/utils/format';

/** Пополнение цели: сумма уходит из баланса в категорию «Накопления» */
export function GoalDeposit() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const goal = useGoal(id);
  const deposit = useDeposit(id);
  const [date, setDate] = useState(ymd(new Date()));
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const value = Number(amount.replace(',', '.').replace(/\s/g, ''));
    if (!value || value <= 0) return setError('Введите сумму больше нуля');
    const now = new Date();
    const [y, m, d] = date.split('-').map(Number);
    try {
      await deposit.mutateAsync({
        amount: value,
        date: new Date(y, m - 1, d, now.getHours(), now.getMinutes()).toISOString(),
      });
      navigate(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    }
  };

  return (
    <Screen back title="Пополнить цель" sheetPadding="40px 32px 40px">
      <form onSubmit={submit}>
        <Stack $gap={20}>
          <TextField label="Цель" value={goal.data?.name ?? ''} readOnly />
          <TextField label="Дата" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <TextField
            label="Сумма, ₸"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.,\s]/g, ''))}
            required
          />
          {goal.data && (
            <Hint style={{ textAlign: 'center' }}>
              Накоплено {money(goal.data.saved)} из {money(goal.data.target)}
            </Hint>
          )}
          {error && <ErrorText>{error}</ErrorText>}
          <Stack $center style={{ marginTop: 20 }}>
            <Button type="submit" $small disabled={deposit.isPending}>
              Сохранить
            </Button>
          </Stack>
        </Stack>
      </form>
    </Screen>
  );
}
