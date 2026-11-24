import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { PIE_COLORS, PieChart } from '@/components/charts';
import { Screen } from '@/components/Screen';
import { TransactionList } from '@/components/TransactionRow';
import { Empty, Loadable, Segmented, Stack } from '@/components/ui';
import { useCalendar, useCategories, useTransactions } from '@/hooks/queries';
import { colors } from '@/theme';
import { MONTHS, money, ymd } from '@/utils/format';

const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

/** 9.2.6-A/B. Календарь: расходы по дням и доли категорий */
export function CalendarScreen() {
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0–11
  const [selected, setSelected] = useState<string>(ymd(now));
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

  return (
    <Screen nav back title="Календарь" sheetPadding="28px 26px 140px">
      <Stack $gap={22}>
        <MonthBar>
          <button aria-label="Предыдущий месяц" onClick={() => shift(-1)}>
            <ChevronLeft size={20} />
          </button>
          <b>
            {MONTHS[month]} {year}
          </b>
          <button aria-label="Следующий месяц" onClick={() => shift(1)}>
            <ChevronRight size={20} />
          </button>
        </MonthBar>

        <Grid>
          {WEEK.map((w) => (
            <Head key={w}>{w}</Head>
          ))}
          {Array.from({ length: offset }, (_, i) => (
            <span key={`e${i}`} />
          ))}
          {calendar.data?.days.map((d) => (
            <Day
              key={d.date}
              $selected={d.date === selected}
              $has={d.expense > 0}
              onClick={() => setSelected(d.date)}
              title={d.expense ? `Расход: ${money(d.expense)}` : undefined}
            >
              {Number(d.date.slice(8))}
            </Day>
          ))}
        </Grid>

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
                  onSelect={(tx) => navigate(`/transactions/${tx.id}`)}
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
                <Stack $gap={18} $center>
                  <PieChart parts={data.byCategory.map((c) => ({ label: c.name, value: c.amount }))} />
                  <Legend>
                    {data.byCategory.map((c, i) => (
                      <li key={c.categoryId}>
                        <i style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        {c.name} — {money(c.amount)}
                      </li>
                    ))}
                  </Legend>
                </Stack>
              )
            }
          </Loadable>
        )}
      </Stack>
    </Screen>
  );
}

const MonthBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${colors.dark};

  b {
    font-size: 16px;
    font-weight: 600;
  }
  button {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: ${colors.lightGreen};
    display: grid;
    place-items: center;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px 4px;
  text-align: center;
`;

const Head = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.oceanBlue};
  padding-bottom: 4px;
`;

const Day = styled.button<{ $selected: boolean; $has: boolean }>`
  position: relative;
  height: 34px;
  border-radius: 12px;
  font-size: 13px;
  background: ${({ $selected }) => ($selected ? colors.primary : 'transparent')};
  font-weight: ${({ $selected }) => ($selected ? 700 : 400)};

  &::after {
    content: '';
    display: ${({ $has }) => ($has ? 'block' : 'none')};
    position: absolute;
    bottom: 3px;
    left: 50%;
    width: 4px;
    height: 4px;
    margin-left: -2px;
    border-radius: 50%;
    background: ${({ $selected }) => ($selected ? colors.dark : colors.oceanBlue)};
  }
`;

const Legend = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
  font-size: 13px;
  text-align: left;
  width: 100%;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  i {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex: none;
  }
`;
