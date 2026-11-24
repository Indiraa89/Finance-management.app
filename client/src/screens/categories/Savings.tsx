import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { BalanceSummary } from '@/components/BalanceSummary';
import { CategoryIcon } from '@/components/CategoryIcon';
import { FullWidth, Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Loadable, TextField } from '@/components/ui';
import { useCreateGoal, useGoals, useSummary } from '@/hooks/queries';
import { useNav } from '@/navigation/types';
import { colors } from '@/theme';
import { Grid, Tile } from './Categories';

/** 9.4. Накопления: цели (Путешествие, Дом, Машина, Свадьба…) */
export function Savings() {
  const navigation = useNav();
  const summary = useSummary();
  const goals = useGoals();
  const [open, setOpen] = useState(false);

  return (
    <Screen tab="Categories" back title="Накопления" top={<BalanceSummary summary={summary.data} />}>
      <Loadable query={goals}>
        {(list) => (
          <Grid>
            {list.map((g) => (
              <Tile key={g.id} label={g.name} onPress={() => navigation.navigate('GoalDetail', { id: g.id })}>
                <CategoryIcon icon={g.icon} size={60} bg="transparent" />
              </Tile>
            ))}
            <Tile label="Новая цель" onPress={() => setOpen(true)}>
              <Plus size={44} color={colors.white} strokeWidth={1.6} />
            </Tile>
          </Grid>
        )}
      </Loadable>
      <NewGoalModal open={open} onClose={() => setOpen(false)} />
    </Screen>
  );
}

function NewGoalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateGoal();
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [error, setError] = useState('');

  const close = () => {
    setName('');
    setTarget('');
    setError('');
    onClose();
  };

  const save = async () => {
    try {
      await create.mutateAsync({ name, target: Number(target) });
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    }
  };

  return (
    <Modal open={open} title="Новая цель" onClose={close}>
      <FullWidth>
        <TextField placeholder="Название цели" value={name} onChangeText={setName} />
        <TextField
          placeholder="Сколько накопить, ₸"
          keyboardType="number-pad"
          value={target}
          onChangeText={(v) => setTarget(v.replace(/\D/g, ''))}
        />
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Button title="Сохранить" block disabled={!name.trim() || !target || create.isPending} onPress={save} />
        <Button title="Отмена" block variant="secondary" onPress={close} />
      </FullWidth>
    </Modal>
  );
}
