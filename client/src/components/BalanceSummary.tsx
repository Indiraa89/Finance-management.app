import type { Summary } from '@finwise/shared';
import { ArrowDownRight, ArrowUpRight, SquareCheck } from 'lucide-react';
import styled from 'styled-components';
import { colors } from '@/theme';
import { money } from '@/utils/format';

/** Блок из шапки: «Общий баланс / Общие расходы» + полоса лимита */
export function BalanceSummary({ summary }: { summary: Summary | undefined }) {
  const s = summary;
  const percent = s ? Math.min(100, s.expensePercent) : 0;
  return (
    <Wrap>
      <Cols>
        <Col>
          <Label>
            <ArrowUpRight size={13} strokeWidth={2.4} /> Общий баланс
          </Label>
          <Value>{s ? money(s.totalBalance) : '…'}</Value>
        </Col>
        <Sep />
        <Col>
          <Label>
            <ArrowDownRight size={13} strokeWidth={2.4} /> Расходы за месяц
          </Label>
          <Value $blue>{s ? money(s.monthExpense, { negative: true }) : '…'}</Value>
        </Col>
      </Cols>
      <LimitBar percent={percent} limit={s?.budgetLimit ?? 0} />
      <Caption>
        <SquareCheck size={14} strokeWidth={2.2} />
        {s ? captionFor(s.expensePercent) : 'Загрузка…'}
      </Caption>
    </Wrap>
  );
}

function captionFor(p: number): string {
  if (p < 50) return `${p}% лимита потрачено — выглядит хорошо.`;
  if (p < 80) return `${p}% лимита потрачено — стоит присмотреться.`;
  if (p <= 100) return `${p}% лимита потрачено — пора притормозить.`;
  return `Лимит превышен на ${p - 100}%!`;
}

export function LimitBar({ percent, limit }: { percent: number; limit: number }) {
  return (
    <Bar role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <Fill style={{ width: `${Math.max(percent, 14)}%` }}>{percent}%</Fill>
      <LimitText>{money(limit)}</LimitText>
    </Bar>
  );
}

const Wrap = styled.div`
  margin-top: 26px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Cols = styled.div`
  display: flex;
  align-items: stretch;
  gap: 18px;
`;

const Col = styled.div`
  flex: 1;
  min-width: 0;
`;

const Sep = styled.span`
  width: 1px;
  background: ${colors.lightGreen};
`;

const Label = styled.p`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${colors.dark};
`;

const Value = styled.p<{ $blue?: boolean }>`
  margin-top: 4px;
  font-size: clamp(17px, 5.4vw, 23px);
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ $blue }) => ($blue ? colors.oceanBlue : colors.white)};
`;

const Bar = styled.div`
  position: relative;
  height: 27px;
  border-radius: 14px;
  background: ${colors.honeydew};
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 14px;
  background: ${colors.void};
  color: ${colors.white};
  font-size: 12px;
  display: flex;
  align-items: center;
  padding-left: 16px;
  transition: width 0.6s ease;
`;

const LimitText = styled.span`
  position: absolute;
  right: 16px;
  font-size: 13px;
  font-weight: 500;
  font-style: italic;
`;

const Caption = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;
