import { useEffect, type ReactNode } from 'react';
import styled from 'styled-components';
import { colors } from '@/theme';

/** Всплывающее окно поверх экрана (выход, удаление, новая категория…) */
export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <Overlay onClick={onClose}>
      <Card role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
      </Card>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 100;
  background: rgba(9, 48, 48, 0.45);
  display: grid;
  place-items: center;
  padding: 24px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 340px;
  background: ${colors.honeydew};
  border-radius: 24px;
  padding: 30px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;

  h2 {
    font-size: 20px;
    font-weight: 600;
  }
`;
