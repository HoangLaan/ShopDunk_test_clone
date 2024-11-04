/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * Reset fields when boolean field change value
 */
export const useResetField = (booleanField, resetFields) => {
  const methods = useFormContext();
  const booleanValue = methods.watch(booleanField);
  useEffect(() => {
    if (booleanValue === 0) {
      resetFields.forEach((field) => methods.setValue(field, null));
    }
  }, [booleanValue]);
};
