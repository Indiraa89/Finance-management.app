import { ArrowLeft, Bell } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import styled, { css } from 'styled-components';
import { useNotifications } from '@/hooks/queries';
import { colors, radius } from '@/theme';
import { BottomNav } from './BottomNav';

interface ScreenProps {
  /** Заголовок в зелёной шапке */
  title?: ReactNode;
  /** Кнопка «назад»: true — назад по истории, строка — конкретный путь */
  back?: boolean | string;
  /** Колокольчик уведомлений справа */
  bell?: boolean;
  /** Своё содержимое шапки вместо заголовка (например, приветствие на Главной) */
  header?: ReactNode;
  /** Содержимое зелёной зоны под заголовком (баланс и т.д.) */
  top?: ReactNode;
  /** Нижнее меню (для экранов-вкладок) */
  nav?: boolean;
  /** Цвет фона шапки */
  tone?: 'green' | 'blue';
  /** Отступы внутри светлой «шторки» */
  sheetPadding?: string;
  children?: ReactNode;
}

/**
 * Каркас почти всех экранов из макета:
 * зелёная шапка → светлая «шторка» со скруглёнными углами → (нижнее меню).
 */
export function Screen({
  title,
  back,
  bell = true,
  header,
  top,
  nav = false,
  tone = 'green',
  sheetPadding,
  children,
}: ScreenProps) {
  return (
    <Scroll $nav={nav}>
      <Top $tone={tone}>
        {header ?? (
          <HeaderRow>
            {back ? <BackButton to={back} /> : <span style={{ width: 32 }} />}
            <Title>{title}</Title>
            {bell ? <BellButton /> : <span style={{ width: 32 }} />}
          </HeaderRow>
        )}
        {top}
      </Top>
      <Sheet $padding={sheetPadding}>{children}</Sheet>
      {nav && <BottomNav />}
    </Scroll>
  );
}

function BackButton({ to }: { to: boolean | string }) {
  const navigate = useNavigate();
  return (
    <IconBtn
      aria-label="Назад"
      onClick={() => (typeof to === 'string' ? navigate(to) : navigate(-1))}
      $plain
    >
      <ArrowLeft size={24} strokeWidth={2.4} color={colors.white} />
    </IconBtn>
  );
}

export function BellButton() {
  const { data } = useNotifications();
  const unread = data?.some((n) => !n.read) ?? false;
  return (
    <IconBtn as={Link} to="/notifications" aria-label="Уведомления">
      <Bell size={17} strokeWidth={2.2} color={colors.dark} />
      {unread && <Dot />}
    </IconBtn>
  );
}

/* Без position: relative — чтобы нижнее меню крепилось к «телефону», а не прокручивалось */
const Scroll = styled.div<{ $nav: boolean }>`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Top = styled.header<{ $tone: 'green' | 'blue' }>`
  background: ${({ $tone }) => ($tone === 'blue' ? colors.oceanBlue : colors.primary)};
  padding: calc(var(--status-h) + 22px) 28px 28px;
  color: ${colors.dark};
  flex: none;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 32px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  flex: 1;
`;

export const IconBtn = styled.button<{ $plain?: boolean }>`
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex: none;
  ${({ $plain }) =>
    !$plain &&
    css`
      background: ${colors.lightGreen};
    `}
`;

const Dot = styled.span`
  position: absolute;
  top: 6px;
  right: 7px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${colors.oceanBlue};
`;

const Sheet = styled.main<{ $padding?: string }>`
  flex: 1 0 auto;
  background: ${colors.honeydew};
  border-radius: ${radius.sheet} ${radius.sheet} 0 0;
  padding: ${({ $padding }) => $padding ?? '36px 24px 140px'};
`;

/** Полностью зелёный экран (сплэш, «Пароль изменён») */
export const FullScreen = styled.div<{ $bg?: string }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
  text-align: center;
  background: ${({ $bg }) => $bg ?? colors.primary};
`;
