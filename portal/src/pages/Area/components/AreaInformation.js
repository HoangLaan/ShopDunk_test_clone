import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';

const AreaInformation = ({ disabled, title }) => {
  return (
    <BWAccordion title={title} isRequired>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem isRequired label='Tên khu vực'>
            <FormInput
              disabled={disabled}
              type='text'
              placeholder='Tên khu vực'
              field='area_name'
              validation={{ required: 'Tên khu vực là bắt buộc' }}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormTextArea disabled={disabled} placeholder='Mô tả' field='description' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default AreaInformation;
