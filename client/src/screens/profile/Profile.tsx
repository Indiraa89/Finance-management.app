import { Headphones, LogOut, Settings, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { Button, Hint } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { Menu, MenuRow, ProfileHead } from './common';

/** 9.5. Профиль */
export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  return (
    <Screen nav back="/home" title="Профиль" top={<div style={{ height: 60 }} />}>
      <ProfileHead user={user} />
      <Menu>
        <MenuRow icon={UserRound} label="Редактировать профиль" to="/profile/edit" />
        <MenuRow icon={ShieldCheck} label="Безопасность" to="/profile/security" />
        <MenuRow icon={Settings} label="Настройки" to="/profile/settings" />
        <MenuRow icon={Headphones} label="Помощь" to="/profile/help" />
        <MenuRow icon={LogOut} label="Выйти" onClick={() => setConfirm(true)} />
      </Menu>

      <Modal open={confirm} title="Завершить сеанс" onClose={() => setConfirm(false)}>
        <Hint>Вы уверены, что хотите выйти из аккаунта?</Hint>
        <Button
          onClick={() => {
            logout();
            navigate('/welcome', { replace: true });
          }}
        >
          Да, выйти
        </Button>
        <Button $variant="secondary" onClick={() => setConfirm(false)}>
          Отмена
        </Button>
      </Modal>
    </Screen>
  );
}
