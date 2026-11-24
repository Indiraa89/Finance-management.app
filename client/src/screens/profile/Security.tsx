import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/ui';
import { Menu, MenuRow } from './common';

/** 9.5. Безопасность */
export function Security() {
  return (
    <Screen nav back="/profile" title="Безопасность">
      <SectionTitle style={{ fontSize: 18, marginBottom: 20 }}>Безопасность</SectionTitle>
      <Menu>
        <MenuRow label="Сменить PIN" to="/profile/security/pin" chevron />
        <MenuRow label="Отпечаток пальца" to="/profile/security/fingerprints" chevron />
        <MenuRow label="Условия использования" to="/profile/security/terms" chevron />
      </Menu>
    </Screen>
  );
}
