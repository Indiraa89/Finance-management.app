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
} from 'lucide-react-native';
import { View } from 'react-native';
import type { IconKey } from '@finwise/shared';
import { colors } from '@/theme';

export const ICONS: Record<IconKey, typeof Coins> = {
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
  size = 46,
  bg,
  radius = 16,
  color = colors.white,
}: {
  icon: IconKey;
  size?: number;
  bg?: string;
  radius?: number;
  color?: string;
}) {
  const Icon = ICONS[icon] ?? Coins;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: bg ?? tone[icon] ?? colors.lightBlue,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={size * 0.48} color={color} strokeWidth={1.8} />
    </View>
  );
}
