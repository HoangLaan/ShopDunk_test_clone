import React from 'react';

// Components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';

export default function Setting() {
  return (
    <BWAccordion title='Cài đặt in' id='bw_attr' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <label className='bw_checkbox'>
            <FormInput type='checkbox' field={'is_show_name'} />
            <span></span>
            Hiển thị tên sản phẩm
          </label>
        </div>
        <div className='bw_col_4'>
          <label className='bw_checkbox'>
            <FormInput type='checkbox' field={'is_show_code'} />
            <span></span>
            Hiển thị mã sản phẩm
          </label>
        </div>
        <div className='bw_col_4'>
          <label className='bw_checkbox'>
            <FormInput type='checkbox' field={'is_show_price'} />
            <span></span>
            Hiển thị giá sản phẩm
          </label>
        </div>
        <div className='bw_col_4'>
          <label className='bw_checkbox'>
            <FormInput type='checkbox' field={'is_show_imei'} />
            <span></span>
            In IMEI/Serial Number sản phẩm
          </label>
        </div>
        <div className='bw_col_4'>
          <label className='bw_checkbox'>
            <FormInput type='checkbox' field={'is_qr_code'} />
            <span></span>
            Sử dụng tem QR code
          </label>
        </div>
      </div>
    </BWAccordion>
  );
}
