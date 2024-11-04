import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

const CostTypeInfo = ({ disabled, title, id }) => {
  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_row'>
        <div class='bw_col_12'>
          <FormItem label='Tên loại chi phí' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='cost_name'
              placeholder='Nhập tên loại chi phí'
              validation={{
                required: 'Tên loại chi phí là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea field='description' rows={2} placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>

    </BWAccordion>
  );
};

export default CostTypeInfo;
