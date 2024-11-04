import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

function usePageInformation() {
  const { pathname } = useLocation();
  const disabled = useMemo(() => pathname.includes('/detail'), [pathname]);
  const isView = useMemo(() => pathname.toLowerCase().includes('/detail') || pathname.includes('/view'), [pathname]);
  const isAdd = useMemo(() => pathname.toLowerCase().includes('/add'), [pathname]);
  const isEdit = useMemo(() => pathname.toLowerCase().includes('/edit'), [pathname]);

  return {
    disabled,
    isAdd,
    isView,
    isEdit,
  };
}

export { usePageInformation };
