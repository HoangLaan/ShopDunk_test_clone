import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';
import { useFormContext } from 'react-hook-form';

function InformationForm({ title, disabled }) {
  const methods = useFormContext();

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Tên loại yêu cầu mua hàng' isRequired={true} disabled={disabled}>
            <FormInput
              field='purchase_requisition_type_name'
              placeholder='Nhập tên loại yêu cầu mua hàng'
              validation={{
                required: 'Tên loại yêu cầu mua hàng là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Giới hạn duyệt' disabled={disabled}>
            <FormNumber
              field='number_of_cancel_date'
              placeholder='Nhập số ngày giới hạn duyệt'
              disabled={disabled}
              validation={{
                required: 'Giới hạn duyệt là bắt buộc',
                min: {
                  value: 1,
                  message: "Cần nhập vào số nguyên dương"
                }
              }}
              addonAfter='ngày'
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem disabled={disabled}>
            <label className='bw_checkbox'>
              <FormInput type='radio' field='is_returned_goods' />
              <span />
              Nhập mua hàng bán bị trả lại
            </label>
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea field='description' placeholder='Nhập mô tả loại yêu cầu mua hàng' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}


export default InformationForm;
