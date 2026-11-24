import type { TransactionQuery, TransactionType } from '@finwise/shared';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Button, Empty, Loadable, SectionTitle, SelectField, Stack, TextField, inputStyles } from '@/components/ui';
import { useCategories, useTransactions } from '@/hooks/queries';
import { colors } from '@/theme';

/** 9.2.5-A/B. Поиск по транзакциям */
export function Search() {
  const navigate = useNavigate();
  const categories = useCategories();
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [query, setQuery] = useState<TransactionQuery | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setQuery({
      q: text || undefined,
      categoryId: categoryId || undefined,
      type,
      from: date || undefined,
      to: date || undefined,
    });
  };

  return (
    <Screen
      nav
      back
      title="Поиск"
      top={
        <SearchInput
          placeholder="Поиск…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Текст для поиска"
        />
      }
    >
      <form onSubmit={submit}>
        <Stack $gap={20}>
          <SelectField
            label="Категория"
            placeholder="Все категории"
            value={categoryId}
            onChange={setCategoryId}
            options={[
              { value: '', label: 'Все категории' },
              ...(categories.data ?? []).map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <TextField label="Дата" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div>
            <SectionTitle style={{ marginLeft: 14, marginBottom: 10 }}>Тип</SectionTitle>
            <Radios>
              {(['income', 'expense'] as const).map((t) => (
                <label key={t}>
                  <input type="radio" name="type" checked={type === t} onChange={() => setType(t)} />
                  <Dot $on={type === t} />
                  {t === 'income' ? 'Доход' : 'Расход'}
                </label>
              ))}
            </Radios>
          </div>
          <Stack $center>
            <Button type="submit" $small>
              Искать
            </Button>
          </Stack>
        </Stack>
      </form>
      {query && <Results query={query} onSelect={(id) => navigate(`/transactions/${id}`)} />}
    </Screen>
  );
}

function Results({ query, onSelect }: { query: TransactionQuery; onSelect: (id: string) => void }) {
  const transactions = useTransactions(query);
  const categories = useCategories();
  return (
    <ResultBox>
      <Loadable query={transactions}>
        {(items) =>
          items.length === 0 ? (
            <Empty>Ничего не найдено</Empty>
          ) : (
            <TransactionList items={items} categories={categories.data} onSelect={(tx) => onSelect(tx.id)} />
          )
        }
      </Loadable>
    </ResultBox>
  );
}

const SearchInput = styled.input`
  ${inputStyles};
  margin-top: 20px;
  background: ${colors.honeydew};
`;

const Radios = styled.div`
  display: flex;
  gap: 36px;
  padding-left: 14px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
  }
  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
`;

const Dot = styled.span<{ $on: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid ${colors.primary};
  background: ${({ $on }) => ($on ? colors.primary : 'transparent')};
  box-shadow: inset 0 0 0 2px ${colors.honeydew};
`;

const ResultBox = styled.div`
  margin-top: 28px;
  background: ${colors.lightGreen};
  border-radius: 22px;
  padding: 16px;
`;
