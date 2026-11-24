import type { AppNotification, NotificationKind } from '@finwise/shared';
import { BadgeDollarSign, Bell, RefreshCw, TrendingDown, type LucideIcon } from 'lucide-react';
import styled from 'styled-components';
import { Screen } from '@/components/Screen';
import { Empty, Loadable, Row, TextLink } from '@/components/ui';
import { useMarkAllRead, useMarkNotificationRead, useNotifications } from '@/hooks/queries';
import { colors } from '@/theme';
import { timeAndDate } from '@/utils/format';

const icons: Record<NotificationKind, LucideIcon> = {
  reminder: Bell,
  update: RefreshCw,
  transaction: BadgeDollarSign,
  expense: TrendingDown,
};

function groupTitle(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 86_400_000);
  if (diff <= 0) return 'Сегодня';
  if (diff === 1) return 'Вчера';
  if (diff < 7) return 'На этой неделе';
  return 'Ранее';
}

function group(list: AppNotification[]) {
  const out: { title: string; items: AppNotification[] }[] = [];
  for (const n of list) {
    const title = groupTitle(n.date);
    const g = out.find((x) => x.title === title);
    if (g) g.items.push(n);
    else out.push({ title, items: [n] });
  }
  return out;
}

/** 5.1-A. Уведомления */
export function Notifications() {
  const notifications = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllRead();

  return (
    <Screen nav back title="Уведомления" bell={false} sheetPadding="30px 28px 140px">
      <Loadable query={notifications}>
        {(list) =>
          list.length === 0 ? (
            <Empty>Уведомлений пока нет</Empty>
          ) : (
            <>
              <Row $between style={{ marginBottom: 6 }}>
                <span />
                <TextLink onClick={() => markAll.mutate()}>Прочитать все</TextLink>
              </Row>
              {group(list).map((g) => (
                <section key={g.title}>
                  <GroupTitle>{g.title}</GroupTitle>
                  {g.items.map((n) => {
                    const Icon = icons[n.kind];
                    return (
                      <Item key={n.id} $unread={!n.read} onClick={() => !n.read && markRead.mutate(n.id)}>
                        <IconBox>
                          <Icon size={22} strokeWidth={1.8} />
                        </IconBox>
                        <Body>
                          <b>{n.title}</b>
                          <p>{n.text}</p>
                          <time>{timeAndDate(n.date)}</time>
                        </Body>
                      </Item>
                    );
                  })}
                </section>
              ))}
            </>
          )
        }
      </Loadable>
    </Screen>
  );
}

const GroupTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin: 14px 0 6px;
`;

const Item = styled.button<{ $unread: boolean }>`
  display: flex;
  gap: 14px;
  width: 100%;
  text-align: left;
  padding: 14px 0;
  border-bottom: 1px solid ${colors.primary};
  position: relative;

  &::after {
    content: '';
    display: ${({ $unread }) => ($unread ? 'block' : 'none')};
    position: absolute;
    top: 18px;
    right: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${colors.oceanBlue};
  }
`;

const IconBox = styled.span`
  width: 37px;
  height: 37px;
  border-radius: 13px;
  background: ${colors.primary};
  color: ${colors.dark};
  display: grid;
  place-items: center;
  flex: none;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;

  b {
    font-size: 14px;
    font-weight: 500;
  }
  p {
    font-size: 12px;
    color: ${colors.muted};
  }
  time {
    align-self: flex-end;
    font-size: 12px;
    color: ${colors.oceanBlue};
  }
`;
