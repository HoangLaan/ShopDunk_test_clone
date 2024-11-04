import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormInput from 'components/shared/BWFormControl/FormInput';

const PayrollTemplateInformation = ({ disabled, title }) => {
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormItem className='bw_col_12' label='Tên mẫu bảng lương' isRequired disabled={disabled}>
            <FormInput
              field='template_name'
              placeholder={'Nhập tên mẫu bảng lương'}
              validation={{
                required: 'Tên mẫu bảng lương là bắt buộc',
              }}
            />
          </FormItem>
          <FormItem className='bw_col_12' label='Mô tả' disabled={disabled}>
            <FormTextArea placeholder='Nhập mô tả mẫu bảng lương' field='description' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};
export default PayrollTemplateInformation;
