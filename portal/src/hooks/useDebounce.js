import { useEffect } from 'react';

export const useDebouncedEffect = (func, deps = [], delay) => {
  useEffect(() => {
    const handler = setTimeout(func, delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
};
