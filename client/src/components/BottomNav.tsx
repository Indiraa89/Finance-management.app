import { ArrowLeftRight, ChartNoAxesColumn, House, Layers, UserRound } from 'lucide-react';
import { NavLink } from 'react-router';
import styled from 'styled-components';
import { colors } from '@/theme';

const items = [
  { to: '/home', label: 'Главная', Icon: House },
  { to: '/analysis', label: 'Анализ', Icon: ChartNoAxesColumn },
  { to: '/transactions', label: 'Транзакции', Icon: ArrowLeftRight },
  { to: '/categories', label: 'Категории', Icon: Layers },
  { to: '/profile', label: 'Профиль', Icon: UserRound },
];

/** Нижнее меню из 5 вкладок (раздел 9 макета) */
export function BottomNav() {
  return (
    <Nav aria-label="Главное меню">
      {items.map(({ to, label, Icon }) => (
        <Item key={to} to={to} aria-label={label} title={label}>
          <Icon size={24} strokeWidth={1.8} />
        </Item>
      ))}
    </Nav>
  );
}

const Nav = styled.nav`
  position: absolute; /* относительно «телефона» (PhoneFrame) */
  z-index: 20;
  left: 0;
  right: 0;
  bottom: 0;
  height: 96px;
  padding: 0 36px 8px;
  background: ${colors.lightGreen};
  border-radius: 56px 56px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -4px 20px rgba(9, 48, 48, 0.05);
`;

const Item = styled(NavLink)`
  width: 56px;
  height: 52px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  color: ${colors.dark};
  transition: background 0.2s;

  &.active {
    background: ${colors.primary};
  }
`;
