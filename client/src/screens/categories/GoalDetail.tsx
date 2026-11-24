import { View } from 'react-native';
import { LimitBar } from '@/components/BalanceSummary';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Ring } from '@/components/charts';
import { Screen } from '@/components/Screen';
import { Button, Empty, Loadable, Row, SectionTitle, Stack, T } from '@/components/ui';
import { useGoal } from '@/hooks/queries';
import { useNav, useParams } from '@/navigation/types';
import { colors } from '@/theme';
import { groupByMonth, money, timeAndDate } from '@/utils/format';

/** Экран цели накоплений (Путешествие и др.) */
export function GoalDetail() {
  const { id } = useParams<'GoalDetail'>();
  const navigation = useNav();
  const goal = useGoal(id);
  const g = goal.data;
  const percent = g ? Math.round((g.saved / g.target) * 100) : 0;

  return (
    <Screen
      tab="Categories"
      back
      title={g?.name ?? 'Цель'}
      floating={<Button title="Пополнить" small onPress={() => navigation.navigate('GoalDeposit', { id })} />}
      top={
        g && (
          <Stack gap={14} style={{ marginTop: 22 }}>
            <Row between>
              <View>
                <T size={13}>Цель</T>
                <T size={20} weight="bold">
                  {money(g.target)}
                </T>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <T size={13}>Накоплено</T>
                <T size={20} weight="bold" color={colors.oceanBlue}>
                  {money(g.saved)}
                </T>
              </View>
            </Row>
            <LimitBar percent={Math.min(100, percent)} limit={g.target} />
          </Stack>
        )
      }
    >
      <Loadable query={goal}>
        {(data) => (
          <Stack gap={24}>
            <Stack gap={12} center>
              <Ring percent={percent} size={150} stroke={8} track={colors.lightGreen} color={colors.oceanBlue}>
                <CategoryIcon icon={data.icon} size={84} radius={42} />
              </Ring>
              <T weight="medium">
                {percent}% · осталось {money(Math.max(0, data.target - data.saved))}
              </T>
            </Stack>
            {data.deposits.length === 0 ? (
              <Empty>Пополнений пока нет</Empty>
            ) : (
              groupByMonth(data.deposits).map((group) => (
                <Stack key={group.key} gap={14}>
                  <SectionTitle>{group.title}</SectionTitle>
                  {group.items.map((d) => (
                    <Row key={d.id} gap={14}>
                      <CategoryIcon icon={data.icon} size={48} />
                      <View style={{ flex: 1 }}>
                        <T weight="medium">Пополнение</T>
                        <T size={12} weight="semibold" color={colors.oceanBlue}>
                          {timeAndDate(d.date)}
                        </T>
                      </View>
                      <T weight="semibold">{money(d.amount, { plus: true })}</T>
                    </Row>
                  ))}
                </Stack>
              ))
            )}
          </Stack>
        )}
      </Loadable>
    </Screen>
  );
}
