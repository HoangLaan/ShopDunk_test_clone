import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';

const FilterOrderStatusModel = ({ onChange }) => {
  const methods = useForm();
  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
    });
    onChange(methods.getValues());
  };

  return (
    <FormProvider {...methods}>
      <div className='bw_search_box bw_col_12'>
        <FormItem label='Từ khoá' className='bw_col_12'>
          <FormInput type='text' field='search' placeholder='Tên loại đơn hàng' />
        </FormItem>

        <div className='bw_row bw_align_items_center '>
          <div className='bw_col_12 bw_flex bw_justify_content_right bw_btn_group'>
            <button
              style={{ marginRight: '10px' }}
              type='submit'
              onClick={(e) => {
                e.preventDefault();
                onChange(methods.getValues());
              }}
              className='bw_btn bw_btn_success'>
              <span className='fi fi-rr-filter'></span> Tìm kiếm
            </button>
            <button type='button' onClick={() => onClear()} className='bw_btn_outline'>
              Làm mới
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default FilterOrderStatusModel;
