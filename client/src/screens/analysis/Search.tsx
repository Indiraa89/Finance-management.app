import type { TransactionQuery, TransactionType } from '@finwise/shared';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Button, Card, Empty, Loadable, Row, SectionTitle, SelectField, Stack, T, TextField } from '@/components/ui';
import { useCategories, useTransactions } from '@/hooks/queries';
import { useNav } from '@/navigation/types';
import { colors, fonts } from '@/theme';

/** 9.2.5-A/B. Поиск по транзакциям */
export function Search() {
  const navigation = useNav();
  const categories = useCategories();
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [query, setQuery] = useState<TransactionQuery | null>(null);

  const search = () =>
    setQuery({
      q: text || undefined,
      categoryId: categoryId || undefined,
      type,
      from: date || undefined,
      to: date || undefined,
    });

  return (
    <Screen
      tab="Analysis"
      back
      title="Поиск"
      top={
        <TextInput
          placeholder="Поиск…"
          placeholderTextColor="rgba(9, 48, 48, 0.45)"
          value={text}
          onChangeText={setText}
          onSubmitEditing={search}
          accessibilityLabel="Текст для поиска"
          style={{
            marginTop: 20,
            height: 44,
            borderRadius: 18,
            paddingHorizontal: 20,
            backgroundColor: colors.honeydew,
            fontFamily: fonts.regular,
            fontSize: 15,
            color: colors.dark,
          }}
        />
      }
    >
      <Stack gap={20}>
        <SelectField
          label="Категория"
          placeholder="Все категории"
          value={categoryId}
          onChange={setCategoryId}
          options={[{ value: '', label: 'Все категории' }, ...(categories.data ?? []).map((c) => ({ value: c.id, label: c.name }))]}
        />
        <TextField label="Дата (ГГГГ-ММ-ДД)" placeholder="Любая дата" value={date} onChangeText={setDate} />
        <View>
          <SectionTitle style={{ marginLeft: 14, marginBottom: 10 }}>Тип</SectionTitle>
          <Row gap={36} style={{ paddingLeft: 14 }}>
            {(['income', 'expense'] as const).map((t) => (
              <Pressable key={t} onPress={() => setType(t)} accessibilityRole="radio" accessibilityState={{ checked: type === t }}>
                <Row gap={8}>
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: colors.primary,
                      padding: 2,
                    }}
                  >
                    {type === t && <View style={{ flex: 1, borderRadius: 4, backgroundColor: colors.primary }} />}
                  </View>
                  <T>{t === 'income' ? 'Доход' : 'Расход'}</T>
                </Row>
              </Pressable>
            ))}
          </Row>
        </View>
        <Button title="Искать" small onPress={search} />
        {query && (
          <Results query={query} onSelect={(id) => navigation.navigate('TransactionDetails', { id })} />
        )}
      </Stack>
    </Screen>
  );
}

function Results({ query, onSelect }: { query: TransactionQuery; onSelect: (id: string) => void }) {
  const transactions = useTransactions(query);
  const categories = useCategories();
  return (
    <Card style={{ marginTop: 8 }}>
      <Loadable query={transactions}>
        {(items) =>
          items.length === 0 ? (
            <Empty>Ничего не найдено</Empty>
          ) : (
            <TransactionList items={items} categories={categories.data} onSelect={(tx) => onSelect(tx.id)} />
          )
        }
      </Loadable>
    </Card>
  );
}
