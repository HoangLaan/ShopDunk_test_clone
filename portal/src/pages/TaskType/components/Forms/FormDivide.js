import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import FormItemCheckbox from '../Shared/FormItemCheckbox';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { DIVIDE_BY } from 'pages/TaskType/utils/constants';
import BWAccordion from 'components/shared/BWAccordion';

function FormDivide({ title, disabled }) {
  const methods = useFormContext();
  const is_divide = methods.watch('is_divide');
  const receiver_list = methods.watch('receiver_list') || [];

  useEffect(() => {
    if (is_divide === DIVIDE_BY.IS_EQUAL_DIVIDE) {
      methods.setValue('is_equal_divide', 1);
      methods.setValue('is_ratio_divide', 0);
      methods.setValue('is_get_data', 0);

      // calc ratio value for receiver list
      if (receiver_list.length === 1) {
        methods.setValue('receiver_list.0.value_ratio', 100);
        return;
      }
      if (receiver_list.length >= 2) {
        const ratio = parseInt(100 / receiver_list.length);
        let remainRatio = 100;
        for (let index = 0; index < receiver_list.length - 1; index++) {
          methods.setValue(`receiver_list.${index}.value_ratio`, ratio);
          remainRatio -= ratio;
        }
        methods.setValue(`receiver_list.${receiver_list.length - 1}.value_ratio`, remainRatio);
      }
    } else if (is_divide === DIVIDE_BY.IS_RATIO_DIVIDE) {
      methods.setValue('is_equal_divide', 0);
      methods.setValue('is_ratio_divide', 1);
      methods.setValue('is_get_data', 0);
    } else if (is_divide === DIVIDE_BY.IS_GET_DATA) {
      methods.setValue('is_equal_divide', 0);
      methods.setValue('is_ratio_divide', 0);
      methods.setValue('is_get_data', 1);

      // reset ratio value for receiver list
      for (let index = 0; index < receiver_list.length; index++) {
        methods.setValue(`receiver_list.${index}.value_ratio`, null);
      }
    }
  }, [is_divide, receiver_list]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItemCheckbox label='Chia đều'>
            <FormInput
              disabled={disabled}
              type='checkbox'
              field='is_divide'
              checked={is_divide === DIVIDE_BY.IS_EQUAL_DIVIDE}
              onChange={(e) => methods.setValue('is_divide', e.target.checked ? DIVIDE_BY.IS_EQUAL_DIVIDE : 0)}
            />
          </FormItemCheckbox>
        </div>
        <div className='bw_col_4'>
          <FormItemCheckbox label='Chia theo tỷ lệ %'>
            <FormInput
              disabled={disabled}
              type='checkbox'
              field='is_divide'
              checked={is_divide === DIVIDE_BY.IS_RATIO_DIVIDE}
              onChange={(e) => methods.setValue('is_divide', e.target.checked ? DIVIDE_BY.IS_RATIO_DIVIDE : 0)}
            />
          </FormItemCheckbox>
        </div>
        <div className='bw_col_4'>
          <FormItemCheckbox label='Nhận data'>
            <FormInput
              disabled={disabled}
              type='checkbox'
              field='is_divide'
              checked={is_divide === DIVIDE_BY.IS_GET_DATA}
              onChange={(e) => methods.setValue('is_divide', e.target.checked ? DIVIDE_BY.IS_GET_DATA : 0)}
            />
          </FormItemCheckbox>
        </div>
      </div>
    </BWAccordion>
  );
}

export default FormDivide;
