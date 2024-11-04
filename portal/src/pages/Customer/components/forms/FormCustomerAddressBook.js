import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormRadioGroup from 'components/shared/BWFormControl/FormRadioGroup';

import { phoneRule } from 'pages/Customer/utils/formRules';
import { GENDER } from 'pages/Customer/utils/constants';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';

function FormCustomerAddressBook({ disabled, title }) {

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem disabled={disabled} isRequired label='Họ tên'>
            <FormInput
              field='full_name'
              placeholder='Nhập họ tên'
              validation={{
                required: 'Họ tên là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Giới tính'>
            <FormRadioGroup
              field={'gender'}
              list={[
                { value: GENDER.MALE, label: 'Nam' },
                { value: GENDER.FEMALE, label: 'Nữ' },
              ]}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Số điện thoại' isRequired={true}>
            <FormInput
              field='phone_number'
              placeholder='Nhập số điện thoại'
              validation={phoneRule}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem disabled={disabled} label='Ghi chú'>
            <FormTextArea field='note' placeholder='Ghi chú' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default FormCustomerAddressBook;
