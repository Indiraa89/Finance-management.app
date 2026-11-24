import type { Period } from '@finwise/shared';
import { ArrowDownToLine, ArrowUpFromLine, CalendarDays, Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import { BalanceSummary } from '@/components/BalanceSummary';
import { BarChart, ChartCard, Ring, SmallIconButton } from '@/components/charts';
import { Screen } from '@/components/Screen';
import { Loadable, SectionTitle, Segmented, Stack } from '@/components/ui';
import { useAnalytics, useGoals, useSummary } from '@/hooks/queries';
import { colors } from '@/theme';
import { money } from '@/utils/format';

const periods: { value: Period; label: string }[] = [
  { value: 'daily', label: 'День' },
  { value: 'weekly', label: 'Неделя' },
  { value: 'monthly', label: 'Месяц' },
  { value: 'yearly', label: 'Год' },
];

/** 9.2.1–9.2.4. Анализ по дням / неделям / месяцам / годам */
export function Analysis() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('daily');
  const summary = useSummary();
  const analytics = useAnalytics(period);
  const goals = useGoals();

  return (
    <Screen nav back="/home" title="Анализ" top={<BalanceSummary summary={summary.data} />}>
      <Stack $gap={26}>
        <Segmented value={period} options={periods} onChange={setPeriod} />

        <ChartCard
          title="Доходы и расходы"
          actions={
            <>
              <SmallIconButton aria-label="Поиск" onClick={() => navigate('/analysis/search')}>
                <Search size={16} />
              </SmallIconButton>
              <SmallIconButton aria-label="Календарь" onClick={() => navigate('/analysis/calendar')}>
                <CalendarDays size={16} />
              </SmallIconButton>
            </>
          }
        >
          <Loadable query={analytics}>{(data) => <BarChart points={data.points} />}</Loadable>
        </ChartCard>

        <Totals>
          <Total>
            <ArrowUpFromLine size={24} color={colors.primary} />
            <span>Доход</span>
            <b>{money(analytics.data?.income ?? 0)}</b>
          </Total>
          <Total>
            <ArrowDownToLine size={24} color={colors.oceanBlue} />
            <span>Расход</span>
            <b style={{ color: colors.oceanBlue }}>{money(analytics.data?.expense ?? 0)}</b>
          </Total>
        </Totals>

        <SectionTitle style={{ fontSize: 17 }}>Мои цели</SectionTitle>
        <Loadable query={goals}>
          {(list) => (
            <Goals>
              {[...list]
                .sort((a, b) => b.saved / b.target - a.saved / a.target)
                .slice(0, 2)
                .map((g) => {
                  const p = Math.round((g.saved / g.target) * 100);
                  return (
                    <GoalCard key={g.id} to={`/savings/${g.id}`}>
                      <Ring percent={p} size={86} stroke={6} track={colors.honeydew} color={colors.oceanBlue}>
                        <b>{p}%</b>
                      </Ring>
                      <span>{g.name}</span>
                    </GoalCard>
                  );
                })}
            </Goals>
          )}
        </Loadable>
      </Stack>
    </Screen>
  );
}

const Totals = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Total = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  span {
    font-size: 14px;
  }
  b {
    font-size: 18px;
  }
`;

const Goals = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const GoalCard = styled(Link)`
  background: ${colors.lightBlue};
  border-radius: 30px;
  padding: 18px 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: ${colors.white};

  b {
    font-size: 16px;
  }
  span {
    font-weight: 500;
  }
`;
