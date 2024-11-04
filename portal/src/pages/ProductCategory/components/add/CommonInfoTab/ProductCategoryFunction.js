import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getOptionsFunction } from 'services/product-category.service';
import { getOptionsGlobal } from 'actions/global';
import { useFormContext } from 'react-hook-form';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { mapDataOptions4Select } from 'utils/helpers';

const ProductCategoryFunction = ({ disabled, title }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const [optionsFunction, setOptionsFunction] = useState(null);

  const getDataOptions = async () => {
    let result  = await dispatch(getOptionsGlobal('function'));
    setOptionsFunction(mapDataOptions4Select(result));
  };

  useEffect(() => {
    getDataOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BWAccordion title={title} id='bw_info' isRequired={true}>
      <div className='bw_row'>
        <FormItem label='Quyền thêm' className='bw_col_4' isRequired={true}>
          <FormDebouneSelect
            field='add_function_id'
            allowClear={true}
            validation={{
              required: 'Quyền thêm là bắt buộc',
            }}
            disabled={disabled}
            value = {(optionsFunction || []).find(item => item.id == methods.watch('add_function_id'))}
            fetchOptions={(keyword) => dispatch(getOptionsGlobal('function', { keyword }))}
          />
        </FormItem>
        <FormItem label='Quyền sửa' className='bw_col_4' isRequired={true}>
          <FormDebouneSelect
            field='edit_function_id'
            allowClear={true}
            validation={{
              required: 'Quyền sửa là bắt buộc',
            }}
            disabled={disabled}
            value = {(optionsFunction || []).find(item => item.id == methods.watch('edit_function_id'))}
            fetchOptions={(keyword) => dispatch(getOptionsGlobal('function', { keyword }))}
          />
        </FormItem>
        <FormItem label='Quyền xóa' className='bw_col_4' isRequired={true}>
          <FormDebouneSelect
            field='delete_function_id'
            allowClear={true}
            validation={{
              required: 'Quyền xóa là bắt buộc',
            }}
            value = {(optionsFunction || []).find(item => item.id == methods.watch('delete_function_id'))}
            disabled={disabled}
            fetchOptions={(keyword) => dispatch(getOptionsGlobal('function', { keyword }))}
          />
        </FormItem>
        <FormItem label='Quyền xem' className='bw_col_4' isRequired={true}>
          <FormDebouneSelect
            field='view_function_id'
            allowClear={true}
            validation={{
              required: 'Quyền xem là bắt buộc',
            }}
            value = {(optionsFunction || []).find(item => item.id == methods.watch('view_function_id'))}
            disabled={disabled}
            fetchOptions={(keyword) => dispatch(getOptionsGlobal('function', { keyword }))}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default ProductCategoryFunction;
