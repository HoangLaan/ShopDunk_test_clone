import React, { useState, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { Spin } from 'antd';
import { getCustomerOptions } from '../helpers/call-api';
import { customerTypeOptions } from '../utils/constants';

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
      <FormItem className='bw_col_4' label='Loại khách hàng' disabled={disabled}>
        <FormSelect field={'customer_type'} list={customerTypeOptions} allowClear />
      </FormItem>

      <FormItem className='bw_col_4' label='Khách hàng' disabled={disabled || !customer_type}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin />
          </div>
        ) : (
          <FormSelect
            field='member_id'
            list={customerOptions}
            allowClear
            // validation={{
            //   required: 'Khách hàng là bắt buộc',
            // }}
          />
        )}
      </FormItem>
    </>
  );
}

export default CustomerInformation;
