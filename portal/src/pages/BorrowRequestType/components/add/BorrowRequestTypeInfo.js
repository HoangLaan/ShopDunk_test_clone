import React, { useCallback, useEffect } from 'react';
// import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { getOptionsGlobal } from 'actions/global';
import { borrowType, borrowTypeOptions } from 'pages/BorrowRequestType/helper/constants';
import { mapDataOptions4Select } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

function BorrowRequestTypeInfo({ disabled, title }) {
  // const methods = useFormContext();
  const dispatch = useDispatch();

  const { stocksOutTypeBorrowData, stocksInTypeBorrowData } = useSelector((state) => state.global);

  const getOptions1Time = useCallback(() => {
    dispatch(getOptionsGlobal('stocksOutTypeBorrow'));
    dispatch(getOptionsGlobal('stocksInTypeBorrow'));
  }, [dispatch]);
  useEffect(getOptions1Time, [getOptions1Time]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Tên hình thức mượn hàng' isRequired={true} disabled={disabled}>
            <FormInput
              field='borrow_type_name'
              placeholder='Nhập tên hình thức mượn hàng'
              validation={{
                required: 'Tên hình thức mượn hàng là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Loại hình thức mượn hàng' isRequired={true} disabled={disabled}>
            <FormRadioGroup
              custom={true}
              field='borrow_type'
              list={borrowTypeOptions.filter((item) => item.value !== borrowType.ALL)}
              style={{ width: '33%' }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Hình thức xuất kho' isRequired={true} disabled={disabled}>
            <FormSelect
              field='stocks_out_type_id'
              list={mapDataOptions4Select(stocksOutTypeBorrowData)}
              validation={{
                required: 'Hình thức xuất kho là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Hình thức nhập kho' isRequired={true} disabled={disabled}>
            <FormSelect
              field='stocks_in_type_id'
              list={mapDataOptions4Select(stocksInTypeBorrowData)}
              validation={{
                required: 'Hình thức nhập kho là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Hình thức xuất kho trả' isRequired={true} disabled={disabled}>
            <FormSelect
              field='return_stocks_out_type_id'
              list={mapDataOptions4Select(stocksOutTypeBorrowData)}
              validation={{
                required: 'Hình thức xuất kho trả là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Hình thức nhập kho trả' isRequired={true} disabled={disabled}>
            <FormSelect
              field='return_stocks_in_type_id'
              list={mapDataOptions4Select(stocksInTypeBorrowData)}
              validation={{
                required: 'Hình thức nhập kho trả là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea rows={1} field='description' placeholder='Nhập mô tả hình thức mượn hàng' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default BorrowRequestTypeInfo;
