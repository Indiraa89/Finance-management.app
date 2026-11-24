import { Eye, EyeOff } from 'lucide-react';
import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { colors, fonts, radius } from '@/theme';

/* ================= Кнопки ================= */

type Variant = 'primary' | 'secondary' | 'dark' | 'danger' | 'blue';

const variants: Record<Variant, ReturnType<typeof css>> = {
  primary: css`
    background: ${colors.primary};
    color: ${colors.dark};
  `,
  secondary: css`
    background: ${colors.lightGreen};
    color: ${colors.dark};
  `,
  dark: css`
    background: ${colors.dark};
    color: ${colors.white};
  `,
  danger: css`
    background: ${colors.danger};
    color: ${colors.white};
  `,
  blue: css`
    background: ${colors.oceanBlue};
    color: ${colors.white};
  `,
};

export const Button = styled.button<{ $variant?: Variant; $block?: boolean; $small?: boolean }>`
  ${({ $variant = 'primary' }) => variants[$variant]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: ${({ $small }) => ($small ? '140px' : '207px')};
  width: ${({ $block }) => ($block ? '100%' : 'auto')};
  height: ${({ $small }) => ($small ? '36px' : '45px')};
  padding: 0 24px;
  border-radius: ${radius.pill};
  font-family: ${fonts.main};
  font-weight: 600;
  font-size: ${({ $small }) => ($small ? '14px' : '18px')};
  transition:
    transform 0.1s,
    filter 0.2s;

  &:hover:not(:disabled) {
    filter: brightness(0.96);
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  &:disabled {
    opacity: 0.55;
    cursor: default;
  }
`;

export const TextLink = styled.button`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.dark};
  &:hover {
    text-decoration: underline;
  }
`;

export const Stack = styled.div<{ $gap?: number; $center?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 16 }) => $gap}px;
  ${({ $center }) =>
    $center &&
    css`
      align-items: center;
      text-align: center;
    `}
`;

export const Row = styled.div<{ $gap?: number; $between?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $gap = 12 }) => $gap}px;
  ${({ $between }) => $between && 'justify-content: space-between;'}
`;

/* ================= Поля ввода ================= */

const Label = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: ${colors.dark};
  margin: 0 0 8px 14px;
`;

const InputBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const inputStyles = css`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: ${radius.field};
  padding: 0 46px 0 20px;
  background: ${colors.lightGreen};
  font-size: 15px;
  color: ${colors.dark};
  outline: none;

  &::placeholder {
    color: rgba(9, 48, 48, 0.45);
  }
  &:focus {
    box-shadow: 0 0 0 2px ${colors.primary};
  }
`;

const Input = styled.input`
  ${inputStyles};
`;

const Trailing = styled.button`
  position: absolute;
  right: 14px;
  display: grid;
  place-items: center;
  color: ${colors.dark};
`;

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  trailing?: ReactNode;
}

export function TextField({ label, trailing, id, ...rest }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <InputBox>
        <Input id={inputId} {...rest} />
        {trailing && <Trailing as="span">{trailing}</Trailing>}
      </InputBox>
    </div>
  );
}

export function PasswordField({ label, id, placeholder, ...rest }: Omit<FieldProps, 'type' | 'trailing'>) {
  const [visible, setVisible] = useState(false);
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <InputBox>
        <Input
          {...rest}
          id={inputId}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder ?? '● ● ● ● ● ● ● ●'}
        />
        <Trailing
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {visible ? <Eye size={20} /> : <EyeOff size={20} />}
        </Trailing>
      </InputBox>
    </div>
  );
}

const SelectEl = styled.select`
  ${inputStyles};
  appearance: none;
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, ${colors.primary} 50%),
    linear-gradient(135deg, ${colors.primary} 50%, transparent 50%);
  background-position:
    calc(100% - 22px) 19px,
    calc(100% - 16px) 19px;
  background-size: 6px 6px;
  background-repeat: no-repeat;
`;

export function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder,
}: {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <SelectEl id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </SelectEl>
    </div>
  );
}

const Area = styled.textarea`
  ${inputStyles};
  height: 140px;
  padding: 14px 20px;
  resize: none;
`;

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Area id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ================= Сообщения ================= */

export const ErrorText = styled.p`
  color: ${colors.danger};
  font-size: 13px;
  text-align: center;
`;

export const Hint = styled.p`
  font-size: 12px;
  line-height: 1.5;
  color: ${colors.muted};
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

export const Spinner = styled.div<{ $size?: number }>`
  width: ${({ $size = 28 }) => $size}px;
  height: ${({ $size = 28 }) => $size}px;
  border-radius: 50%;
  border: 3px solid ${colors.lightGreen};
  border-top-color: ${colors.primary};
  animation: ${spin} 0.8s linear infinite;
  margin: 24px auto;
`;

export const Empty = styled.p`
  text-align: center;
  color: ${colors.muted};
  font-size: 14px;
  padding: 24px 0;
`;

/** Показ состояния запроса: загрузка / ошибка / данные */
export function Loadable<T>({
  query,
  children,
}: {
  query: { data: T | undefined; isLoading: boolean; error: unknown };
  children: (data: T) => ReactNode;
}) {
  if (query.isLoading) return <Spinner />;
  if (query.error)
    return <ErrorText>{query.error instanceof Error ? query.error.message : 'Ошибка загрузки'}</ErrorText>;
  if (query.data === undefined) return null;
  return <>{children(query.data)}</>;
}

/* ================= Переключатель ================= */

const ToggleTrack = styled.button<{ $on: boolean }>`
  width: 44px;
  height: 26px;
  flex: none;
  border-radius: 13px;
  background: ${({ $on }) => ($on ? colors.primary : colors.lightGreen)};
  position: relative;
  transition: background 0.2s;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? '21px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${colors.white};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: left 0.2s;
  }
`;

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <ToggleTrack
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      $on={checked}
      onClick={() => onChange(!checked)}
    />
  );
}

/* ================= Сегменты (День/Неделя/Месяц/Год) ================= */

const SegWrap = styled.div`
  display: flex;
  background: ${colors.lightGreen};
  border-radius: 22px;
  padding: 6px;
  gap: 4px;
`;

const Seg = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 38px;
  border-radius: 19px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  background: ${({ $active }) => ($active ? colors.primary : 'transparent')};
  transition: background 0.2s;
`;

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <SegWrap role="tablist">
      {options.map((o) => (
        <Seg
          key={o.value}
          role="tab"
          aria-selected={o.value === value}
          $active={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </Seg>
      ))}
    </SegWrap>
  );
}

/* ================= Прочее ================= */

export const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.dark};
`;

export const VDivider = styled.span`
  width: 1px;
  align-self: stretch;
  background: ${colors.primary};
  flex: none;
`;
