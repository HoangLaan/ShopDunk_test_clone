import React from 'react';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

export function UnitInfo({ disabled }) {
  return (
    <BWAccordion title='Thông tin đơn vị tính' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Tên đơn vị tính' isRequired>
            <FormInput
              type='text'
              field='unit_name'
              placeholder='Nhập tên đơn vị tính'
              validation={{
                required: 'Tên đơn vị tính là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormTextArea field='description' rows={3} disabled={disabled} placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}
export function UnitStatus({ disabled }) {
  return (
    <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_active' disabled={disabled} />
                <span />
                Kích hoạt
              </label>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_system' disabled={disabled} />
                <span />
                Hệ thống
              </label>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}
