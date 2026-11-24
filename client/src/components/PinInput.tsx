import { useRef, useState, type ComponentRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors } from '@/theme';
import { T } from './ui';

/**
 * 6 кружков для ввода PIN-кода или кода из «письма».
 * Под кружками лежит одно настоящее поле ввода (невидимое) —
 * так работают клавиатура, вставка и удаление.
 */
export function PinInput({
  value,
  onChange,
  length = 6,
  secret = false,
  label = 'Код',
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  secret?: boolean;
  label?: string;
}) {
  const input = useRef<ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(false);
  return (
    <Pressable onPress={() => input.current?.focus()} accessibilityLabel={label}>
      <View style={s.row}>
        {Array.from({ length }, (_, i) => (
          <View
            key={i}
            style={[s.cell, focused && i === Math.min(value.length, length - 1) && { backgroundColor: colors.lightGreen }]}
          >
            <T size={15} weight="semibold">
              {value[i] ? (secret ? '●' : value[i]) : ''}
            </T>
          </View>
        ))}
      </View>
      <TextInput
        ref={input}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        autoComplete="one-time-code"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        style={s.hidden}
        caretHidden
      />
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  cell: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.01, color: 'transparent' },
});
