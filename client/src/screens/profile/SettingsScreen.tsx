import { Bell, KeyRound, UserX } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { useNav } from '@/navigation/types';
import { Menu, MenuRow } from './common';

/** 9.5. Настройки */
export function SettingsScreen() {
  const navigation = useNav();
  return (
    <Screen tab="Profile" back title="Настройки">
      <Menu>
        <MenuRow icon={Bell} label="Уведомления" chevron onPress={() => navigation.navigate('NotificationSettings')} />
        <MenuRow icon={KeyRound} label="Сменить пароль" chevron onPress={() => navigation.navigate('ChangePassword')} />
        <MenuRow icon={UserX} label="Удалить аккаунт" chevron onPress={() => navigation.navigate('DeleteAccount')} />
      </Menu>
    </Screen>
  );
}
