import type { FaqItem } from '@finwise/shared';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import styled from 'styled-components';
import { Screen } from '@/components/Screen';
import { Empty, Loadable, Segmented, Stack, inputStyles } from '@/components/ui';
import { useFaq } from '@/hooks/queries';
import { colors } from '@/theme';
import { Menu, MenuRow } from './common';

type Tab = 'faq' | 'contact';
type Group = FaqItem['group'];

/** 9.5. Помощь: вопросы и ответы + связь с поддержкой */
export function Help() {
  const faq = useFaq();
  const [tab, setTab] = useState<Tab>('faq');
  const [group, setGroup] = useState<Group>('general');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Screen
      nav
      back="/profile"
      title="Помощь и FAQ"
      top={<Lead>Чем мы можем помочь?</Lead>}
    >
      <Stack $gap={20}>
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
            <SearchInput placeholder="Поиск по вопросам" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Loadable query={faq}>
              {(items) => {
                const q = search.trim().toLowerCase();
                const list = items.filter((i) =>
                  q ? `${i.question} ${i.answer}`.toLowerCase().includes(q) : i.group === group,
                );
                if (list.length === 0) return <Empty>Ничего не найдено</Empty>;
                return (
                  <div>
                    {list.map((i) => (
                      <Item key={i.id}>
                        <button onClick={() => setOpen(open === i.id ? null : i.id)} aria-expanded={open === i.id}>
                          {i.question}
                          <ChevronDown size={18} style={{ transform: open === i.id ? 'rotate(180deg)' : 'none' }} />
                        </button>
                        {open === i.id && <p>{i.answer}</p>}
                      </Item>
                    ))}
                  </div>
                );
              }}
            </Loadable>
          </>
        ) : (
          <Menu>
            <MenuRow icon={MessageCircle} label="Онлайн-поддержка" to="/profile/help/chat" chevron />
          </Menu>
        )}
      </Stack>
    </Screen>
  );
}

const Lead = styled.p`
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  margin-top: 16px;
`;

const SearchInput = styled.input`
  ${inputStyles};
`;

const Item = styled.div`
  border-bottom: 1px solid ${colors.lightGreen};

  button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 14px 4px;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
  }
  svg {
    flex: none;
    transition: transform 0.2s;
  }
  p {
    padding: 0 4px 14px;
    font-size: 13px;
    line-height: 1.5;
    color: ${colors.muted};
  }
`;
