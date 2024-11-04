import { useRef } from 'react';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';

const useDeepMemo = (memoFn, deps) => {
  const ref = useRef();

  if (!ref.current || !isEqual(deps, ref.current?.deps)) {
    ref.current = {
      deps: cloneDeep(deps),
      value: memoFn(),
    };
  }

  return ref.current?.value;
};

export default useDeepMemo;
