// import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const useFieldArrayErrors = (fieldName, validateTableRows) => {
  let hasErrors = false;
  const { setError, clearErrors } = useFormContext();
  const fields = useWatch({ name: fieldName });
  ;
  let result = [](
    //validateTableRows(fields);
    result || [],
  ).forEach((item, index) => {
    const keys = Object.keys(item) || [];
    keys.forEach((key) => {
      if (item[key]) {
        hasErrors = true;
        setError(`${fieldName}[${index}].${key}`, {
          type: 'manual',
          message: item[key],
        });
      } else {
        clearErrors(`${fieldName}[${index}].${key}`);
      }
    });
  });

  if (hasErrors) {
    setError(fieldName, {
      type: 'manual',
      message: 'Error with table fields',
    });
  } else {
    clearErrors(fieldName);
  }
};
