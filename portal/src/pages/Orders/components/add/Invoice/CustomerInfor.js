import React, { useState } from 'react';

import { getListCustomer } from 'services/customer.service';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { useFormContext } from 'react-hook-form';

const CustomerInfor = ({ id, title, disabled }) => {
  const [customerOpts, setCustomerOpts] = useState([]);
  const methods = useFormContext();
  const { watch } = methods;

  const fetchCustomer = async (value) => {
    return getListCustomer({
      search: value,
      is_active: 1,
      itemsPerPage: 50,
    }).then((body) => {
      const _customerOpts = body.items.map((_res) => ({
        label: _res.customer_code + '-' + _res.full_name,
        value: Boolean(+_res.member_id) ? `KH${_res.member_id}` : `TN${_res.dataleads_id}`,
        ..._res,
      }));
      setCustomerOpts(_customerOpts);
    });
  };

  return (
    <BWAccordion title={title} id={id} isRequired>
      <div className='bw_row bw_mt_1'>
        {watch('order_type') !== 11 ? (
          <FormItem label='Khách hàng' className='bw_col_4' disabled isRequired>
            <FormDebouneSelect
              field='customer'
              id='customer'
              options={customerOpts}
              allowClear={true}
              style={{ width: '100%' }}
              fetchOptions={fetchCustomer}
              debounceTimeout={700}
              placeholder={'-- Chọn --'}
            />
          </FormItem>
        ) : (
          <FormItem label='Khách hàng' className='bw_col_4' disabled>
            <FormInput type='text' field={`business_receive.business_name`} disabled placeholder='Khách hàng' />
          </FormItem>
        )}
        {watch('order_type') !== 11 ? (
          <FormItem label='Số điện thoại' className='bw_col_4' disabled>
            <FormInput type='text' field='phone_number' disabled placeholder='0346******' />
          </FormItem>
        ) : (
          <FormItem label='Số điện thoại' className='bw_col_4' disabled>
            <FormInput
              type='text'
              field={`business_receive.business_phone_number`}
              disabled
              placeholder='Số điện thoại'
            />
          </FormItem>
        )}
        {watch('order_type') !== 11 ? (
          <FormItem label='Địa chỉ' className='bw_col_4' disabled>
            <FormInput type='text' field='address_full' disabled placeholder='Địa chỉ' />
          </FormItem>
        ) : (
          <FormItem label='Địa chỉ' className='bw_col_4' disabled>
            <FormInput type='text' field={`business_receive.business_address_full`} disabled placeholder='Địa chỉ' />
          </FormItem>
        )}

        <FormItem label='Mã số thuế' className='bw_col_4' disabled>
          <FormInput type='text' field='invoice_tax' disabled placeholder='Mã số thuế' />
        </FormItem>
        <FormItem label='Tên khách hàng' className='bw_col_4' disabled>
          <FormInput type='text' field='invoice_full_name' disabled placeholder='Tên khách hàng' />
        </FormItem>
        <FormItem label='Tên đơn vị' className='bw_col_4' disabled>
          <FormInput type='text' field='invoice_company_name' disabled placeholder='Tên đơn vị' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default CustomerInfor;
