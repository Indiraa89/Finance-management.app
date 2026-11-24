import type { AppNotification, NotificationKind } from '@finwise/shared';
import { BadgeDollarSign, Bell, RefreshCw, TrendingDown } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Empty, Loadable, Row, T, TextLink } from '@/components/ui';
import { useMarkAllRead, useMarkNotificationRead, useNotifications } from '@/hooks/queries';
import { colors } from '@/theme';
import { timeAndDate } from '@/utils/format';

const icons: Record<NotificationKind, typeof Bell> = {
  reminder: Bell,
  update: RefreshCw,
  transaction: BadgeDollarSign,
  expense: TrendingDown,
};

function groupTitle(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.floor((today.getTime() - day.getTime()) / 86_400_000);
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
    <Screen tab={null} back title="Уведомления" bell={false} sheetStyle={{ paddingTop: 30, paddingHorizontal: 28 }}>
      <Loadable query={notifications}>
        {(list) =>
          list.length === 0 ? (
            <Empty>Уведомлений пока нет</Empty>
          ) : (
            <View>
              <Row style={{ justifyContent: 'flex-end', marginBottom: 6 }}>
                <TextLink title="Прочитать все" onPress={() => markAll.mutate()} />
              </Row>
              {group(list).map((g) => (
                <View key={g.title}>
                  <T size={14} weight="medium" style={{ marginTop: 14, marginBottom: 6 }}>
                    {g.title}
                  </T>
                  {g.items.map((n) => {
                    const Icon = icons[n.kind];
                    return (
                      <Pressable key={n.id} style={s.item} onPress={() => !n.read && markRead.mutate(n.id)}>
                        <View style={s.iconBox}>
                          <Icon size={22} strokeWidth={1.8} color={colors.dark} />
                        </View>
                        <View style={{ flex: 1, gap: 2 }}>
                          <T size={14} weight="medium">
                            {n.title}
                          </T>
                          <T size={12} color={colors.muted}>
                            {n.text}
                          </T>
                          <T size={12} color={colors.oceanBlue} style={{ alignSelf: 'flex-end' }}>
                            {timeAndDate(n.date)}
                          </T>
                        </View>
                        {!n.read && <View style={s.unread} />}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          )
        }
      </Loadable>
    </Screen>
  );
}

const s = StyleSheet.create({
  item: { flexDirection: 'row', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.primary },
  iconBox: { width: 37, height: 37, borderRadius: 13, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  unread: { position: 'absolute', top: 18, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.oceanBlue },
});
