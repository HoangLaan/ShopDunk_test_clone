import React from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4Select } from 'utils/helpers';

const Other = () => {
  const methods = useFormContext();
  const { watch, setValue, clearErrors } = methods;

  const handleChange = (e, field) => {
    clearErrors(field);
    setValue(field, e.target.value);
  };
  return (
    <BWAccordion title='Cài đặt khác' id='bw_order_other_config' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <div className='bw_frm_box'>
            <label style={{ fontSize: '14px' }}>
              Thời gian khôi phục imei trong các đơn hàng không thanh toán ( Phút )
            </label>
            <div style={{ display: 'flex' }}>
              <input
                type='text'
                value={watch('RESTORE_IMEI_FREQ')}
                onChange={(e) => handleChange(e, 'RESTORE_IMEI_FREQ')}
              />
              <span style={{ paddingTop: '10px', opacity: '50%' }}>Phút</span>
            </div>
          </div>
          <FormItem label='Loại đơn hàng mặc định cho đơn hàng Lazada' isRequired={true} disabled={false}>
            <FormSelect
              field='ORDER_TYPE_LAZADA'
              list={mapDataOptions4Select(watch('order_type_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Loại thu khi tạo đơn hàng bán tại quầy từ App' isRequired={true} disabled={false}>
            <FormSelect
              field='SL_ORDER_RECEIVETYPE'
              list={mapDataOptions4Select(watch('receive_type_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Loại đơn hàng mặc định cho đơn hàng shopee' isRequired={true} disabled={false}>
            <FormSelect
              field='ORDER_TYPE_SHOPEE'
              list={mapDataOptions4Select(watch('order_type_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          {/* <div className='bw_frm_box'>
            <label style={{ fontSize: '14px' }}>Tỷ lệ rebate dùng trong bảng tính lãi lỗ</label>
            <div style={{ display: 'flex' }}>
              <input type='text' value={watch('REBATEPERCENT')} onChange={(e)=>handleChange(e, 'REBATEPERCENT')}/>
              <span style={{ paddingTop: '10px', opacity: '50%' }}>%</span>
            </div>
          </div> */}
          <FormItem label='Loại khách hàng mặc định cho đơn hàng Shopee' isRequired={true} disabled={false}>
            <FormSelect field='CUSTOMER_TYPE_SHOPEE' list={mapDataOptions4Select(watch('customer_type_option'))} />
          </FormItem>
          <FormItem label='Loại khách hàng mặc định cho đơn hàng Lazada' isRequired={true} disabled={false}>
            <FormSelect
              field='CUSTOMER_TYPE_LAZADA'
              list={mapDataOptions4Select(watch('customer_type_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default Other;
