import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { TransferTypeOptions } from '../utils/constant';

function StocksTransferTypeInfo({ disabled }) {
  return (
    <BWAccordion title='Thông tin luân chuyển kho'>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <FormItem isRequired label='Tên hình thức' disabled={disabled}>
              <FormInput
                type='text'
                field='stocks_transfer_type_name'
                placeholder='Tên hình thức'
                validation={{
                  required: 'Tên hình thức là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem label='Nhập mô tả' disabled={disabled}>
              <FormTextArea type='text' field='description' placeholder='Mô tả' />
            </FormItem>
          </div>
        <FormItem className='bw_col_12' label='Loại hình thức chuyển kho' disabled={disabled}>
          <FormRadioGroup
            field='transfer_type'
            list={TransferTypeOptions}
            disabled={disabled}
            style={{ marginBottom: '10px' }}
            validation={{
              require: 'Loại hình thức chuyển kho là bắt buộc !'
            }}
          />
        </FormItem>
          <div className='bw_col_12'>
            <label className='bw_checkbox'>
              <FormInput type='checkbox' field='is_stocks_in_review' disabled={disabled} />
              <span />
              Áp dụng mức duyệt
            </label>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}

export default StocksTransferTypeInfo;
