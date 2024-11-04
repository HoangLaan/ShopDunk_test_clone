import React from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

const FunctionGroupInformation = ({ disabled, title }) => {
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} isRequired label='Tên nhóm quyền'>
              <FormInput
                type='text'
                field='function_group_name'
                placeholder='Nhập tên quyền'
                validation={{
                  required: 'Tên quyền cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_4'>
            <FormItem disabled={disabled} isRequired label='Số thứ tự'>
              <FormInput
                type='number'
                field='order_index'
                placeholder='Nhập số thứ tự'
                validation={{
                  min: {
                    value: 0,
                    message: 'Vui lòng nhập giá trị dương'
                  }
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

export default FunctionGroupInformation;
