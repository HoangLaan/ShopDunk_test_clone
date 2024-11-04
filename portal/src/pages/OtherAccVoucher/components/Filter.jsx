import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { BookkeepingStatusOption, DefaultFilter, TimeRangeOpttions } from '../utils/constant';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { getVoucherTypeOptions } from 'services/other-acc-voucher.service';

const OtherVoucherFilter = ({ onChange }) => {
  const methods = useForm({
    defaultValues: DefaultFilter,
  });
  const [voucherType, setVoucherType] = useState([]);

  const { watch, setValue } = methods;

  const onClear = () => {
    methods.reset(DefaultFilter);
    onChange(DefaultFilter);
  };

  useEffect(() => {
    getVoucherTypeOptions().then(setVoucherType);
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
          onChange(v);
        }}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập số chưng từ, diễn giải' maxLength={250} />,
          },
          {
            title: 'Loại chứng từ',
            component: (
              <FormSelect
                field='voucher_type'
                list={[
                  {
                    value: 0,
                    label: 'Tất cả',
                  },
                  ...voucherType,
                ]}
              />
            ),
          },
          {
            title: 'Thời gian',
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
            title: 'Trạng thái ghi sổ',
            component: <FormSelect field='is_bookkeeping' list={BookkeepingStatusOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default OtherVoucherFilter;
