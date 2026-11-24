import type { ChartPoint } from '@finwise/shared';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@/theme';
import { shortMoney } from '@/utils/format';
import { T } from './ui';

/* ================= Столбчатая диаграмма ================= */

/** Округляем максимум до «красивого» числа для оси Y */
function niceMax(v: number): number {
  if (v <= 0) return 1000;
  const pow = 10 ** Math.floor(Math.log10(v));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * pow;
}

/** Доходы (зелёные) и расходы (синие) столбиками, как в разделе «Анализ» */
export function BarChart({ points, height = 150 }: { points: ChartPoint[]; height?: number }) {
  const max = niceMax(Math.max(...points.map((p) => Math.max(p.income, p.expense)), 0));
  const ticks = [max, (max * 2) / 3, max / 3, 0];

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <View style={{ height, justifyContent: 'space-between', minWidth: 30, marginTop: -6 }}>
        {ticks.map((t) => (
          <T key={t} size={10} color={colors.lightBlue} style={{ textAlign: 'right' }}>
            {shortMoney(t)}
          </T>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' }}>
          {ticks.map((t, i) => (
            <View key={t} style={[s.grid, { top: `${(i / 3) * 100}%` }]} />
          ))}
          {points.map((p) => (
            <View key={p.label} style={{ height: '100%', flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
              <View style={[s.bar, { backgroundColor: colors.primary, height: `${(p.income / max) * 100}%` }]} />
              <View style={[s.bar, { backgroundColor: colors.oceanBlue, height: `${(p.expense / max) * 100}%` }]} />
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }}>
          {points.map((p) => (
            <T key={p.label} size={10}>
              {p.label}
            </T>
          ))}
        </View>
      </View>
    </View>
  );
}

/* ================= Карточка графика ================= */

export function ChartCard({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <View style={s.card}>
      <View style={s.cardHead}>
        <T size={15} weight="semibold">
          {title}
        </T>
        <View style={{ flexDirection: 'row', gap: 8 }}>{actions}</View>
      </View>
      {children}
    </View>
  );
}

export function SmallIconButton({ onPress, label, children }: { onPress: () => void; label: string; children: ReactNode }) {
  return (
    <Pressable style={s.smallBtn} onPress={onPress} accessibilityLabel={label} accessibilityRole="button">
      {children}
    </Pressable>
  );
}

/* ================= Круговой прогресс ================= */

export function Ring({
  percent,
  size = 72,
  stroke = 4,
  track = colors.white,
  color = colors.oceanBlue,
  children,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  track?: string;
  color?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, percent));
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(c * p) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>{children}</View>
    </View>
  );
}

/* ================= Круговая диаграмма ================= */

export const PIE_COLORS = [colors.oceanBlue, colors.lightBlue, colors.vividBlue, colors.primary, colors.dark, '#9AD7FF'];

export function PieChart({ parts, size = 200 }: { parts: { label: string; value: number }[]; size?: number }) {
  const total = parts.reduce((sum, p) => sum + p.value, 0);
  if (total === 0) return null;
  const r = size / 2;
  let angle = -Math.PI / 2;

  return (
    <Svg width={size} height={size}>
      {parts.map((p, i) => {
        const share = p.value / total;
        const start = angle;
        const end = angle + share * Math.PI * 2;
        angle = end;
        const mid = (start + end) / 2;
        const color = PIE_COLORS[i % PIE_COLORS.length];
        const label = (
          <SvgText
            x={r + Math.cos(mid) * r * 0.62}
            y={r + Math.sin(mid) * r * 0.62 + 5}
            fill={colors.white}
            fontSize={13}
            fontFamily={fonts.semibold}
            textAnchor="middle"
          >
            {`${Math.round(share * 100)}%`}
          </SvgText>
        );
        if (share >= 0.999) {
          return (
            <G key={p.label}>
              <Circle cx={r} cy={r} r={r} fill={color} />
              {label}
            </G>
          );
        }
        const large = end - start > Math.PI ? 1 : 0;
        const d = [
          `M ${r} ${r}`,
          `L ${r + Math.cos(start) * r} ${r + Math.sin(start) * r}`,
          `A ${r} ${r} 0 ${large} 1 ${r + Math.cos(end) * r} ${r + Math.sin(end) * r}`,
          'Z',
        ].join(' ');
        return (
          <G key={p.label}>
            <Path d={d} fill={color} stroke={colors.honeydew} strokeWidth={2} />
            {share > 0.06 && label}
          </G>
        );
      })}
    </Svg>
  );
}

const s = StyleSheet.create({
  grid: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: colors.lightBlue, opacity: 0.6 },
  bar: { width: 7, minHeight: 2, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  card: { backgroundColor: colors.lightGreen, borderRadius: 40, padding: 22, paddingBottom: 18 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  smallBtn: { width: 32, height: 30, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
