import { Check, ChevronDown, Eye, EyeOff } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Modal as RNModal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors, fonts, radius, type FontWeight } from '@/theme';

/* ================= Текст ================= */

interface TProps extends TextProps {
  size?: number;
  weight?: FontWeight;
  color?: string;
  center?: boolean;
  children?: ReactNode;
}

/** Текст с нашим шрифтом. В React Native весь текст пишется через <Text> */
export function T({ size = 14, weight = 'regular', color = colors.dark, center, style, ...rest }: TProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: fonts[weight], fontSize: size, color }, center && { textAlign: 'center' }, style]}
    />
  );
}

/* ================= Кнопки ================= */

type Variant = 'primary' | 'secondary' | 'dark' | 'danger' | 'blue';

const variantBg: Record<Variant, string> = {
  primary: colors.primary,
  secondary: colors.lightGreen,
  dark: colors.dark,
  danger: colors.danger,
  blue: colors.oceanBlue,
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  small,
  block,
  disabled,
  icon,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  small?: boolean;
  block?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const light = variant === 'primary' || variant === 'secondary';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor: variantBg[variant],
          minWidth: small ? 150 : 210,
          height: small ? 38 : 46,
          alignSelf: block ? 'stretch' : 'center',
          opacity: disabled ? 0.55 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {icon}
      <T size={small ? 14 : 17} weight="semibold" color={light ? colors.dark : colors.white}>
        {title}
      </T>
    </Pressable>
  );
}

export function TextLink({ title, onPress, color = colors.dark }: { title: string; onPress: () => void; color?: string }) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <T size={13} weight="semibold" color={color} center>
        {title}
      </T>
    </Pressable>
  );
}

/* ================= Поля ввода ================= */

export function Label({ children }: { children: ReactNode }) {
  return (
    <T size={15} weight="medium" style={{ marginLeft: 14, marginBottom: 8 }}>
      {children}
    </T>
  );
}

interface FieldProps extends TextInputProps {
  label?: string;
  trailing?: ReactNode;
}

export function TextField({ label, trailing, style, ...rest }: FieldProps) {
  return (
    <View>
      {label && <Label>{label}</Label>}
      <View style={s.inputBox}>
        <TextInput
          placeholderTextColor="rgba(9, 48, 48, 0.45)"
          {...rest}
          style={[s.input, rest.multiline && s.textArea, style as StyleProp<TextStyle>]}
        />
        {trailing && <View style={s.trailing}>{trailing}</View>}
      </View>
    </View>
  );
}

export function PasswordField(props: Omit<FieldProps, 'secureTextEntry' | 'trailing'>) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      placeholder="● ● ● ● ● ● ● ●"
      autoCapitalize="none"
      autoCorrect={false}
      {...props}
      secureTextEntry={!visible}
      trailing={
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={10} accessibilityLabel="Показать пароль">
          {visible ? <Eye size={20} color={colors.dark} /> : <EyeOff size={20} color={colors.dark} />}
        </Pressable>
      }
    />
  );
}

/** Выпадающий список: на телефоне открывается окно со списком вариантов */
export function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder = 'Выберите',
}: {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <View>
      {label && <Label>{label}</Label>}
      <Pressable style={[s.input, s.select]} onPress={() => setOpen(true)} accessibilityRole="button">
        <T size={15} color={current ? colors.dark : 'rgba(9, 48, 48, 0.45)'}>
          {current?.label ?? placeholder}
        </T>
        <ChevronDown size={20} color={colors.primary} />
      </Pressable>
      <RNModal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={s.overlay} onPress={() => setOpen(false)}>
          <View style={s.sheetList}>
            <T size={17} weight="semibold" center style={{ marginBottom: 10 }}>
              {label ?? placeholder}
            </T>
            <ScrollView style={{ maxHeight: 360 }}>
              {options.map((o) => (
                <Pressable
                  key={o.value}
                  style={s.option}
                  onPress={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                >
                  <T size={15}>{o.label}</T>
                  {o.value === value && <Check size={18} color={colors.primary} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </RNModal>
    </View>
  );
}

/* ================= Раскладка ================= */

export function Stack({
  gap = 16,
  center,
  style,
  children,
}: {
  gap?: number;
  center?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return <View style={[{ gap }, center && { alignItems: 'center' }, style]}>{children}</View>;
}

export function Row({
  gap = 12,
  between,
  style,
  children,
}: {
  gap?: number;
  between?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, between && { justifyContent: 'space-between' }, style]}>
      {children}
    </View>
  );
}

export const VDivider = () => <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: colors.primary }} />;

/* ================= Сообщения ================= */

export const ErrorText = ({ children }: { children: ReactNode }) => (
  <T size={13} color={colors.danger} center>
    {children}
  </T>
);

export const Hint = ({ children, center, style }: { children: ReactNode; center?: boolean; style?: StyleProp<TextStyle> }) => (
  <T size={12} color={colors.muted} center={center} style={[{ lineHeight: 18 }, style]}>
    {children}
  </T>
);

export const SectionTitle = ({ children, size = 15, style }: { children: ReactNode; size?: number; style?: StyleProp<TextStyle> }) => (
  <T size={size} weight="semibold" style={style}>
    {children}
  </T>
);

export const Spinner = () => <ActivityIndicator color={colors.primary} size="large" style={{ marginVertical: 24 }} />;

export const Empty = ({ children }: { children: ReactNode }) => (
  <T color={colors.muted} center style={{ paddingVertical: 24 }}>
    {children}
  </T>
);

/** Показ состояния запроса: загрузка / ошибка / данные */
export function Loadable<D>({
  query,
  children,
}: {
  query: { data: D | undefined; isLoading: boolean; error: unknown };
  children: (data: D) => ReactNode;
}) {
  if (query.isLoading) return <Spinner />;
  if (query.error) return <ErrorText>{query.error instanceof Error ? query.error.message : 'Ошибка загрузки'}</ErrorText>;
  if (query.data === undefined) return null;
  return <>{children(query.data)}</>;
}

/* ================= Переключатель ================= */

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => onChange(!checked)}
      style={[s.track, { backgroundColor: checked ? colors.primary : colors.lightGreen }]}
    >
      <View style={[s.thumb, { left: checked ? 21 : 3 }]} />
    </Pressable>
  );
}

/** Строка «подпись — переключатель» */
export function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Row between>
      <T size={15} weight="medium" style={{ flex: 1 }}>
        {label}
      </T>
      <Toggle label={label} checked={checked} onChange={onChange} />
    </Row>
  );
}

/* ================= Сегменты (День/Неделя/Месяц/Год) ================= */

export function Segmented<V extends string>({
  value,
  options,
  onChange,
}: {
  value: V;
  options: { value: V; label: string }[];
  onChange: (v: V) => void;
}) {
  return (
    <View style={s.segWrap} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[s.seg, active && { backgroundColor: colors.primary }]}
          >
            <T size={14} weight={active ? 'semibold' : 'regular'}>
              {o.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ================= Карточка-плашка ================= */

export const Card = ({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) => (
  <View style={[{ backgroundColor: colors.lightGreen, borderRadius: 20, padding: 18 }, style]}>{children}</View>
);

const s = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
  },
  inputBox: { justifyContent: 'center' },
  input: {
    height: 44,
    borderRadius: radius.field,
    paddingLeft: 20,
    paddingRight: 46,
    backgroundColor: colors.lightGreen,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.dark,
  },
  textArea: { height: 130, paddingTop: 14, textAlignVertical: 'top' },
  trailing: { position: 'absolute', right: 14 },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 16 },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: 24 },
  sheetList: { backgroundColor: colors.honeydew, borderRadius: 24, padding: 20, maxWidth: 400, width: '100%', alignSelf: 'center' },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGreen,
  },
  track: { width: 44, height: 26, borderRadius: 13, justifyContent: 'center' },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  segWrap: { flexDirection: 'row', backgroundColor: colors.lightGreen, borderRadius: 22, padding: 6, gap: 4 },
  seg: { flex: 1, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
});
