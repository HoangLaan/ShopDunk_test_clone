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
          <FormItem label='Tên hình thức chuyển tiền' isRequired={true} disabled={disabled}>
            <FormInput
              field='internal_transfer_type_name'
              placeholder='Nhập tên hình thức chuyển tiền'
              validation={{
                required: 'Tên hình thức chuyển tiền là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field='is_same_bussiness' />
                <span />
                Chuyển tiền cùng chi nhánh
              </label>
            </div>
          </div>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea field='description' placeholder='Nhập mô tả hình thức chuyển tiền' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default InformationForm;
