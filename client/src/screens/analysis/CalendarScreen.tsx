import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PIE_COLORS, PieChart } from '@/components/charts';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Empty, Loadable, Row, Segmented, Stack, T } from '@/components/ui';
import { useCalendar, useCategories, useTransactions } from '@/hooks/queries';
import { useNav } from '@/navigation/types';
import { colors } from '@/theme';
import { MONTHS, money, ymd } from '@/utils/format';

const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

/** 9.2.6-A/B. Календарь: расходы по дням и доли категорий */
export function CalendarScreen() {
  const navigation = useNav();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0–11
  const [selected, setSelected] = useState(ymd(now));
  const [tab, setTab] = useState<'spends' | 'categories'>('spends');

  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const calendar = useCalendar(monthKey);
  const categories = useCategories();
  const dayQuery = useMemo(() => ({ from: selected, to: selected }), [selected]);
  const dayTx = useTransactions(dayQuery);

  const shift = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelected(ymd(d));
  };

  // Пустые клетки до первого дня месяца (неделя начинается с понедельника)
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells: ({ date: string; expense: number } | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...(calendar.data?.days ?? []),
  ];

  return (
    <Screen tab="Analysis" back title="Календарь" sheetStyle={{ paddingTop: 28, paddingHorizontal: 22 }}>
      <Stack gap={22}>
        <Row between>
          <Pressable style={s.arrow} onPress={() => shift(-1)} accessibilityLabel="Предыдущий месяц">
            <ChevronLeft size={20} color={colors.dark} />
          </Pressable>
          <T size={16} weight="semibold">
            {MONTHS[month]} {year}
          </T>
          <Pressable style={s.arrow} onPress={() => shift(1)} accessibilityLabel="Следующий месяц">
            <ChevronRight size={20} color={colors.dark} />
          </Pressable>
        </Row>

        <View style={s.grid}>
          {WEEK.map((w) => (
            <View key={w} style={s.cell}>
              <T size={13} weight="semibold" color={colors.oceanBlue}>
                {w}
              </T>
            </View>
          ))}
          {cells.map((d, i) =>
            d ? (
              <Pressable key={d.date} style={s.cell} onPress={() => setSelected(d.date)}>
                <View style={[s.day, d.date === selected && { backgroundColor: colors.primary }]}>
                  <T size={13} weight={d.date === selected ? 'bold' : 'regular'}>
                    {Number(d.date.slice(8))}
                  </T>
                  {d.expense > 0 && (
                    <View style={[s.dot, { backgroundColor: d.date === selected ? colors.dark : colors.oceanBlue }]} />
                  )}
                </View>
              </Pressable>
            ) : (
              <View key={`e${i}`} style={s.cell} />
            ),
          )}
        </View>

        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'spends', label: 'Операции' },
            { value: 'categories', label: 'Категории' },
          ]}
        />

        {tab === 'spends' ? (
          <Loadable query={dayTx}>
            {(items) =>
              items.length === 0 ? (
                <Empty>В этот день операций нет</Empty>
              ) : (
                <TransactionList
                  items={items}
                  categories={categories.data}
                  onSelect={(tx) => navigation.navigate('TransactionDetails', { id: tx.id })}
                />
              )
            }
          </Loadable>
        ) : (
          <Loadable query={calendar}>
            {(data) =>
              data.byCategory.length === 0 ? (
                <Empty>В этом месяце расходов нет</Empty>
              ) : (
                <Stack gap={18} center>
                  <PieChart parts={data.byCategory.map((c) => ({ label: c.name, value: c.amount }))} />
                  <View style={{ alignSelf: 'stretch', gap: 6 }}>
                    {data.byCategory.map((c, i) => (
                      <Row key={c.categoryId} gap={8}>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <T size={13}>
                          {c.name} — {money(c.amount)}
                        </T>
                      </Row>
                    ))}
                  </View>
                </Stack>
              )
            }
          </Loadable>
        )}
      </Stack>
    </Screen>
  );
}

const s = StyleSheet.create({
  arrow: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.lightGreen, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: 40, alignItems: 'center', justifyContent: 'center' },
  day: { width: 36, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', bottom: 3, width: 4, height: 4, borderRadius: 2 },
});
