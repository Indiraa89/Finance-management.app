import type { IconKey, TransactionType } from '@finwise/shared';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { BalanceSummary } from '@/components/BalanceSummary';
import { CategoryIcon, ICONS, ICON_KEYS } from '@/components/CategoryIcon';
import { Modal } from '@/components/Modal';
import { Screen } from '@/components/Screen';
import { Button, ErrorText, Loadable, Segmented, TextField } from '@/components/ui';
import { useCategories, useCreateCategory, useSummary } from '@/hooks/queries';
import { colors } from '@/theme';

/** 9.4. Категории: сетка плиток + «Ещё» (новая категория) */
export function Categories() {
  const navigate = useNavigate();
  const summary = useSummary();
  const categories = useCategories();
  const [open, setOpen] = useState(false);

  return (
    <Screen nav back="/home" title="Категории" top={<BalanceSummary summary={summary.data} />}>
      <Loadable query={categories}>
        {(list) => (
          <Grid>
            {list.map((c) => (
              <Tile
                key={c.id}
                onClick={() => navigate(c.icon === 'savings' ? '/savings' : `/categories/${c.id}`)}
              >
                <CategoryIcon
                  icon={c.icon}
                  size={98}
                  radius={25}
                  bg={c.type === 'income' ? colors.primary : colors.lightBlue}
                />
                <span>{c.name}</span>
              </Tile>
            ))}
            <Tile onClick={() => setOpen(true)}>
              <More>
                <Plus size={44} color={colors.white} strokeWidth={1.6} />
              </More>
              <span>Ещё</span>
            </Tile>
          </Grid>
        )}
      </Loadable>
      <NewCategoryModal open={open} onClose={() => setOpen(false)} />
    </Screen>
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
      <div style={{ width: '100%' }}>
        <TextField placeholder="Название категории" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      </div>
      <div style={{ width: '100%' }}>
        <Segmented
          value={type}
          onChange={setType}
          options={[
            { value: 'expense', label: 'Расход' },
            { value: 'income', label: 'Доход' },
          ]}
        />
      </div>
      <IconPicker>
        {ICON_KEYS.map((k) => {
          const Icon = ICONS[k];
          return (
            <IconOption key={k} type="button" $active={k === icon} onClick={() => setIcon(k)} aria-label={k}>
              <Icon size={20} />
            </IconOption>
          );
        })}
      </IconPicker>
      {error && <ErrorText>{error}</ErrorText>}
      <Button $small disabled={!name.trim() || create.isPending} onClick={save}>
        Сохранить
      </Button>
      <Button $small $variant="secondary" onClick={close}>
        Отмена
      </Button>
    </Modal>
  );
}

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px 14px;
`;

export const Tile = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;

  > span:first-child {
    width: 100% !important;
    max-width: 98px;
    aspect-ratio: 105 / 98;
    height: auto !important;
    transition: transform 0.15s;
  }
  &:hover > span:first-child {
    transform: translateY(-2px);
  }
  > span:last-child {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
`;

const More = styled.span`
  display: grid;
  place-items: center;
  border-radius: 25px;
  background: ${colors.lightBlue};
`;

const IconPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  width: 100%;
`;

const IconOption = styled.button<{ $active: boolean }>`
  aspect-ratio: 1;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${({ $active }) => ($active ? colors.primary : colors.lightGreen)};
  color: ${colors.dark};
`;
