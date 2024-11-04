import { useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import usePrevious from './usePrevious';

const useDetectHookFormChange = (methods) => {
  const prevValues = usePrevious(methods?.watch()) || {};

  useEffect(() => {
    const changedFields = {};
    Object.keys(methods.watch()).forEach((fieldName) => {
      if (!isEqual(prevValues[fieldName], methods.watch()[fieldName])) {
        changedFields[fieldName] = {
          previous: prevValues[fieldName],
          current: methods.watch()[fieldName],
        };
      }
    });
    for(let key in changedFields) {
      console.log('Changed field:', key, changedFields[key]);
    }
  }, [prevValues, methods?.watch]);
};

export default useDetectHookFormChange;
