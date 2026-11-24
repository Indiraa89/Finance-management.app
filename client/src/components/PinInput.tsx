import { useState } from 'react';
import styled from 'styled-components';
import { colors } from '@/theme';

/**
 * 6 кружков для ввода PIN-кода или кода из «письма».
 * Под кружками лежит одно настоящее поле ввода — так работают вставка,
 * удаление и автозаполнение кода на телефоне.
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
  const [focused, setFocused] = useState(false);
  return (
    <Wrap>
      <Hidden
        aria-label={label}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, length))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {Array.from({ length }, (_, i) => (
        <Cell key={i} $active={focused && i === Math.min(value.length, length - 1)} aria-hidden>
          {value[i] ? (secret ? '●' : value[i]) : ''}
        </Cell>
      ))}
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const Hidden = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  font-size: 16px; /* чтобы iOS не увеличивал страницу */
`;

const Cell = styled.span<{ $active: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid ${colors.primary};
  display: grid;
  place-items: center;
  font-size: 15px;
  font-weight: 600;
  background: ${({ $active }) => ($active ? colors.lightGreen : 'transparent')};
  pointer-events: none;
`;
