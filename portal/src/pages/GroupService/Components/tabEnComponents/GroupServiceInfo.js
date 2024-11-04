import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';


export default function GroupServiceInfo({ disabled }) {

  return (
    <BWAccordion title='Thông tin nhóm dịch vụ' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Mã nhóm dịch vụ' isRequired={true}>
            <FormInput
              type='text'
              field='group_service_code'
              placeholder='Mã nhóm dịch vụ'
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Tên nhóm dịch vụ' isRequired={true}>
            <FormInput
              type='text'
              field='group_service_name_en'
              placeholder='Tên nhóm dịch vụ'
              disabled={disabled}
              validation={{
                required: 'Tên nhóm dịch vụ là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        {/* <FormItem label='Ngôn ngữ' isRequired={true}>
          <FormSelect
            field='language_id_en'
            value={(optionsLanguage || []).find(item => item.id === methods.watch('language_id'))}
            list={optionsLanguage}
            // validation={{
            //   required: 'Ngôn ngữ là bắt buộc',
            // }}
            disabled={disabled}
          />
        </FormItem> */}
      </div>
    </BWAccordion>
  );
}
