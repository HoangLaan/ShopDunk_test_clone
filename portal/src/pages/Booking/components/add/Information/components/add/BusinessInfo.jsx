import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getListAddressBook, getListCustomer } from 'pages/Orders/helpers/call-api';
import { resetMoneyAndPromotion } from 'pages/Orders/helpers/utils';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const BusinessInfo = ({ id, title, nameInstanceBusiness, isShowStore = false }) => {
  const { setValue, watch } = useFormContext({});

  const business_name = watch('business_receive.business_name');
  const business_tax_code = watch('business_receive.business_tax_code');
  const business_email = watch('business_receive.business_email');
  const business_address_full = watch('business_receive.business_address_full');
  useEffect(() => {
    setValue('invoice_full_name', business_name);
    setValue('invoice_tax', business_tax_code);
    setValue('invoice_company_name', business_name);
    setValue('invoice_email', business_email);
    setValue('invoice_address', business_address_full);
  }, [business_name, business_tax_code, business_email, business_address_full]);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row bw_mt_1'>
        <FormItem label='Chi nhánh' className='bw_col_4' disabled>
          <FormInput type='text' field={`${nameInstanceBusiness}.business_name`} disabled placeholder='Chi nhánh' />
        </FormItem>
        <FormItem label='Mã số thuế' className='bw_col_4' disabled>
          <FormInput
            type='text'
            field={`${nameInstanceBusiness}.business_tax_code`}
            disabled
            placeholder='Mã số thuế'
          />
        </FormItem>
        <FormItem label='Số điện thoại' className='bw_col_4' disabled>
          <FormInput
            type='text'
            field={`${nameInstanceBusiness}.business_phone_number`}
            disabled
            placeholder='Số điện thoại'
          />
        </FormItem>
        <FormItem label='Địa chỉ' className='bw_col_8' disabled>
          <FormInput
            type='text'
            field={`${nameInstanceBusiness}.business_address_full`}
            disabled
            placeholder='Địa chỉ'
          />
        </FormItem>
        {isShowStore ? (
          <FormItem label='Cửa hàng' className='bw_col_4' disabled>
            <FormInput type='text' field={`${nameInstanceBusiness}.store_name`} disabled placeholder='Cửa hàng' />
          </FormItem>
        ) : (
          <></>
        )}
      </div>
    </BWAccordion>
  );
};

export default BusinessInfo;
