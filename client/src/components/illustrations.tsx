import { Fingerprint } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { colors } from '@/theme';
import { T } from './ui';

/** Логотип FinWise: столбики графика и стрелка вверх */
export function LogoMark({ color = colors.dark, size = 110 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 110 88" fill="none">
      <G stroke={color} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
        <Rect x="12" y="62" width="14" height="22" rx="2" />
        <Rect x="38" y="50" width="14" height="34" rx="2" />
        <Rect x="64" y="56" width="14" height="28" rx="2" />
        <Rect x="90" y="38" width="14" height="46" rx="2" />
        <Path d="M6 44 L32 22 L52 34 L84 8" />
        <Path d="M70 6 L86 6 L86 22" />
      </G>
    </Svg>
  );
}

export function Logo({ color = colors.white, markColor = colors.dark }: { color?: string; markColor?: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 10 }}>
      <LogoMark color={markColor} />
      <T size={50} weight="semibold" color={color}>
        FinWise
      </T>
    </View>
  );
}

/** Светло-зелёный круг под иллюстрацией онбординга */
export function IllustrationCircle({ size = 248, bg = colors.lightGreen, children }: { size?: number; bg?: string; children: ReactNode }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </View>
  );
}

function Coin({ x, y, r, tilt }: { x: number; y: number; r: number; tilt: number }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <Ellipse rx={r} ry={r * 0.62} fill="#E3A21A" />
      <Ellipse rx={r} ry={r * 0.62} cy={-4} fill="#FFD25C" />
      <Ellipse rx={r * 0.62} ry={r * 0.36} cy={-4} fill="none" stroke="#E3A21A" strokeWidth={2} />
    </G>
  );
}

/** Иллюстрация онбординга 1: монеты падают в ладонь */
export function CoinsHand() {
  return (
    <Svg width={230} height={212} viewBox="0 0 250 230">
      <Coin x={118} y={36} r={18} tilt={-12} />
      <Coin x={76} y={84} r={16} tilt={18} />
      <Coin x={140} y={96} r={17} tilt={-24} />
      <Coin x={96} y={130} r={15} tilt={10} />
      <Path d="M250 150 L190 146 Q182 170 190 192 L250 196 Z" fill="#3A7BD5" />
      <Path d="M190 146 Q180 170 190 192" stroke="#2C62AE" strokeWidth={6} fill="none" />
      <Path
        d="M192 152 Q150 140 112 150 Q80 158 58 166 Q46 172 54 180 Q64 186 92 182 L120 180 Q150 196 192 190 Z"
        fill="#F3C9A8"
      />
      <Path d="M92 182 Q110 176 128 178" stroke="#E2A983" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Coin x={120} y={160} r={15} tilt={4} />
    </Svg>
  );
}

/** Иллюстрация онбординга 2: телефон в руке */
export function PhoneHand() {
  return (
    <Svg width={220} height={220} viewBox="0 0 230 230">
      <Path d="M40 230 L52 168 Q60 150 78 156 L96 166 L96 230 Z" fill="#3A7BD5" />
      <Rect x="74" y="34" width="84" height="150" rx="14" fill={colors.dark} />
      <Rect x="80" y="42" width="72" height="134" rx="10" fill={colors.honeydew} />
      <Rect x="86" y="50" width="60" height="30" rx="6" fill={colors.primary} />
      <Rect x="86" y="88" width="60" height="10" rx="5" fill={colors.lightGreen} />
      <Rect x="86" y="104" width="44" height="10" rx="5" fill={colors.lightGreen} />
      <Circle cx="116" cy="146" r="16" fill={colors.primary} />
      <Path d="M108 146 L114 152 L125 140" stroke={colors.white} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M70 120 Q60 140 66 166 Q74 184 98 180 L100 150 Q96 130 84 120 Z" fill="#F3C9A8" />
      <Path d="M230 200 L176 170 Q160 160 150 150 Q144 142 152 140 L190 158 L230 168 Z" fill="#F3C9A8" />
      <Path d="M230 168 L200 160 L196 196 L230 214 Z" fill="#3A7BD5" />
    </Svg>
  );
}

/** Большой отпечаток в зелёном круге */
export function FingerprintBadge() {
  return (
    <IllustrationCircle size={180} bg={colors.primary}>
      <Fingerprint size={110} color={colors.white} strokeWidth={1.3} />
    </IllustrationCircle>
  );
}

/** Кольцо с точкой — экран «успешно» */
export function SuccessRing() {
  return (
    <Svg width={148} height={148} viewBox="0 0 148 148">
      <Circle cx="74" cy="74" r="66" fill="none" stroke={colors.honeydew} strokeWidth="6" />
      <Circle cx="74" cy="74" r="9" fill={colors.honeydew} />
    </Svg>
  );
}
