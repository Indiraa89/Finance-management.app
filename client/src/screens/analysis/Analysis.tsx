import type { Period } from '@finwise/shared';
import { ArrowDownToLine, ArrowUpFromLine, CalendarDays, Search } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { BalanceSummary } from '@/components/BalanceSummary';
import { BarChart, ChartCard, Ring, SmallIconButton } from '@/components/charts';
import { Screen } from '@/components/Screen';
import { Loadable, SectionTitle, Segmented, Stack, T } from '@/components/ui';
import { useAnalytics, useGoals, useSummary } from '@/hooks/queries';
import { useNav } from '@/navigation/types';
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
  const navigation = useNav();
  const [period, setPeriod] = useState<Period>('daily');
  const summary = useSummary();
  const analytics = useAnalytics(period);
  const goals = useGoals();

  return (
    <Screen tab="Analysis" back title="Анализ" top={<BalanceSummary summary={summary.data} />}>
      <Stack gap={26}>
        <Segmented value={period} options={periods} onChange={setPeriod} />

        <ChartCard
          title="Доходы и расходы"
          actions={
            <>
              <SmallIconButton label="Поиск" onPress={() => navigation.navigate('Search')}>
                <Search size={16} color={colors.dark} />
              </SmallIconButton>
              <SmallIconButton label="Календарь" onPress={() => navigation.navigate('Calendar')}>
                <CalendarDays size={16} color={colors.dark} />
              </SmallIconButton>
            </>
          }
        >
          <Loadable query={analytics}>{(data) => <BarChart points={data.points} />}</Loadable>
        </ChartCard>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <ArrowUpFromLine size={24} color={colors.primary} />
            <T size={14}>Доход</T>
            <T size={18} weight="bold">
              {money(analytics.data?.income ?? 0)}
            </T>
          </View>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <ArrowDownToLine size={24} color={colors.oceanBlue} />
            <T size={14}>Расход</T>
            <T size={18} weight="bold" color={colors.oceanBlue}>
              {money(analytics.data?.expense ?? 0)}
            </T>
          </View>
        </View>

        <SectionTitle size={17}>Мои цели</SectionTitle>
        <Loadable query={goals}>
          {(list) => (
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {[...list]
                .sort((a, b) => b.saved / b.target - a.saved / a.target)
                .slice(0, 2)
                .map((g) => {
                  const p = Math.round((g.saved / g.target) * 100);
                  return (
                    <Pressable
                      key={g.id}
                      onPress={() => navigation.navigate('GoalDetail', { id: g.id })}
                      style={{ flex: 1, backgroundColor: colors.lightBlue, borderRadius: 30, paddingVertical: 18, alignItems: 'center', gap: 8 }}
                    >
                      <Ring percent={p} size={86} stroke={6} track={colors.honeydew} color={colors.oceanBlue}>
                        <T size={16} weight="bold" color={colors.white}>
                          {p}%
                        </T>
                      </Ring>
                      <T weight="medium" color={colors.white}>
                        {g.name}
                      </T>
                    </Pressable>
                  );
                })}
            </View>
          )}
        </Loadable>
      </Stack>
    </Screen>
  );
}
