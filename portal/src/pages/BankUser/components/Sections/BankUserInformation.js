import React from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { FORM_RULES } from 'utils/constants';

function BankUserInformation({ disabled, title }) {
  // const companyOptions = useGetOptions(optionType.company);
  const bankOptions = useGetOptions(optionType.bank, { valueAsString: true });
  const provinceOptions = useGetOptions(optionType.province);
  console.log(bankOptions)

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        {/* <div className='bw_col_12'>
          <FormItem label='Công ty' isRequired disabled={disabled}>
            <FormSelect field='company_id' list={companyOptions} validation={{ required: 'Công ty là bắt buộc' }} />
          </FormItem>
        </div> */}
        <div className='bw_col_6'>
          <FormItem label='Số tài khoản' isRequired={true} disabled={disabled}>
            <FormInput
              field='bank_number'
              placeholder='Nhập số tài khoản'
              validation={{
                required: 'Số tài khoản là bắt buộc',
                ...FORM_RULES.number('Số tài khoản phải là số'),
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Ngân hàng' isRequired={true} disabled={disabled}>
            <FormSelect field='bank_id' list={bankOptions} validation={{ required: 'Ngân hàng là bắt buộc' }} />
          </FormItem>
        </div>
        {/* <div className='bw_col_6'>
          <FormItem label='Tỉnh/Thành phố' disabled={disabled}>
            <FormSelect field='province_id' list={provinceOptions} />
          </FormItem>
        </div> */}
        <div className='bw_col_6'>
          <FormItem label='Chi nhánh' disabled={disabled}>
            <FormInput field='bank_branch' placeholder='Nhập chi nhánh' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Địa chỉ chi nhánh' disabled={disabled}>
            <FormInput field='branch_address' placeholder='Nhập địa chỉ chi nhánh' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Chủ tài khoản' isRequired={true} disabled={disabled}>
            <FormInput field='bank_username' placeholder='Nhập chủ tài khoản' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea field='description' placeholder='Nhập mô tả' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default BankUserInformation;
