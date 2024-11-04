import React, { useState } from 'react';

import { getListCustomer } from 'services/customer.service';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const CustomerInfor = ({ id, title }) => {
  const [customerOpts, setCustomerOpts] = useState([]);

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
        <FormItem label='Số điện thoại' className='bw_col_4' disabled>
          <FormInput type='text' field='phone_number' disabled placeholder='0346******' />
        </FormItem>
        <FormItem label='Địa chỉ' className='bw_col_4' disabled>
          <FormInput type='text' field='address_full' disabled placeholder='Địa chỉ' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default CustomerInfor;
