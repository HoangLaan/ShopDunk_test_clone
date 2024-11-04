import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { DatePicker } from '../../../../../node_modules/antd/es/index';

function ReturnConditionInfo({ disabled, title }) {
  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItem label='Điều kiện đổi trả' isRequired={true} disabled={disabled}>
            <FormInput
              field='returnCondition_name'
              placeholder='Nhập điều kiện sửa đổi'
              disabled={disabled}
              type='text'
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Áp dụng cho chính sách' isRequired={true} disabled={disabled}>
            <div className='bw_flex bw_align_items_center bw_lb_sex'>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_exchange' disabled={disabled} />
                <span />
                Đổi hàng
              </label>
              <label className='bw_checkbox'>
                <FormInput type='checkbox' field='is_return' disabled={disabled} />
                <span />
                Trả hàng
              </label>
            </div>
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <div className='bw_frm_box'>
            <FormItem label='Áp dụng cho hộp sạc, phụ kiện đi kèm' isRequired={true} disabled={disabled}>
              <div className='bw_flex bw_align_items_center bw_lb_sex'>
                <label className='bw_checkbox'>
                  <FormInput type='checkbox' field='is_lostBox' disabled={disabled} />
                  <span />
                  Mất hộp
                </label>
                <div className='bw_col_1'>Thu phí:</div>
                <div className='bw_display_inline-flex bw_align_items_center bw_col_8'>
                  <FormInput
                    type='number'
                    field='value_lostBox'
                    placeholder='%'
                    disabled={disabled}
                    className='bw_col_2'
                    style={{ border: 'solid 1px' }}
                  />
                  <label label='' className='bw_col_10'>
                    giá trị hóa đơn sản phẩm
                  </label>
                </div>
              </div>
              <div className='bw_flex bw_align_items_center bw_lb_sex'>
                <label className='bw_checkbox'>
                  <FormInput type='checkbox' field='is_lostAccessories' disabled={disabled} />
                  <span />
                  Mất phụ kiện
                </label>
                <div className='bw_col_1'>Thu phí:</div>
                <div className='bw_display_inline-flex bw_align_items_center bw_col_8'>
                  <FormInput
                    type='number'
                    field='value_lostAccessories'
                    placeholder='%'
                    disabled={disabled}
                    className='bw_col_2'
                    style={{ border: 'solid 1px' }}
                  />
                  <label label='' className='bw_col_10'>
                    giá trị hóa đơn sản phẩm
                  </label>
                </div>
              </div>
            </FormItem>
          </div>
        </div>

        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea rows={3} field='description' placeholder='Nhập mô tả điều kiện đổi trả' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default ReturnConditionInfo;
