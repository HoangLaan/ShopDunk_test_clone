import React from 'react';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

export function RelationshipInfo({ disabled }) {
  return (
    <BWAccordion title='Thông tin mối quan hệ' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Tên mối quan hệ' isRequired>
            <FormInput
              type='text'
              field='relationship_name'
              placeholder='Nhập tên mối quan hệ'
              validation={{
                required: 'Tên mối quan hệ là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Mô tả'>
            <FormTextArea field='decription' rows={3} disabled={disabled} placeholder='Nhập mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export function RelationshipStatus({ disabled }) {
  return (
    <BWAccordion title='Trạng thái' id='bw_mores' isRequired={false}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              {/* <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_active' disabled={disabled} />
                <span />
                Kích hoạt
              </label> */}
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
