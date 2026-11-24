import type { ChartPoint } from '@finwise/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { colors } from '@/theme';
import { shortMoney } from '@/utils/format';

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
export function BarChart({
  points,
  showIncome = true,
  height = 150,
}: {
  points: ChartPoint[];
  showIncome?: boolean;
  height?: number;
}) {
  const max = niceMax(
    Math.max(...points.map((p) => Math.max(showIncome ? p.income : 0, p.expense)), 0),
  );
  const ticks = [max, (max * 2) / 3, max / 3, 0];

  return (
    <Chart>
      <YAxis style={{ height }}>
        {ticks.map((t) => (
          <span key={t}>{shortMoney(t)}</span>
        ))}
      </YAxis>
      <Plot>
        <Bars style={{ height }}>
          {ticks.map((t, i) => (
            <GridLine key={t} style={{ top: `${(i / 3) * 100}%` }} />
          ))}
          {points.map((p) => (
            <Group key={p.label} title={`${p.label}: доход ${shortMoney(p.income)}, расход ${shortMoney(p.expense)}`}>
              {showIncome && <Bar $color={colors.primary} style={{ height: `${(p.income / max) * 100}%` }} />}
              <Bar $color={colors.oceanBlue} style={{ height: `${(p.expense / max) * 100}%` }} />
            </Group>
          ))}
        </Bars>
        <XAxis>
          {points.map((p) => (
            <span key={p.label}>{p.label}</span>
          ))}
        </XAxis>
      </Plot>
    </Chart>
  );
}

const Chart = styled.div`
  display: flex;
  gap: 8px;
`;

const YAxis = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 11px;
  color: ${colors.lightBlue};
  text-align: right;
  min-width: 28px;
  transform: translateY(-6px);
`;

const Plot = styled.div`
  flex: 1;
  min-width: 0;
`;

const Bars = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
`;

const GridLine = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed ${colors.lightBlue};
  opacity: 0.6;
`;

const Group = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: flex-end;
  gap: 3px;
`;

const Bar = styled.span<{ $color: string }>`
  width: 7px;
  min-height: 2px;
  border-radius: 6px 6px 2px 2px;
  background: ${({ $color }) => $color};
  transition: height 0.5s ease;
`;

const XAxis = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
  font-size: 11px;
  color: ${colors.dark};
`;

/* ================= Карточка графика ================= */

export function ChartCard({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHead>
        <h3>{title}</h3>
        <div style={{ display: 'flex', gap: 8 }}>{actions}</div>
      </CardHead>
      {children}
    </Card>
  );
}

export const SmallIconButton = styled.button`
  width: 32px;
  height: 30px;
  border-radius: 10px;
  background: ${colors.primary};
  display: grid;
  place-items: center;
  color: ${colors.dark};
`;

const Card = styled.section`
  background: ${colors.lightGreen};
  border-radius: 40px;
  padding: 22px 22px 18px;
`;

const CardHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;

  h3 {
    font-size: 15px;
    font-weight: 600;
  }
`;

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
    <RingBox style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(c * p) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <RingCenter>{children}</RingCenter>
    </RingBox>
  );
}

const RingBox = styled.div`
  position: relative;
  flex: none;
`;

const RingCenter = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
`;

/* ================= Круговая диаграмма ================= */

export const PIE_COLORS = [colors.oceanBlue, colors.lightBlue, colors.vividBlue, colors.primary, colors.dark, '#9AD7FF'];

export function PieChart({ parts, size = 200 }: { parts: { label: string; value: number }[]; size?: number }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const r = size / 2;
  let angle = -Math.PI / 2;

  if (total === 0) return null;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Расходы по категориям">
      {parts.map((p, i) => {
        const share = p.value / total;
        const start = angle;
        const end = angle + share * Math.PI * 2;
        angle = end;
        const mid = (start + end) / 2;
        const color = PIE_COLORS[i % PIE_COLORS.length];
        const label = (
          <text
            x={r + Math.cos(mid) * r * 0.62}
            y={r + Math.sin(mid) * r * 0.62}
            fill={colors.white}
            fontSize={13}
            fontWeight={600}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {Math.round(share * 100)}%
          </text>
        );
        if (share >= 0.999) {
          return (
            <g key={p.label}>
              <circle cx={r} cy={r} r={r} fill={color} />
              {label}
            </g>
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
          <g key={p.label}>
            <path d={d} fill={color} stroke={colors.honeydew} strokeWidth={2} />
            {share > 0.06 && label}
          </g>
        );
      })}
    </svg>
  );
}
