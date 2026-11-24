import type { NotificationSettings as NS } from '@finwise/shared';
import { Screen } from '@/components/Screen';
import { Loadable, Stack, Toggle } from '@/components/ui';
import { useSettings, useUpdateSettings } from '@/hooks/queries';
import { ToggleRow } from './common';

const items: { key: keyof NS; label: string }[] = [
  { key: 'general', label: 'Общие уведомления' },
  { key: 'sound', label: 'Звук' },
  { key: 'soundCall', label: 'Звук звонка' },
  { key: 'vibrate', label: 'Вибрация' },
  { key: 'transactionUpdates', label: 'Новые транзакции' },
  { key: 'expenseReminder', label: 'Напоминания о расходах' },
  { key: 'budgetNotifications', label: 'Предупреждения о лимите' },
  { key: 'lowBalance', label: 'Низкий баланс' },
];

/** 9.5. Настройки уведомлений — каждое изменение сразу уходит на сервер */
export function NotificationSettings() {
  const settings = useSettings();
  const update = useUpdateSettings();

  return (
    <Screen nav back="/profile/settings" title="Уведомления">
      <Loadable query={settings}>
        {(s) => (
          <Stack $gap={24}>
            {items.map((i) => (
              <ToggleRow key={i.key}>
                {i.label}
                <Toggle
                  label={i.label}
                  checked={s.notifications[i.key]}
                  onChange={(v) => update.mutate({ notifications: { [i.key]: v } })}
                />
              </ToggleRow>
            ))}
          </Stack>
        )}
      </Loadable>
    </Screen>
  );
}
