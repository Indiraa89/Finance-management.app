import { useCallback, useState } from 'react';

/** Состояние отправки формы: загрузка и текст ошибки */
export function useSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(async (fn: () => Promise<unknown>) => {
    setLoading(true);
    setError('');
    try {
      await fn();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Что-то пошло не так');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, setError, run };
}
