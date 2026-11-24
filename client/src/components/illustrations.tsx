import { Fingerprint } from 'lucide-react';
import styled from 'styled-components';
import { colors } from '@/theme';

/** Логотип FinWise: столбики графика и стрелка вверх */
export function LogoMark({ color = colors.dark, size = 110 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 110 88" fill="none" aria-hidden>
      <g stroke={color} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
        <rect x="12" y="62" width="14" height="22" rx="2" />
        <rect x="38" y="50" width="14" height="34" rx="2" />
        <rect x="64" y="56" width="14" height="28" rx="2" />
        <rect x="90" y="38" width="14" height="46" rx="2" />
        <path d="M6 44 L32 22 L52 34 L84 8" />
        <path d="M70 6 L86 6 L86 22" />
      </g>
    </svg>
  );
}

export function Logo({ color = colors.white, markColor = colors.dark }: { color?: string; markColor?: string }) {
  return (
    <LogoWrap>
      <LogoMark color={markColor} />
      <span style={{ color }}>FinWise</span>
    </LogoWrap>
  );
}

const LogoWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  span {
    font-size: 52px;
    font-weight: 600;
    letter-spacing: -0.5px;
    line-height: 1;
  }
`;

/** Светло-зелёный круг под иллюстрацией онбординга */
export const IllustrationCircle = styled.div<{ $size?: number }>`
  width: ${({ $size = 248 }) => $size}px;
  height: ${({ $size = 248 }) => $size}px;
  border-radius: 50%;
  background: ${colors.lightGreen};
  display: grid;
  place-items: center;
  flex: none;
`;

/** Иллюстрация онбординга 1: монеты падают в ладонь */
export function CoinsHand() {
  const coin = (x: number, y: number, r: number, tilt: number) => (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <ellipse rx={r} ry={r * 0.62} fill="#E3A21A" />
      <ellipse rx={r} ry={r * 0.62} cy={-4} fill="#FFD25C" />
      <ellipse rx={r * 0.62} ry={r * 0.36} cy={-4} fill="none" stroke="#E3A21A" strokeWidth={2} />
    </g>
  );
  return (
    <svg width="250" height="230" viewBox="0 0 250 230" aria-hidden>
      {coin(118, 36, 18, -12)}
      {coin(76, 84, 16, 18)}
      {coin(140, 96, 17, -24)}
      {coin(96, 130, 15, 10)}
      {/* рукав */}
      <path d="M250 150 L190 146 Q182 170 190 192 L250 196 Z" fill="#3A7BD5" />
      <path d="M190 146 Q180 170 190 192" stroke="#2C62AE" strokeWidth={6} fill="none" />
      {/* ладонь */}
      <path
        d="M192 152 Q150 140 112 150 Q80 158 58 166 Q46 172 54 180 Q64 186 92 182 L120 180 Q150 196 192 190 Z"
        fill="#F3C9A8"
      />
      <path d="M92 182 Q110 176 128 178" stroke="#E2A983" strokeWidth={3} fill="none" strokeLinecap="round" />
      {coin(120, 160, 15, 4)}
    </svg>
  );
}

/** Иллюстрация онбординга 2: телефон в руке */
export function PhoneHand() {
  return (
    <svg width="230" height="230" viewBox="0 0 230 230" aria-hidden>
      {/* рука, держащая телефон */}
      <path d="M40 230 L52 168 Q60 150 78 156 L96 166 L96 230 Z" fill="#3A7BD5" />
      <rect x="74" y="34" width="84" height="150" rx="14" fill={colors.dark} />
      <rect x="80" y="42" width="72" height="134" rx="10" fill={colors.honeydew} />
      <rect x="86" y="50" width="60" height="30" rx="6" fill={colors.primary} />
      <rect x="86" y="88" width="60" height="10" rx="5" fill={colors.lightGreen} />
      <rect x="86" y="104" width="44" height="10" rx="5" fill={colors.lightGreen} />
      <circle cx="116" cy="146" r="16" fill={colors.primary} />
      <path d="M108 146 L114 152 L125 140" stroke={colors.white} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path
        d="M70 120 Q60 140 66 166 Q74 184 98 180 L100 150 Q96 130 84 120 Z"
        fill="#F3C9A8"
      />
      {/* указательный палец второй руки */}
      <path d="M230 200 L176 170 Q160 160 150 150 Q144 142 152 140 L190 158 L230 168 Z" fill="#F3C9A8" />
      <path d="M230 168 L200 160 L196 196 L230 214 Z" fill="#3A7BD5" />
    </svg>
  );
}

/** Большой отпечаток в зелёном круге */
export function FingerprintBadge() {
  return (
    <IllustrationCircle $size={180} style={{ background: colors.primary }}>
      <Fingerprint size={110} color={colors.white} strokeWidth={1.3} />
    </IllustrationCircle>
  );
}

/** Кольцо с точкой — экран «успешно» */
export function SuccessRing() {
  return (
    <svg width="148" height="148" viewBox="0 0 148 148" aria-hidden>
      <circle cx="74" cy="74" r="66" fill="none" stroke={colors.honeydew} strokeWidth="6" />
      <circle cx="74" cy="74" r="9" fill={colors.honeydew} />
    </svg>
  );
}
