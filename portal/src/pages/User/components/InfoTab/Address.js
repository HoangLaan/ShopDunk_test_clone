import React from 'react';
//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWAddress from 'components/shared/BWAddress/index';

export default function Address({ disabled = true }) {
  return (
    <BWAccordion title='Nơi ở hiện tại' id='bw_info_more' isRequired={true}>
      <div className='bw_row'>
        <FormItem className='bw_col_4' label='Quốc gia' isRequired={true}>
          <BWAddress
            field='current_country_id'
            type='country'
            placeholder='Chọn'
            disabled={disabled}
            validation={{
              required: 'Quốc gia là bắt buộc.',
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Tỉnh/Thành phố' isRequired={true}>
          <BWAddress
            field='current_province_id'
            parentField='current_country_id'
            type='province'
            placeholder='Chọn'
            disabled={disabled}
            validation={{
              required: 'Tỉnh/Thành phố là bắt buộc.',
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Quận/Huyện' isRequired={true}>
          <BWAddress
            field='current_district_id'
            parentField='current_province_id'
            type='district'
            placeholder='Chọn'
            disabled={disabled}
            validation={{
              required: 'Quận/Huyện phố là bắt buộc.',
            }}
          />
        </FormItem>
        <FormItem className='bw_col_4' label='Phường/Xã' isRequired={true}>
          <BWAddress
            field='current_ward_id'
            type='ward'
            parentField='current_district_id'
            placeholder='Chọn'
            disabled={disabled}
            validation={{
              required: 'Phường/Xã là bắt buộc.',
            }}
          />
        </FormItem>
        <FormItem className='bw_col_8' label='Số nhà, tên đường' isRequired={true}>
          <FormInput
            type='text'
            field='current_address'
            placeholder='VD: 46 Cửu long'
            disabled={disabled}
            validation={{
              required: 'Số nhà, tên đường là bắt buộc.',
            }}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
}
