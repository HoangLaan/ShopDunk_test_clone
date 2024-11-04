import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getListAddressBook, getListCustomer } from 'pages/Booking/helpers/call-api';
import { resetMoneyAndPromotion } from 'pages/Booking/helpers/utils';

//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import BWButton from 'components/shared/BWButton/index';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import CustomerAddModal from 'pages/Booking/components/add/Information/components/CustomerModel/CustomerAddModal';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

const CustomerInfor = ({ id, title, disabled, orderId, userSchedule }) => {
  const methods = useFormContext({});
  const { setValue, clearErrors, watch } = methods;
  const [showModalAddCustomer, setShowModalCustomer] = useState(false);
  const member_id = watch('member_id');
  const customer_name = watch('customer_name');
  const customer_email = watch('customer_email');
  const customer_phone = watch('customer_phone');

  console.log('member_id', member_id)
  const getInitAddress = useCallback(() => {
    if (member_id) {
      getListAddressBook(member_id).then((res) => {
        // Kiểm tra nếu chưa có chọn địa chỉ giao ==> lấy địa chỉ mặc định
        const addressDefault = (res || []).find((_address) => _address.is_default);

        if (addressDefault) {
          setValue('address_id', addressDefault?.address_id);
        }
      });
    }
    console.log(member_id)
  }, [member_id, setValue]);

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
  console.log(customer_name);
  return (
    <BWAccordion title={title} id={id} isRequired>
      {!disabled ? (
        <BWButton
          type='success'
          outline={true}
          icon='fi fi-rr-plus'
          content='Thêm mới KH'
          onClick={() => setShowModalCustomer(true)}></BWButton>
      ) : null}

      {/* {Boolean(watch('member_id')) ? (
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
      )} */}

      <div className='bw_row bw_mt_1'>
        <FormItem label='Khách hàng' className='bw_col_4' disabled={disabled} isRequired>
          <FormDebouneSelect
            field='customer_name'
            id='customer'
            // options={customerOpts}
            allowClear={true}
            style={{ width: '100%' }}
            fetchOptions={fetchCustomer}
            debounceTimeout={700}
            placeholder={'-- Chọn --'}
            // validation={{
            //   required: 'Khách hàng là bắt buộc',
            // }}
            onChange={(_, opt) => {
              setValue('customer', { ..._, ...opt });
              setValue('member_id', opt?.member_id);
              setValue('dataleads_id', opt?.dataleads_id);
              setValue('customer_phone', opt?.phone_number);
              setValue('customer_email', opt?.email);
              setValue('customer_type_name', opt?.customer_type_name);
              setValue('customer_type_id', opt?.customer_type_id);
              setValue('invoice_full_name', opt?.full_name);
              getInitAddress(opt?.member_id);
              clearErrors('customer');
              resetMoneyAndPromotion(watch, setValue);
            }}
          />
        </FormItem>
        <FormItem label='Số điện thoại' className='bw_col_4' disabled>
          <FormInput type='text' field='customer_phone' disabled placeholder='Số điện thoại' />
        </FormItem>
        <FormItem label='Email' className='bw_col_4' disabled>
          <FormInput type='text' field='customer_email' disabled placeholder='Email' />
        </FormItem>
        <FormItem label='Ghi chú' className='bw_col_12'>
          <FormTextArea style={{ maxWidth: '100%', minWidth: '100%' }} rows={9} field='description' />
        </FormItem>
      </div>
      {showModalAddCustomer && (
        <CustomerAddModal
          onClose={() => setShowModalCustomer(false)}
          getOptsCustomer={fetchCustomer}
          setValueCustomer={(customer) => {
            setValue('customer', {
              ...customer,
              value: `KH${customer.member_id}`,
              label: `${customer.customer_code}-${customer.full_name}`,
            });

            setValue('member_id', customer.member_id);
            setValue('phone_number', customer?.phone_number);
            setValue('email', customer?.email);
            setValue('customer_type_id', customer?.customer_type_id);
            setValue('customer_type_name', customer?.customer_type_name);
            setValue('invoice_full_name', customer?.full_name);
            getInitAddress(customer?.member_id);
            clearErrors('customer');
            resetMoneyAndPromotion(watch, setValue);
          }}
        />
      )}
    </BWAccordion>
  );
};

export default CustomerInfor;
