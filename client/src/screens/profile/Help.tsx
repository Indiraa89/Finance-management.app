import type { FaqItem } from '@finwise/shared';
import { ChevronDown, MessageCircle } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Empty, Loadable, Segmented, Stack, T, TextField } from '@/components/ui';
import { useFaq } from '@/hooks/queries';
import { useNav } from '@/navigation/types';
import { colors } from '@/theme';
import { Menu, MenuRow } from './common';

type Tab = 'faq' | 'contact';
type Group = FaqItem['group'];

/** 9.5. Помощь: вопросы и ответы + связь с поддержкой */
export function Help() {
  const navigation = useNav();
  const faq = useFaq();
  const [tab, setTab] = useState<Tab>('faq');
  const [group, setGroup] = useState<Group>('general');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Screen
      tab="Profile"
      back
      title="Помощь и FAQ"
      top={
        <T size={15} weight="medium" center style={{ marginTop: 16 }}>
          Чем мы можем помочь?
        </T>
      }
    >
      <Stack gap={20}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: 'faq', label: 'Вопросы' },
            { value: 'contact', label: 'Связаться' },
          ]}
        />

        {tab === 'faq' ? (
          <>
            <Segmented
              value={group}
              onChange={setGroup}
              options={[
                { value: 'general', label: 'Общее' },
                { value: 'account', label: 'Аккаунт' },
                { value: 'services', label: 'Сервис' },
              ]}
            />
            <TextField placeholder="Поиск по вопросам" value={search} onChangeText={setSearch} />
            <Loadable query={faq}>
              {(items) => {
                const q = search.trim().toLowerCase();
                const list = items.filter((i) => (q ? `${i.question} ${i.answer}`.toLowerCase().includes(q) : i.group === group));
                if (list.length === 0) return <Empty>Ничего не найдено</Empty>;
                return (
                  <View>
                    {list.map((i) => {
                      const expanded = open === i.id;
                      return (
                        <View key={i.id} style={{ borderBottomWidth: 1, borderBottomColor: colors.lightGreen }}>
                          <Pressable
                            onPress={() => setOpen(expanded ? null : i.id)}
                            accessibilityState={{ expanded }}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}
                          >
                            <T size={14} weight="medium" style={{ flex: 1 }}>
                              {i.question}
                            </T>
                            <View style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
                              <ChevronDown size={18} color={colors.dark} />
                            </View>
                          </Pressable>
                          {expanded && (
                            <T size={13} color={colors.muted} style={{ paddingBottom: 14, lineHeight: 19 }}>
                              {i.answer}
                            </T>
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              }}
            </Loadable>
          </>
        ) : (
          <Menu>
            <MenuRow icon={MessageCircle} label="Онлайн-поддержка" chevron onPress={() => navigation.navigate('SupportChat')} />
          </Menu>
        )}
      </Stack>
    </Screen>
  );
}
