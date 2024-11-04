import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

function InformationForm({ title, disabled }) {
  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Tên mẫu tin nhắn' isRequired={true} disabled={disabled}>
            <FormInput
              field='zalo_template_name'
              placeholder='Nhập tên mẫu tin nhắn'
              validation={{
                required: 'Tên mẫu tin nhắn là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mẫu tin nhắn' disabled={disabled}>
            <FormTextArea field='zalo_template' placeholder='Nhập mẫu tin nhắn' disabled={disabled} rows={5} />
          </FormItem>
        </div>
        <FormItem className='bw_col_12' label='Ảnh đính kèm (URL)' disabled={disabled}>
          <FormInput
            field='image_url'
            placeholder='Nhập ảnh đính kèm'
            disabled={disabled}
            validation={{
              pattern: {
                value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                message: 'Vui lòng nhập đúng định dạng URL',
              },
            }}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
}

export default InformationForm;
