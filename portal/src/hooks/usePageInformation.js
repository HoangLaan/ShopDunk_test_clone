import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function usePageInformation(keyId) {
  const { pathname } = useLocation();
  const isView = useMemo(() => pathname.toLowerCase().includes('/detail') || pathname.includes('/view'), [pathname]);
  const disabled = useMemo(() => !!isView, [isView]);
  const isAdd = useMemo(() => pathname.toLowerCase().includes('/add'), [pathname]);
  const isEdit = useMemo(() => pathname.toLowerCase().includes('/edit'), [pathname]);
  const params = useParams();
  const id = useMemo(() => {
    const keys = Object.keys(params) || [];
    if (keyId) {
      const index = keys.findIndex((k) => k.includes(keyId));
      return index !== -1 ? params[keys[index]] : null;
    } else {
      const index = keys.findIndex((k) => k.includes('Id') || k.includes('_id') || k === 'id');
      return index !== -1 ? params[keys[index]] : null;
    }
  }, [params, keyId]);

  return {
    disabled,
    isAdd,
    isView,
    isEdit,
    params,
    id,
    [keyId]: id,
  };
}

export default usePageInformation;
