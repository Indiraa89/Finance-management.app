import type { TransactionType } from '@finwise/shared';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Segmented, SelectField, Stack, TextArea, TextField } from '@/components/ui';
import { useCategories, useCreateTransaction } from '@/hooks/queries';
import { ymd } from '@/utils/format';

/**
 * Экран «Добавить расход/доход» (9.4, кнопка в категории).
 * Параметры: ?type=expense&categoryId=...
 */
export function AddTransaction() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const categories = useCategories();
  const create = useCreateTransaction();

  const [type, setType] = useState<TransactionType>((params.get('type') as TransactionType) || 'expense');
  const [categoryId, setCategoryId] = useState(params.get('categoryId') ?? '');
  const [date, setDate] = useState(ymd(new Date()));
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const options = (categories.data ?? []).filter((c) => c.type === type);
  const lockedCategory = params.get('categoryId');

  // при смене типа сбрасываем категорию, если она не подходит
  useEffect(() => {
    if (categoryId && categories.data && !options.some((c) => c.id === categoryId)) setCategoryId('');
  }, [type, categories.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const value = Number(amount.replace(',', '.').replace(/\s/g, ''));
    if (!categoryId) return setError('Выберите категорию');
    if (!value || value <= 0) return setError('Введите сумму больше нуля');
    // время берём текущее, дату — из поля
    const now = new Date();
    const [y, m, d] = date.split('-').map(Number);
    const when = new Date(y, m - 1, d, now.getHours(), now.getMinutes());
    try {
      await create.mutateAsync({
        type,
        categoryId,
        amount: value,
        title: title.trim() || options.find((c) => c.id === categoryId)?.name || 'Операция',
        date: when.toISOString(),
        note,
      });
      navigate(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить');
    }
  };

  return (
    <Screen back title={type === 'expense' ? 'Добавить расход' : 'Добавить доход'} sheetPadding="36px 32px 40px">
      <form onSubmit={submit}>
        <Stack $gap={18}>
          {!lockedCategory && (
            <Segmented
              value={type}
              onChange={setType}
              options={[
                { value: 'expense', label: 'Расход' },
                { value: 'income', label: 'Доход' },
              ]}
            />
          )}
          <TextField label="Дата" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <SelectField
            label="Категория"
            placeholder="Выберите категорию"
            value={categoryId}
            onChange={setCategoryId}
            options={options.map((c) => ({ value: c.id, label: c.name }))}
          />
          <TextField
            label="Сумма, ₸"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.,\s]/g, ''))}
            required
          />
          <TextField label="Название" placeholder="Например: Ужин" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextArea label="Заметка" placeholder="Необязательно" value={note} onChange={setNote} />
          {error && <ErrorText>{error}</ErrorText>}
          <Stack $center>
            <Button type="submit" $small disabled={create.isPending}>
              {create.isPending ? 'Сохраняем…' : 'Сохранить'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Screen>
  );
}
