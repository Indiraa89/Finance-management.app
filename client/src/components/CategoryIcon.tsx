import {
  Banknote,
  Bus,
  Car,
  Clapperboard,
  Coins,
  Dumbbell,
  Gem,
  Gift,
  GraduationCap,
  House,
  KeyRound,
  PawPrint,
  PiggyBank,
  Pill,
  Plane,
  ShoppingBag,
  ShoppingBasket,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import type { IconKey } from '@finwise/shared';
import styled from 'styled-components';
import { colors } from '@/theme';

export const ICONS: Record<IconKey, LucideIcon> = {
  salary: Banknote,
  food: UtensilsCrossed,
  transport: Bus,
  medicine: Pill,
  groceries: ShoppingBasket,
  rent: KeyRound,
  gifts: Gift,
  savings: PiggyBank,
  entertainment: Clapperboard,
  travel: Plane,
  house: House,
  car: Car,
  wedding: Gem,
  other: Coins,
  education: GraduationCap,
  sport: Dumbbell,
  shopping: ShoppingBag,
  pets: PawPrint,
};

export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

/** Цвет кружка как в макете: голубые оттенки */
const tone: Partial<Record<IconKey, string>> = {
  salary: colors.lightBlue,
  rent: colors.oceanBlue,
  groceries: colors.vividBlue,
  food: colors.lightBlue,
  transport: colors.vividBlue,
  savings: colors.oceanBlue,
};

export function CategoryIcon({
  icon,
  size = 52,
  bg,
  radius = 18,
}: {
  icon: IconKey;
  size?: number;
  bg?: string;
  radius?: number;
}) {
  const Icon = ICONS[icon] ?? Coins;
  return (
    <Box style={{ width: size, height: size, borderRadius: radius, background: bg ?? tone[icon] ?? colors.lightBlue }}>
      <Icon size={size * 0.48} color={colors.white} strokeWidth={1.8} />
    </Box>
  );
}

const Box = styled.span`
  display: grid;
  place-items: center;
  flex: none;
`;
