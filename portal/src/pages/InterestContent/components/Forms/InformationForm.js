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
          <FormItem label='Tên nội dung quan tâm' isRequired={true} disabled={disabled}>
            <FormInput
              field='interest_content_name'
              placeholder='Nhập tên nội dung quan tâm'
              validation={{
                required: 'Tên nội dung quan tâm là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea field='description' placeholder='Nhập mô tả nội dung quan tâm' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default InformationForm;
