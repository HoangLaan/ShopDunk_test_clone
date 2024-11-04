import React, { useMemo } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { listTypeBorrow } from '../../utils/utils';
import { useFormContext } from 'react-hook-form';

function BorrowRequestInfo({ disabled, title }) {
  const methods = useFormContext();

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
              disabled={disabled}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Loại hình thức mượn hàng' isRequired={true} disabled={disabled}>
            <FormRadioGroup
              custom={true}
              field='borrow_type'
              list={listTypeBorrow}
              disabled={disabled}
              style={{ width: '33%' }}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea
              rows={1}
              field='description'
              placeholder='Nhập mô tả hình thức mượn hàng'
              disabled={disabled}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default BorrowRequestInfo;
