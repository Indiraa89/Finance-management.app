import { Headphones, LogOut, Settings, ShieldCheck, UserRound } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { FullWidth, Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { Button, Hint } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useNav } from '@/navigation/types';
import { Menu, MenuRow, ProfileHead } from './common';

/** 9.5. Профиль */
export function Profile() {
  const { user, logout } = useAuth();
  const navigation = useNav();
  const [confirm, setConfirm] = useState(false);

  return (
    <Screen tab="Profile" back title="Профиль" top={<View style={{ height: 60 }} />}>
      <ProfileHead user={user} />
      <Menu>
        <MenuRow icon={UserRound} label="Редактировать профиль" onPress={() => navigation.navigate('EditProfile')} />
        <MenuRow icon={ShieldCheck} label="Безопасность" onPress={() => navigation.navigate('Security')} />
        <MenuRow icon={Settings} label="Настройки" onPress={() => navigation.navigate('Settings')} />
        <MenuRow icon={Headphones} label="Помощь" onPress={() => navigation.navigate('Help')} />
        <MenuRow icon={LogOut} label="Выйти" onPress={() => setConfirm(true)} />
      </Menu>

      <Modal open={confirm} title="Завершить сеанс" onClose={() => setConfirm(false)}>
        <Hint center>Вы уверены, что хотите выйти из аккаунта?</Hint>
        <FullWidth>
          <Button
            title="Да, выйти"
            block
            onPress={() => {
              setConfirm(false);
              void logout();
            }}
          />
          <Button title="Отмена" variant="secondary" block onPress={() => setConfirm(false)} />
        </FullWidth>
      </Modal>
    </Screen>
  );
}
