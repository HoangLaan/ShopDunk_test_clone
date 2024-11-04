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
import CustomerAddModal from 'pages/Orders/components/add/Information/components/CustomerModel/CustomerAddModal';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { orderType } from 'pages/Orders/helpers/constans';
import { CUSTOMER_TYPE } from 'pages/CustomerType/utils/constants';
import BWLoader from 'components/shared/BWLoader/index';
import Panel from 'components/shared/Panel/index';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const CustomerInfor = ({ id, title, disabled, orderId }) => {
  const methods = useFormContext({});
  const { setValue, clearErrors, watch } = methods; 
  const [showModalAddCustomer, setShowModalCustomer] = useState(false);
  const member_id = watch('member_id');
  const currentUrl = window.location.href;
  const urlParams = new URLSearchParams(currentUrl);
  const customer_id = urlParams.get('customer_id');
  const typeOrder = watch('order_type');
  const [loading, setLoading] = useState(false);
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  
  const loadingForm = loading

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
  }, [member_id, setValue]);

  const fetchCustomer = useCallback((value) => {
    setLoading(true);
    return getListCustomer({
      search: value,
      itemsPerPage: 50,
      customer_type: +typeOrder === orderType.WHOLESALE_ORDERS ? CUSTOMER_TYPE.BUSINESS : null, //CUSTOMER_TYPE.INDIVIDUAL 
      customer_id: customer_id
      //Kiểm tra nếu loại đơn hàng là bán buôn thì lấy khách hàng doanh nghiệp
    }).then((body) => {
      const _customerOpts = body.items.map((_res) => ({
        label: _res.customer_code + '-' + _res.full_name,
        value: Boolean(+_res.member_id) ? `KH${_res.member_id}` : `TN${_res.dataleads_id}`,
        ..._res,
      }));
      if(customer_id) {
        const defaultOption = _customerOpts.find(option => option?.value == `KH${customer_id}` || option?.value == `TN${customer_id}`);
        if (defaultOption) {
          setValue('customer', defaultOption);
          setValue('member_id', defaultOption?.member_id);
          setValue('dataleads_id', defaultOption?.dataleads_id);
          setValue('phone_number', defaultOption?.phone_number);
          setValue('address_full', defaultOption?.address_full);
          setValue('current_point', defaultOption?.current_point);
          setValue('customer_type_name', defaultOption?.customer_type_name);
          setValue('customer_type_id', defaultOption?.customer_type_id);
          setValue('invoice_full_name', defaultOption?.full_name);
          setValue('invoice_address', defaultOption?.address_full);
          getInitAddress(defaultOption?.member_id);
        }
      }
    
      return _customerOpts;
    }).finally(() => {
      setLoading(false);
    });
  }, [typeOrder]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

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
        <FormItem label='Tên khách hàng hoặc Số điện thoại' className='bw_col_4' disabled={disabled} isRequired>
          <FormDebouneSelect
            field='customer'
            id='customer'
            allowClear={true}
            noCallApi={true}
            style={{ width: '100%' }}
            fetchOptions={fetchCustomer}
            debounceTimeout={700}
            placeholder={'-- Tìm kiếm --'}
            validation={{
              required: 'Khách hàng là bắt buộc',
            }}
            onChange={(_, opt) => {
              setValue('customer', { ..._, ...opt });
              setValue('member_id', opt?.member_id);
              setValue('dataleads_id', opt?.dataleads_id);
              setValue('phone_number', opt?.phone_number);
              setValue('address_full', opt?.address_full);
              setValue('current_point', opt?.current_point);
              setValue('customer_type_name', opt?.customer_type_name);
              setValue('customer_type_id', opt?.customer_type_id);
              setValue('invoice_full_name', opt?.full_name);
              setValue('invoice_address', opt?.address_full);
              getInitAddress(opt?.member_id);
              clearErrors('customer');
              resetMoneyAndPromotion(watch, setValue);
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
            setValue('address_full', customer?.address_full);
            setValue('customer_type_id', customer?.customer_type_id);
            setValue('current_point', 0);
            setValue('customer_type_name', customer?.customer_type_name);
            setValue('invoice_full_name', customer?.full_name);
            setValue('invoice_address', customer?.address_full);
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