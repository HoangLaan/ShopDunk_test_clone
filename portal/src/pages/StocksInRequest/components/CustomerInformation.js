import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getCustomerOptions } from 'services/stocks-in-request.service';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { Spin } from 'antd';

const customerTypeOptions = [
  {
    value: 1,
    label: 'Khách hàng cá nhân',
  },
  {
    value: 2,
    label: 'Khách hàng doanh nghiệp',
  },
];

function CustomerInformation({ disabled }) {
  const { watch, setValue } = useFormContext();
  const customer_type = watch('customer_type');
  const [customerOptions, setCustomerOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCustomerOptions = useCallback(() => {
    setIsLoading(true);
    getCustomerOptions({ customer_type })
      .then(setCustomerOptions)
      .finally(() => setIsLoading(false));
  }, [customer_type]);

  useEffect(fetchCustomerOptions, [fetchCustomerOptions]);

  return (
    <>
      <FormItem className='bw_col_6' label='Loại khách hàng' isRequired disabled={disabled}>
        <FormSelect field={'customer_type'} list={customerTypeOptions} />
      </FormItem>

      <FormItem className='bw_col_6' label='Khách hàng' isRequired disabled={disabled || !customer_type}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin />
          </div>
        ) : (
          <FormSelect
            field='member_id'
            list={customerOptions}
            validation={{
              required: 'Khách hàng là bắt buộc',
            }}
          />
        )}
      </FormItem>
      <FormItem className='bw_col_3' disabled={disabled}>
        <label className='bw_checkbox'>
          <FormInput type='checkbox' field='is_odd_customer' />
          <span />
          Khách lẻ
        </label>
      </FormItem>
    </>
  );
}

export default CustomerInformation;
