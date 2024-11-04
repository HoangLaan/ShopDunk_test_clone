import React from 'react';
import BWAccordion from '../../../../components/shared/BWAccordion/index';
import FormInput from '../../../../components/shared/BWFormControl/FormInput';
import FormItem from '../../../../components/shared/BWFormControl/FormItem';
import FormTextArea from '../../../../components/shared/BWFormControl/FormTextArea';

const StocksTakeTypeInfo = ({ disabled }) => {
  return (
    <BWAccordion title='Thông tin kiểm kê kho' id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Tên hình thức kiểm kê kho ' isRequired>
            <FormInput
              type='text'
              field='stocks_take_type_name'
              placeholder='Nhập tên hình thức kiểm kê kho'
              validation={{
                required: 'Tên hình thức kiểm kê kho là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_8'>
          <FormItem label='Mô tả '>
            <FormTextArea
              type='text'
              field='description'
              placeholder='Mô tả hình thức kiểm kê kho'
              disabled={disabled}
            />
          </FormItem>
          <div className='bw_mt_1 bw_flex bw_align_items_center'>
            <label className='bw_checkbox'>
              <FormInput type='checkbox' field='is_stocks_take_review' disabled={disabled} />
              <span />
              Tự động duyệt
            </label>
            <label className='bw_checkbox'>
              <FormInput type='checkbox' field='is_stocks_take_imei_code' disabled={disabled} />
              <span />
              Kiểm kê có quy cách
            </label>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default StocksTakeTypeInfo;
