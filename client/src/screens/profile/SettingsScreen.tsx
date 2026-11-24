import { Bell, KeyRound, UserX } from 'lucide-react';
import { Screen } from '@/components/Screen';
import { Menu, MenuRow } from './common';

/** 9.5. Настройки */
export function SettingsScreen() {
  return (
    <Screen nav back="/profile" title="Настройки">
      <Menu>
        <MenuRow icon={Bell} label="Уведомления" to="/profile/settings/notifications" chevron />
        <MenuRow icon={KeyRound} label="Сменить пароль" to="/profile/settings/password" chevron />
        <MenuRow icon={UserX} label="Удалить аккаунт" to="/profile/settings/delete" chevron />
      </Menu>
    </Screen>
  );
}
