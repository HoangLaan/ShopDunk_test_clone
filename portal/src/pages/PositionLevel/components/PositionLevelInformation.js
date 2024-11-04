import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

const PositionLevelInformation = ({ disabled, title }) => {
  return (
    <BWAccordion title={title} isRequired>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem isRequired label='Tên cấp bậc nhân viên'>
            <FormInput
              disabled={disabled}
              type='text'
              placeholder='Nhập tên cấp bậc nhân viên'
              field='position_level_name'
              validation={{ required: 'Tên cấp bậc nhân viên là bắt buộc' }}
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

export default PositionLevelInformation;
