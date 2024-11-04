import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

function ExperienceInfo({ disabled, title }) {
  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Năm kinh nghiệm' isRequired={true} disabled={disabled}>
            <FormInput
              field='experience_name'
              placeholder='Nhập năm kinh nghiệm'
              validation={{
                required: 'Năm kinh nghiệm là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Từ' isRequired={true} disabled={disabled}>
            <FormInput
              field='experience_from'
              placeholder='Nhập số năm kinh nghiệm'
              disabled={disabled}
              type='number'
              min={0}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Đến' isRequired disabled={disabled}>
            <FormInput
              field='experience_to'
              placeholder='Nhập số năm kinh nghiệm'
              disabled={disabled}
              type='number'
              min={0}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea rows={3} field='description' placeholder='Nhập mô tả công việc' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default ExperienceInfo;
