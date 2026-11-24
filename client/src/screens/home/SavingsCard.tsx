import { PiggyBank } from 'lucide-react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Ring } from '@/components/charts';
import { colors } from '@/theme';
import { money } from '@/utils/format';

interface Props {
  progress: number;
  goalName: string;
  revenueLastWeek: number;
  foodLastWeek: number;
  /** Если задано — карточка становится ссылкой */
  to?: string;
  /** Без своей подложки (для зелёной шапки «Быстрого анализа») */
  flat?: boolean;
}

/** Зелёная карточка: прогресс накоплений + доход и еда за неделю */
export function SavingsCard({ progress, goalName, revenueLastWeek, foodLastWeek, to, flat }: Props) {
  const content = (
    <>
      <Left>
        <Ring percent={progress} size={74} stroke={4}>
          <PiggyBank size={30} color={colors.dark} strokeWidth={1.6} />
        </Ring>
        <Caption>
          Накопления
          <br />
          {goalName} · {progress}%
        </Caption>
      </Left>
      <Divider />
      <Right>
        <Line>
          <CategoryIcon icon="salary" size={36} bg="transparent" />
          <div>
            <Small>Доход за неделю</Small>
            <Big>{money(revenueLastWeek)}</Big>
          </div>
        </Line>
        <HLine />
        <Line>
          <CategoryIcon icon="food" size={36} bg="transparent" />
          <div>
            <Small>Еда за неделю</Small>
            <Big $blue>{money(foodLastWeek, { negative: foodLastWeek > 0 })}</Big>
          </div>
        </Line>
      </Right>
    </>
  );

  if (to)
    return (
      <Card as={Link} to={to} $flat={flat}>
        {content}
      </Card>
    );
  return <Card $flat={flat}>{content}</Card>;
}

const Card = styled.div<{ $flat?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  background: ${({ $flat }) => ($flat ? 'transparent' : colors.primary)};
  border-radius: 31px;
  padding: ${({ $flat }) => ($flat ? '18px 0 0' : '20px 24px')};
  color: ${colors.dark};

  /* иконки в карточке — тёмные, без кружка */
  svg {
    color: ${colors.dark};
    stroke: ${colors.dark};
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: none;
  width: 92px;
`;

const Caption = styled.p`
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
`;

const Divider = styled.span`
  width: 2px;
  align-self: stretch;
  background: ${colors.honeydew};
  border-radius: 1px;
`;

const Right = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HLine = styled.span`
  height: 2px;
  background: ${colors.honeydew};
  border-radius: 1px;
`;

const Small = styled.p`
  font-size: 12px;
`;

const Big = styled.p<{ $blue?: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $blue }) => ($blue ? colors.oceanBlue : colors.dark)};
  white-space: nowrap;
`;
