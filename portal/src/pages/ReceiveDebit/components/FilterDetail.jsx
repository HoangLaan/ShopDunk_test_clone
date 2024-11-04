import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { TimeRangeOpttions } from '../utils/constant';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { getListCustomer } from 'services/customer.service';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

const OtherVoucherFilter = ({ onChange, defaultFilter }) => {
  const methods = useForm({
    defaultValues: defaultFilter,
  });
  const { watch, setValue } = methods;
  const [customerOpts, setCustomerOpts] = useState([]);
  const dispatch = useDispatch();

  const paymentFormData = useSelector((state) => state.global?.paymentFormData);

  useEffect(() => {
    dispatch(getOptionsGlobal('paymentForm'));
  }, []);

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

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        colSize={3}
        onSubmit={(v) => {
          methods.setValue('search', v.search?.trim());
          // const customer_id = v.customer ? v.customer.member_id : null;
          // delete v.customer;
          // v.customer_id = customer_id;
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
                fieldStart={'start_date'}
                fieldEnd={'end_date'}
                placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Hình thức thanh toán',
            component: <FormSelect field='payment_form_id' list={mapDataOptions4SelectCustom(paymentFormData || [])} />,
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
