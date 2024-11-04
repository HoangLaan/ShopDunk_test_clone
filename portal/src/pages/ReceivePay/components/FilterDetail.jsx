import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { TimeRangeOpttions } from '../utils/constant';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getListCustomer } from 'services/customer.service';

const OtherVoucherFilter = ({ onChange, defaultFilter, setStartDate, setEndDate }) => {
  const methods = useForm({
    defaultValues: defaultFilter,
  });
  const { watch, setValue } = methods;
  const [customerOpts, setCustomerOpts] = useState([]);

  const onClear = () => {
    methods.reset(defaultFilter);
    onChange(defaultFilter);
  };

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

  useEffect(() => {
    fetchCustomer();
  }, []);

  useEffect(() => {
    const selectedTime = TimeRangeOpttions.find((_) => _.value === watch('time_range'));
    if (selectedTime) {
      setValue('start_date', selectedTime.start_date);
      setValue('end_date', selectedTime.end_date);
    }
  }, [watch('time_range')]);

  const start_date = watch('start_date');
  const end_date = watch('end_date');
  useEffect(() => {
    setStartDate(start_date);
    setEndDate(end_date);
  }, [start_date, end_date]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        colSize={4}
        onSubmit={(v) => {
          methods.setValue('search', v.search?.trim());
          // const supplier_id = v.customer ? v.customer.member_id : null;
          // delete v.customer;
          // v.supplier_id = supplier_id;
          v.page = 1;
          onChange(v);
        }}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput field='search' placeholder='Nhập số chứng từ, số tài khoản ngân hàng' maxLength={250} />
            ),
          },
          {
            title: 'Kỳ báo cáo',
            component: <FormSelect field='time_range' list={TimeRangeOpttions} />,
          },
          {
            title: 'Từ ngày - Đến ngày',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'start_date'}
                fieldEnd={'end_date'}
                placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          // {
          //   title: 'Khách hàng',
          //   component: (
          //     <FormDebouneSelect
          //       field='customer'
          //       id='customer'
          //       options={customerOpts}
          //       allowClear={true}
          //       style={{ width: '100%' }}
          //       fetchOptions={fetchCustomer}
          //       debounceTimeout={700}
          //       placeholder={'-- Chọn --'}
          //     />
          //   ),
          // },
        ]}
      />
    </FormProvider>
  );
};

export default OtherVoucherFilter;
