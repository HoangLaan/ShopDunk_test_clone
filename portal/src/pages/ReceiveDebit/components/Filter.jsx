import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { DefaultFilter, TimeRangeOpttions } from '../utils/constant';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { getVoucherTypeOptions } from 'services/other-acc-voucher.service';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { getListCustomer } from 'services/customer.service';

const ReceiveDebitFilter = ({ onChange }) => {
  const methods = useForm({
    defaultValues: DefaultFilter,
  });
  const { watch, setValue } = methods;
  const [customerOpts, setCustomerOpts] = useState([]);

  const companyOptions = useGetOptions(optionType.company);
  const businessOptions = useGetOptions(optionType.business, { params: { parent_id: watch('company_id') } });

  const onClear = () => {
    methods.reset(DefaultFilter);
    onChange(DefaultFilter);
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

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        colSize={3}
        onSubmit={(v) => {
          methods.setValue('search', v.search?.trim());
          const customer_id = v.customer ? v.customer.member_id : null;
          delete v.customer;
          v.customer_id = customer_id;
          v.page = 1;
          onChange(v);
        }}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput field='search' placeholder='Nhập Tên khách hàng, Mã số thuế, Mã khách hàng' maxLength={250} />
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
                fieldStart={'start_date'}
                fieldEnd={'end_date'}
                placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' list={companyOptions} />,
          },
          {
            title: 'Chi nhánh',
            component: <FormSelect field='business_id' list={businessOptions} />,
          },
          {
            title: 'Khách hàng',
            component: (
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
            ),
          },
          {
            title: 'Hình thức thanh toán',
            component: (
              <FormDebouneSelect
                field='payment_method'
                id='payment_method'
                allowClear={true}
                style={{ width: '100%' }}
                debounceTimeout={500}
                placeholder={'-- Chọn --'}
                onChange={(value) => {
                  methods.clearErrors('payment_method');
                  methods.setValue('payment_method', value);
                }}
                labelInValue={false}
              />
            ),
          },

        ]}
      />
    </FormProvider>
  );
};

export default ReceiveDebitFilter;
