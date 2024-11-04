import React from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4Select } from 'utils/helpers';
import { parseInt } from 'lodash';

const Other = () => {
  const methods = useFormContext();
  const { watch, clearErrors, setValue } = methods;

  const handleChange = (e, field) => {
    clearErrors(field);
    setValue(field, e.target.value);
  };
  return (
    <BWAccordion title='Cài đặt khác' id='bw_pre_order_other_config' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <div className='bw_frm_box'>
            <label style={{ fontSize: '14px' }}>Cài đặt URL</label>
            <div style={{ display: 'flex' }}>
              <input type='text' value={watch('PREOD_URL')} onChange={(e) => handleChange(e, 'PREOD_URL')} />
            </div>
          </div>
          <div className='bw_frm_box'>
            <label style={{ fontSize: '14px' }}>Cài đặt số tiền đặt cọc</label>
            <div style={{ display: 'flex' }}>
              <input
                type='text'
                value={
                  watch('PREOD_DEPOSIT')
                    ? watch('PREOD_DEPOSIT')
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : null
                }
                onChange={(e) => {
                  e.target.value = parseInt(e.target.value.replace(/,/g, '')) || null;
                  handleChange(e, 'PREOD_DEPOSIT')
                }}
              />
            </div>
          </div>
        </div>
        <div className='bw_col_4'>
          <div className='bw_frm_box'>
            <label style={{ fontSize: '14px' }}>Cài đặt Domain</label>
            <div style={{ display: 'flex' }}>
              <input type='text' value={watch('PREOD_DOMAIN')} />
            </div>
          </div>
          <FormItem label='Id sản phẩm quà tặng chương trình PreOrder' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_GIFTID'
              list={mapDataOptions4Select(watch('product_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Chương trình mã giảm giá cho sự kiện' isRequired={true} disabled={false}>
            <FormSelect
              field='AUTOCODE_COUPONID'
              list={mapDataOptions4Select(watch('coupon_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
      </div>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <div className='bw_frm_box'>
            <label style={{ fontSize: '14px' }}>CDN</label>
            <div style={{ display: 'flex' }}>
              <input type='text' value={watch('CDN')} onChange={(e) => handleChange(e, 'CDN')} />
            </div>
          </div>
        </div>
        <div className='bw_col_8'>
          <FormItem label='LDP_PREORDER' isRequired={true} disabled={false}>
            <FormTextArea field='LDP_PREORDER' placeholder='Nhập ghi chú' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default Other;
