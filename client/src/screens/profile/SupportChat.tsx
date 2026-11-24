import { SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import styled from 'styled-components';
import { Screen } from '@/components/Screen';
import { Loadable, inputStyles } from '@/components/ui';
import { useSendSupportMessage, useSupportMessages } from '@/hooks/queries';
import { colors } from '@/theme';
import { timeAndDate } from '@/utils/format';

/** 9.5. Онлайн-поддержка (чат с ботом на сервере) */
export function SupportChat() {
  const messages = useSupportMessages();
  const send = useSendSupportMessage();
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.data?.length]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    send.mutate(text.trim());
    setText('');
  };

  return (
    <Screen back="/profile/help" title="Онлайн-поддержка" sheetPadding="28px 22px 120px">
      <Loadable query={messages}>
        {(list) => (
          <Thread>
            {list.map((m) => (
              <Bubble key={m.id} $mine={m.from === 'user'}>
                <p>{m.text}</p>
                <time>{timeAndDate(m.date)}</time>
              </Bubble>
            ))}
            {send.isPending && (
              <Bubble $mine>
                <p>{send.variables}</p>
              </Bubble>
            )}
            <div ref={endRef} />
          </Thread>
        )}
      </Loadable>
      <Composer onSubmit={submit}>
        <input placeholder="Напишите сообщение…" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit" aria-label="Отправить" disabled={!text.trim()}>
          <SendHorizontal size={20} />
        </button>
      </Composer>
    </Screen>
  );
}

const Thread = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Bubble = styled.div<{ $mine: boolean }>`
  max-width: 80%;
  align-self: ${({ $mine }) => ($mine ? 'flex-end' : 'flex-start')};
  background: ${({ $mine }) => ($mine ? colors.primary : colors.lightGreen)};
  border-radius: ${({ $mine }) => ($mine ? '20px 20px 4px 20px' : '20px 20px 20px 4px')};
  padding: 10px 14px;

  p {
    font-size: 14px;
    line-height: 1.4;
  }
  time {
    display: block;
    margin-top: 4px;
    font-size: 11px;
    opacity: 0.7;
    text-align: right;
  }
`;

const Composer = styled.form`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  padding: 16px 22px 22px;
  background: ${colors.lightGreen};
  border-radius: 30px 30px 0 0;
  display: flex;
  gap: 10px;

  input {
    ${inputStyles};
    background: ${colors.honeydew};
    padding-right: 20px;
  }
  button {
    width: 44px;
    height: 44px;
    flex: none;
    border-radius: 50%;
    background: ${colors.primary};
    display: grid;
    place-items: center;
  }
  button:disabled {
    opacity: 0.5;
  }
`;
