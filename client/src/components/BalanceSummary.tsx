import type { Summary } from '@finwise/shared';
import { ArrowDownRight, ArrowUpRight, SquareCheck } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { money } from '@/utils/format';
import { Row, T } from './ui';

/** Блок из шапки: «Общий баланс / Расходы за месяц» + полоса лимита */
export function BalanceSummary({ summary }: { summary: Summary | undefined }) {
  const percent = summary ? Math.min(100, summary.expensePercent) : 0;
  return (
    <View style={{ marginTop: 26, gap: 14 }}>
      <View style={{ flexDirection: 'row', gap: 18 }}>
        <View style={{ flex: 1 }}>
          <Row gap={5}>
            <ArrowUpRight size={13} strokeWidth={2.4} color={colors.dark} />
            <T size={12}>Общий баланс</T>
          </Row>
          <T size={21} weight="bold" color={colors.white} numberOfLines={1} adjustsFontSizeToFit style={{ marginTop: 4 }}>
            {summary ? money(summary.totalBalance) : '…'}
          </T>
        </View>
        <View style={{ width: 1, backgroundColor: colors.lightGreen }} />
        <View style={{ flex: 1 }}>
          <Row gap={5}>
            <ArrowDownRight size={13} strokeWidth={2.4} color={colors.dark} />
            <T size={12}>Расходы за месяц</T>
          </Row>
          <T size={21} weight="bold" color={colors.oceanBlue} numberOfLines={1} adjustsFontSizeToFit style={{ marginTop: 4 }}>
            {summary ? money(summary.monthExpense, { negative: true }) : '…'}
          </T>
        </View>
      </View>
      <LimitBar percent={percent} limit={summary?.budgetLimit ?? 0} />
      <Row gap={8}>
        <SquareCheck size={14} strokeWidth={2.2} color={colors.dark} />
        <T size={13} style={{ flex: 1 }}>
          {summary ? captionFor(summary.expensePercent) : 'Загрузка…'}
        </T>
      </Row>
    </View>
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
    <View style={s.bar} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: percent }}>
      <View style={[s.fill, { width: `${Math.max(percent, 14)}%` }]}>
        <T size={12} color={colors.white}>
          {percent}%
        </T>
      </View>
      <T size={13} weight="medium" style={s.limit}>
        {money(limit)}
      </T>
    </View>
  );
}

const s = StyleSheet.create({
  bar: { height: 27, borderRadius: 14, backgroundColor: colors.honeydew, overflow: 'hidden', justifyContent: 'center' },
  fill: { height: '100%', borderRadius: 14, backgroundColor: colors.void, justifyContent: 'center', paddingLeft: 16 },
  limit: { position: 'absolute', right: 16, fontStyle: 'italic' },
});
