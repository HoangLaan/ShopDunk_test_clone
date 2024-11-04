import _ from 'lodash';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

function WrapUnregister({ field, children }) {
  const methods = useFormContext();

  useEffect(() => {
    return () => {
      if(_.isArray(field)) {
        field.forEach(x => methods.unregister(x))
      } else {
        methods.unregister(field);
      }
    };
  }, []);

  return children;
}

export default WrapUnregister;
