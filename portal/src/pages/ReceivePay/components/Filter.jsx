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
import { getOptionsSupplier } from 'services/supplier.service';

const ReceivePayFilter = ({ onChange }) => {
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

  const fetchSupplier = async (value) => {
    return getOptionsSupplier({
      search: value,
    }).then((body) => {
      setCustomerOpts(
        body.map((_) => ({
          label: _?.name,
          value: _?.id,
        })),
      );
    });
  };

  useEffect(() => {
    fetchSupplier();
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
          const supplier_id = v.customer ? v.customer.value : null;
          delete v.customer;
          v.supplier_id = supplier_id;
          v.page = 1;
          onChange(v);
        }}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput field='search' placeholder='Nhập Tên đối tượng, Mã số thuế, Mã đối tượng' maxLength={250} />
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
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' list={companyOptions} />,
          },
          {
            title: 'Chi nhánh',
            component: <FormSelect field='business_id' list={businessOptions} />,
          },
          {
            title: 'Đối tượng',
            component: (
              <FormDebouneSelect
                field='customer'
                id='customer'
                options={customerOpts}
                allowClear={true}
                style={{ width: '100%' }}
                fetchOptions={fetchSupplier}
                debounceTimeout={700}
                placeholder={'-- Chọn --'}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default ReceivePayFilter;
