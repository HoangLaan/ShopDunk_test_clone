import React from 'react';
// Compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWAddress from 'components/shared/BWAddress/index';

export default function NativeVillage({ title, disabled = true }) {
  return (
    <BWAccordion title={title} id='bw_real_addrees'>
      <div className='bw_row'>
        <FormItem className='bw_col_4' label='Quốc gia' disabled={disabled}>
          <BWAddress
            field='country_id'
            type='country'
            placeholder='Chọn'
            // validation={{
            //   required: 'Quốc gia là bắt buộc.',
            // }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Tỉnh/Thành phố' disabled={disabled}>
          <BWAddress
            field='province_id'
            type='province'
            placeholder='Chọn'
            // validation={{
            //   required: 'Tỉnh/Thành phố là bắt buộc.',
            // }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Quận/Huyện' disabled={disabled}>
          <BWAddress
            field='district_id'
            type='district'
            placeholder='Chọn'
            // validation={{
            //   required: 'Quận/Huyện phố là bắt buộc.',
            // }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Phường/Xã' disabled={disabled}>
          <BWAddress
            field='ward_id'
            type='ward'
            placeholder='Chọn'
            // validation={{
            //   required: 'Phường/Xã phố là bắt buộc.',
            // }}
          />
        </FormItem>
        <FormItem className='bw_col_8' label='Số nhà, tên đường' disabled={disabled}>
          <FormInput
            type='text'
            field='address'
            placeholder='VD: 46 Cửu long'
            // validation={{
            //   required: 'Số nhà, tên đường là bắt buộc',
            // }}
            disabled={disabled}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
}
