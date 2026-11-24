import { SendHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/Screen';
import { Loadable, T } from '@/components/ui';
import { useSendSupportMessage, useSupportMessages } from '@/hooks/queries';
import { colors, fonts } from '@/theme';
import { timeAndDate } from '@/utils/format';

/** 9.5. Онлайн-поддержка (чат с ботом на сервере) */
export function SupportChat() {
  const messages = useSupportMessages();
  const send = useSendSupportMessage();
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const submit = () => {
    if (!text.trim()) return;
    send.mutate(text.trim());
    setText('');
  };

  return (
    <Screen
      back
      title="Онлайн-поддержка"
      sheetStyle={{ paddingTop: 28, paddingHorizontal: 22 }}
      floating={
        <View style={[s.composer, { paddingBottom: 16 + insets.bottom, marginBottom: -16 - insets.bottom }]}>
          <TextInput
            placeholder="Напишите сообщение…"
            placeholderTextColor="rgba(9, 48, 48, 0.45)"
            value={text}
            onChangeText={setText}
            onSubmitEditing={submit}
            style={s.input}
          />
          <Pressable style={[s.send, !text.trim() && { opacity: 0.5 }]} onPress={submit} accessibilityLabel="Отправить">
            <SendHorizontal size={20} color={colors.dark} />
          </Pressable>
        </View>
      }
    >
      <Loadable query={messages}>
        {(list) => (
          <View style={{ gap: 12 }}>
            {list.map((m) => {
              const mine = m.from === 'user';
              return (
                <View key={m.id} style={[s.bubble, mine ? s.mine : s.theirs]}>
                  <T size={14} style={{ lineHeight: 20 }}>
                    {m.text}
                  </T>
                  <T size={11} color={colors.muted} style={{ textAlign: 'right', marginTop: 4 }}>
                    {timeAndDate(m.date)}
                  </T>
                </View>
              );
            })}
            {send.isPending && (
              <View style={[s.bubble, s.mine]}>
                <T size={14}>{send.variables}</T>
              </View>
            )}
          </View>
        )}
      </Loadable>
    </Screen>
  );
}

const s = StyleSheet.create({
  bubble: { maxWidth: '80%', paddingVertical: 10, paddingHorizontal: 14 },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: colors.lightGreen,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4,
  },
  composer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 16,
    paddingHorizontal: 22,
    backgroundColor: colors.lightGreen,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 18,
    paddingHorizontal: 20,
    backgroundColor: colors.honeydew,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.dark,
  },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
