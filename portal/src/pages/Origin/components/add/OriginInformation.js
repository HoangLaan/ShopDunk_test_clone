import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import React from 'react';

const OriginInformation = ({ disabled }) => {

  return (
    <BWAccordion title='Thông tin xuất xứ'>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} isRequired label='Tên xuất xứ'>
              <FormInput
                disabled={disabled}
                type='text'
                field='origin_name'
                placeholder='Nhập tên xuất xứ'
                validation={{
                  required: 'Tên xuất xứ cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Nhập mô tả'>
              <FormTextArea type='text' field='description' placeholder='Mô tả' />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default OriginInformation;
