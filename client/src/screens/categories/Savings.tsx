import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { BalanceSummary } from '@/components/BalanceSummary';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Loadable, TextField } from '@/components/ui';
import { useCreateGoal, useGoals, useSummary } from '@/hooks/queries';
import { colors } from '@/theme';
import { Grid, Tile } from './Categories';

/** 9.4. Накопления: цели (Путешествие, Дом, Машина, Свадьба…) */
export function Savings() {
  const navigate = useNavigate();
  const summary = useSummary();
  const goals = useGoals();
  const [open, setOpen] = useState(false);

  return (
    <Screen nav back="/categories" title="Накопления" top={<BalanceSummary summary={summary.data} />}>
      <Loadable query={goals}>
        {(list) => (
          <Grid>
            {list.map((g) => (
              <Tile key={g.id} onClick={() => navigate(`/savings/${g.id}`)}>
                <CategoryIcon icon={g.icon} size={98} radius={25} bg={colors.lightBlue} />
                <span>{g.name}</span>
              </Tile>
            ))}
            <Tile onClick={() => setOpen(true)}>
              <More>
                <Plus size={44} color={colors.white} strokeWidth={1.6} />
              </More>
              <span>Новая цель</span>
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

  return (
    <Modal open={open} title="Новая цель" onClose={close}>
      <div style={{ width: '100%', display: 'grid', gap: 12 }}>
        <TextField placeholder="Название цели" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        <TextField
          placeholder="Сколько накопить, ₸"
          inputMode="numeric"
          value={target}
          onChange={(e) => setTarget(e.target.value.replace(/\D/g, ''))}
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      <Button
        $small
        disabled={!name.trim() || !target || create.isPending}
        onClick={async () => {
          try {
            await create.mutateAsync({ name, target: Number(target) });
            close();
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Ошибка');
          }
        }}
      >
        Сохранить
      </Button>
      <Button $small $variant="secondary" onClick={close}>
        Отмена
      </Button>
    </Modal>
  );
}

const More = styled.span`
  display: grid;
  place-items: center;
  border-radius: 25px;
  background: ${colors.lightBlue};
`;
