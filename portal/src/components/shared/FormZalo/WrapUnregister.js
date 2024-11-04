import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

function WrapUnregister({ field, children }) {
  const methods = useFormContext();

  useEffect(() => {
    return () => {
      methods.unregister(field);
    };
  }, []);

  return children;
}

export default WrapUnregister;
