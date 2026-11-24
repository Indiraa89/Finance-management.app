import type { User } from '@finwise/shared';
import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { T } from '@/components/ui';
import { colors } from '@/theme';

type Icon = typeof ChevronRight;

/** Строка меню профиля: иконка в голубом квадрате + подпись */
export function MenuRow({
  icon: IconCmp,
  label,
  onPress,
  chevron = false,
}: {
  icon?: Icon;
  label: string;
  onPress: () => void;
  chevron?: boolean;
}) {
  return (
    <Pressable style={s.row} onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      {IconCmp && (
        <View style={s.iconBox}>
          <IconCmp size={26} color={colors.white} strokeWidth={1.7} />
        </View>
      )}
      <T size={15} weight="medium" style={{ flex: 1 }}>
        {label}
      </T>
      {chevron && <ChevronRight size={20} color={colors.dark} />}
    </Pressable>
  );
}

export const Menu = ({ children }: { children: ReactNode }) => <View style={{ gap: 18 }}>{children}</View>;

/** Аватар с инициалами (фото нет — учебный проект) */
export function Avatar({ user, size = 117 }: { user: User | null; size?: number }) {
  const initials = (user?.fullName ?? '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View
      style={[
        s.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: user?.avatarColor ?? colors.lightBlue },
      ]}
    >
      <T size={size * 0.34} weight="semibold" color={colors.white}>
        {initials}
      </T>
    </View>
  );
}

/** Блок с аватаром, «наезжающим» на шторку (как в макете профиля) */
export function ProfileHead({ user }: { user: User | null }) {
  return (
    <View style={{ marginTop: -96, alignItems: 'center', gap: 4, marginBottom: 28 }}>
      <Avatar user={user} />
      <T size={20} weight="bold" style={{ marginTop: 6 }}>
        {user?.fullName}
      </T>
      <T size={13}>
        <T size={13} weight="bold">
          ID:
        </T>{' '}
        {user?.id.slice(0, 8).toUpperCase()}
      </T>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 18, paddingVertical: 6 },
  iconBox: { width: 57, height: 53, borderRadius: 22, backgroundColor: colors.lightBlue, alignItems: 'center', justifyContent: 'center' },
  avatar: { alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.honeydew },
});
