import type { TransactionType } from '@finwise/shared';
import { useState } from 'react';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Segmented, SelectField, Stack, TextField } from '@/components/ui';
import { useCategories, useCreateTransaction } from '@/hooks/queries';
import { useNav, useParams } from '@/navigation/types';
import { ymd } from '@/utils/format';

/** Разбор даты ГГГГ-ММ-ДД; null — если дата введена неверно */
export function parseDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const now = new Date();
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), now.getHours(), now.getMinutes());
  return d.getMonth() === Number(m[2]) - 1 ? d : null;
}

/**
 * «Добавить расход/доход» (кнопка в категории и плюс в «Транзакциях»).
 * Параметры: type и categoryId.
 */
export function AddTransaction() {
  const navigation = useNav();
  const params = useParams<'AddTransaction'>();
  const categories = useCategories();
  const create = useCreateTransaction();
  const lockedCategory = params?.categoryId;

  const [type, setType] = useState<TransactionType>(params?.type ?? 'expense');
  const [categoryId, setCategoryId] = useState(params?.categoryId ?? '');
  const [date, setDate] = useState(ymd(new Date()));
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const options = (categories.data ?? []).filter((c) => c.type === type);

  const changeType = (t: TransactionType) => {
    setType(t);
    setCategoryId('');
  };

  const submit = async () => {
    setError('');
    const value = Number(amount.replace(',', '.').replace(/\s/g, ''));
    const when = parseDate(date);
    if (!categoryId) return setError('Выберите категорию');
    if (!value || value <= 0) return setError('Введите сумму больше нуля');
    if (!when) return setError('Дата в формате ГГГГ-ММ-ДД');
    try {
      await create.mutateAsync({
        type,
        categoryId,
        amount: value,
        title: title.trim() || options.find((c) => c.id === categoryId)?.name || 'Операция',
        date: when.toISOString(),
        note,
      });
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить');
    }
  };

  return (
    <Screen back title={type === 'expense' ? 'Добавить расход' : 'Добавить доход'} sheetStyle={{ paddingHorizontal: 32 }}>
      <Stack gap={18}>
        {!lockedCategory && (
          <Segmented
            value={type}
            onChange={changeType}
            options={[
              { value: 'expense', label: 'Расход' },
              { value: 'income', label: 'Доход' },
            ]}
          />
        )}
        <TextField label="Дата (ГГГГ-ММ-ДД)" value={date} onChangeText={setDate} />
        <SelectField
          label="Категория"
          placeholder="Выберите категорию"
          value={categoryId}
          onChange={setCategoryId}
          options={options.map((c) => ({ value: c.id, label: c.name }))}
        />
        <TextField
          label="Сумма, ₸"
          keyboardType="decimal-pad"
          placeholder="0"
          value={amount}
          onChangeText={(v) => setAmount(v.replace(/[^\d.,\s]/g, ''))}
        />
        <TextField label="Название" placeholder="Например: Ужин" value={title} onChangeText={setTitle} />
        <TextField label="Заметка" placeholder="Необязательно" value={note} onChangeText={setNote} multiline />
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Button title={create.isPending ? 'Сохраняем…' : 'Сохранить'} small disabled={create.isPending} onPress={submit} />
      </Stack>
    </Screen>
  );
}
