import React, { useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { getListCustomer } from 'pages/ReviewList/helpers/call-api';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

const CustomerInforPreOrder = ({ id, title, disabled, orderId }) => {
  const methods = useFormContext({});
  const { watch } = methods;

  const fetchCustomer = useCallback((value) => {
    return getListCustomer({
      search: value,
      itemsPerPage: 50,
    }).then((body) => {
      const _customerOpts = body.items.map((_res) => ({
        label: _res.customer_code + '-' + _res.full_name,
        value: Boolean(+_res.member_id) ? `KH${_res.member_id}` : `TN${_res.dataleads_id}`,
        ..._res,
      }));
      return _customerOpts;
    });
  }, []);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return (
    <BWAccordion title={title} id={id} isRequired>
      {Boolean(watch('member_id')) ? (
        <BWButton
          style={{ marginLeft: '10px' }}
          type='success'
          outline={true}
          icon='fi fi-rr-search-alt'
          content='Chi tiết KH'
          onClick={() =>
            window.open('/customer/detail/' + watch('member_id'), '_blank', 'rel=noopener noreferrer')
          }></BWButton>
      ) : (
        Boolean(watch('dataleads_id')) && (
          <BWButton
            style={{ marginLeft: '10px' }}
            type='success'
            outline={true}
            icon='fi fi-rr-search-alt'
            content='Chi tiết KH'
            onClick={() =>
              window.open('/customer-lead/detail/' + watch('dataleads_id'), '_blank', 'rel=noopener noreferrer')
            }></BWButton>
        )
      )}

      <div className='bw_row bw_mt_1'>
        <FormItem label='Khách hàng' className='bw_col_4' disabled isRequired>
          <FormDebouneSelect
            field='customer'
            id='customer'
            // options={customerOpts}
            allowClear={true}
            style={{ width: '100%' }}
            fetchOptions={fetchCustomer}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
            validation={{
              required: 'Khách hàng là bắt buộc',
            }}
          />
        </FormItem>
        <FormItem label='Số điện thoại' className='bw_col_4' disabled>
          <FormInput type='text' field='phone_number' disabled placeholder='Số điện thoại' />
        </FormItem>
        <FormItem label='Tổng điểm' className='bw_col_4' disabled>
          <FormNumber field='current_point' disabled placeholder='0' />
        </FormItem>
        <FormItem label='Hạng khách hàng' className='bw_col_4' disabled>
          <FormInput type='text' field='customer_type_name' disabled placeholder='Hạng khách hàng' />
        </FormItem>
        <FormItem label='Địa chỉ' className='bw_col_8' disabled>
          <FormInput type='text' field='address_full' disabled placeholder='Địa chỉ' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default CustomerInforPreOrder;
