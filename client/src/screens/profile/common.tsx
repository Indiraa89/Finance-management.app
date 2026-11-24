import type { User } from '@finwise/shared';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { colors } from '@/theme';

/** Строка меню профиля: иконка в голубом квадрате + подпись */
export function MenuRow({
  icon: Icon,
  label,
  to,
  onClick,
  trailing,
  chevron = false,
}: {
  icon?: LucideIcon;
  label: string;
  to?: string;
  onClick?: () => void;
  trailing?: ReactNode;
  chevron?: boolean;
}) {
  const inner = (
    <>
      {Icon && (
        <IconBox>
          <Icon size={26} color={colors.white} strokeWidth={1.7} />
        </IconBox>
      )}
      <Label>{label}</Label>
      {trailing}
      {chevron && <ChevronRight size={20} />}
    </>
  );
  if (to) return <RowLink to={to}>{inner}</RowLink>;
  if (onClick) return <RowButton onClick={onClick}>{inner}</RowButton>;
  return <RowDiv>{inner}</RowDiv>;
}

const rowCss = `
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
  text-align: left;
  padding: 6px 0;
`;

const RowLink = styled(Link)`
  ${rowCss}
`;
const RowButton = styled.button`
  ${rowCss}
`;
const RowDiv = styled.div`
  ${rowCss}
`;

const IconBox = styled.span`
  width: 57px;
  height: 53px;
  border-radius: 22px;
  background: ${colors.lightBlue};
  display: grid;
  place-items: center;
  flex: none;
`;

const Label = styled.span`
  flex: 1;
  font-size: 15px;
  font-weight: 500;
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

/** Аватар с инициалами (фото нет — учебный проект) */
export function Avatar({ user, size = 117 }: { user: User | null; size?: number }) {
  const initials = (user?.fullName ?? '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <AvatarCircle style={{ width: size, height: size, background: user?.avatarColor ?? colors.lightBlue, fontSize: size * 0.34 }}>
      {initials}
    </AvatarCircle>
  );
}

const AvatarCircle = styled.div`
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${colors.white};
  font-weight: 600;
  border: 4px solid ${colors.honeydew};
  flex: none;
`;

/** Блок с аватаром, «наезжающим» на шторку (как в макете профиля) */
export function ProfileHead({ user }: { user: User | null }) {
  return (
    <Head>
      <Avatar user={user} />
      <h2>{user?.fullName}</h2>
      <p>
        <b>ID:</b> {user?.id.slice(0, 8).toUpperCase()}
      </p>
    </Head>
  );
}

const Head = styled.div`
  margin-top: -96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 28px;

  h2 {
    font-size: 20px;
    font-weight: 700;
    margin-top: 6px;
  }
  p {
    font-size: 13px;
  }
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
`;
