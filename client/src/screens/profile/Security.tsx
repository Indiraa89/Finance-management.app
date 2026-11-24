import { Screen } from '@/components/Screen';
import { SectionTitle } from '@/components/ui';
import { useNav } from '@/navigation/types';
import { Menu, MenuRow } from './common';

/** 9.5. Безопасность */
export function Security() {
  const navigation = useNav();
  return (
    <Screen tab="Profile" back title="Безопасность">
      <SectionTitle size={18} style={{ marginBottom: 20 }}>
        Безопасность
      </SectionTitle>
      <Menu>
        <MenuRow label="Сменить PIN" chevron onPress={() => navigation.navigate('ChangePin')} />
        <MenuRow label="Отпечаток пальца" chevron onPress={() => navigation.navigate('Fingerprints')} />
        <MenuRow label="Условия использования" chevron onPress={() => navigation.navigate('Terms')} />
      </Menu>
    </Screen>
  );
}
