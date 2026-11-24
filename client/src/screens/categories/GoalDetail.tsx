import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { LimitBar } from '@/components/BalanceSummary';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Ring } from '@/components/charts';
import { Screen } from '@/components/Screen';
import { Button, Empty, Loadable, SectionTitle, Stack } from '@/components/ui';
import { useGoal } from '@/hooks/queries';
import { colors } from '@/theme';
import { groupByMonth, money, timeAndDate } from '@/utils/format';
import { Sticky } from './CategoryDetail';

/** Экран цели накоплений (Путешествие и др.) */
export function GoalDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const goal = useGoal(id);
  const g = goal.data;
  const percent = g ? Math.round((g.saved / g.target) * 100) : 0;

  return (
    <Screen
      nav
      back="/savings"
      title={g?.name ?? 'Цель'}
      sheetPadding="36px 24px 200px"
      top={
        g && (
          <Stack $gap={14} style={{ marginTop: 22 }}>
            <Numbers>
              <div>
                <span>Цель</span>
                <b>{money(g.target)}</b>
              </div>
              <div>
                <span>Накоплено</span>
                <b style={{ color: colors.oceanBlue }}>{money(g.saved)}</b>
              </div>
            </Numbers>
            <LimitBar percent={Math.min(100, percent)} limit={g.target} />
          </Stack>
        )
      }
    >
      <Loadable query={goal}>
        {(data) => (
          <Stack $gap={24}>
            <Hero>
              <Ring percent={percent} size={150} stroke={8} track={colors.lightGreen} color={colors.oceanBlue}>
                <CategoryIcon icon={data.icon} size={84} radius={42} />
              </Ring>
              <p>
                {percent}% · осталось {money(Math.max(0, data.target - data.saved))}
              </p>
            </Hero>
            {data.deposits.length === 0 ? (
              <Empty>Пополнений пока нет</Empty>
            ) : (
              groupByMonth(data.deposits).map((group) => (
                <Stack key={group.key} $gap={14}>
                  <SectionTitle>{group.title}</SectionTitle>
                  {group.items.map((d) => (
                    <Deposit key={d.id}>
                      <CategoryIcon icon={data.icon} size={48} />
                      <div>
                        <b>Пополнение</b>
                        <time>{timeAndDate(d.date)}</time>
                      </div>
                      <strong>{money(d.amount, { plus: true })}</strong>
                    </Deposit>
                  ))}
                </Stack>
              ))
            )}
          </Stack>
        )}
      </Loadable>
      <Sticky>
        <Button $small onClick={() => navigate(`/savings/${id}/deposit`)}>
          Пополнить
        </Button>
      </Sticky>
    </Screen>
  );
}

const Numbers = styled.div`
  display: flex;
  justify-content: space-between;

  span {
    display: block;
    font-size: 13px;
  }
  b {
    font-size: 20px;
  }
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  p {
    font-weight: 500;
  }
`;

const Deposit = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  b {
    font-weight: 500;
  }
  time {
    font-size: 12px;
    color: ${colors.oceanBlue};
    font-weight: 600;
  }
  strong {
    font-weight: 600;
  }
`;
