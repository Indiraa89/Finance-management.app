import type { IconKey, TransactionType } from '@finwise/shared';
import { Plus } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BalanceSummary } from '@/components/BalanceSummary';
import { CategoryIcon, ICONS, ICON_KEYS } from '@/components/CategoryIcon';
import { FullWidth, Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Loadable, Segmented, T, TextField } from '@/components/ui';
import { useCategories, useCreateCategory, useSummary } from '@/hooks/queries';
import { useNav } from '@/navigation/types';
import { colors } from '@/theme';

/** 9.4. Категории: сетка плиток + «Ещё» (новая категория) */
export function Categories() {
  const navigation = useNav();
  const summary = useSummary();
  const categories = useCategories();
  const [open, setOpen] = useState(false);

  return (
    <Screen tab="Categories" back title="Категории" top={<BalanceSummary summary={summary.data} />}>
      <Loadable query={categories}>
        {(list) => (
          <Grid>
            {list.map((c) => (
              <Tile
                key={c.id}
                label={c.name}
                bg={c.type === 'income' ? colors.primary : colors.lightBlue}
                onPress={() => (c.icon === 'savings' ? navigation.navigate('Savings') : navigation.navigate('CategoryDetail', { id: c.id }))}
              >
                <CategoryIcon icon={c.icon} size={60} bg="transparent" />
              </Tile>
            ))}
            <Tile label="Ещё" onPress={() => setOpen(true)}>
              <Plus size={44} color={colors.white} strokeWidth={1.6} />
            </Tile>
          </Grid>
        )}
      </Loadable>
      <NewCategoryModal open={open} onClose={() => setOpen(false)} />
    </Screen>
  );
}

/** Сетка из 3 колонок */
export const Grid = ({ children }: { children: ReactNode }) => <View style={s.grid}>{children}</View>;

/** Плитка категории/цели: голубой квадрат + подпись */
export function Tile({
  label,
  onPress,
  bg = colors.lightBlue,
  children,
}: {
  label: string;
  onPress: () => void;
  bg?: string;
  children: ReactNode;
}) {
  return (
    <Pressable style={s.tile} onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <View style={[s.square, { backgroundColor: bg }]}>{children}</View>
      <T size={13} numberOfLines={1} center>
        {label}
      </T>
    </Pressable>
  );
}

function NewCategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateCategory();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<IconKey>('shopping');
  const [type, setType] = useState<TransactionType>('expense');
  const [error, setError] = useState('');

  const close = () => {
    setName('');
    setError('');
    onClose();
  };

  const save = async () => {
    try {
      await create.mutateAsync({ name, icon, type });
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    }
  };

  return (
    <Modal open={open} title="Новая категория" onClose={close}>
      <FullWidth>
        <TextField placeholder="Название категории" value={name} onChangeText={setName} />
        <Segmented
          value={type}
          onChange={setType}
          options={[
            { value: 'expense', label: 'Расход' },
            { value: 'income', label: 'Доход' },
          ]}
        />
        <View style={s.icons}>
          {ICON_KEYS.map((k) => {
            const Icon = ICONS[k];
            return (
              <Pressable
                key={k}
                onPress={() => setIcon(k)}
                accessibilityLabel={k}
                style={[s.iconOption, { backgroundColor: k === icon ? colors.primary : colors.lightGreen }]}
              >
                <Icon size={20} color={colors.dark} />
              </Pressable>
            );
          })}
        </View>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Button title="Сохранить" block disabled={!name.trim() || create.isPending} onPress={save} />
        <Button title="Отмена" block variant="secondary" onPress={close} />
      </FullWidth>
    </Modal>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 22 },
  tile: { width: '33.33%', alignItems: 'center', gap: 6, paddingHorizontal: 6 },
  square: {
    width: '100%',
    maxWidth: 98,
    aspectRatio: 105 / 98,
    borderRadius: 25,
    backgroundColor: colors.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  icons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  iconOption: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
