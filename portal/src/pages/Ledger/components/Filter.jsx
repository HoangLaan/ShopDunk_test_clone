import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { AccountingPeriodOptions, BooleanOptions, DefaultFilter, TYPE_ACCOUNT } from '../utils/constant';
import FormInput from 'components/shared/BWFormControl/FormInput';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { useDispatch } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

const LedgerFilter = ({ onChange, setCreatedDateFrom, setCreatedDateTo, paymentFormData = [] }) => {
  // const methods = useForm({
  //   defaultValues: DefaultFilter,
  // });
  const methods = useFormContext();
  const { watch, getValues } = methods;
  const dispatch = useDispatch();

  const dateFrom = watch('created_date_from');
  const dateTo = watch('created_date_to');

  const onClear = () => {
    methods.reset(DefaultFilter);
    onChange(DefaultFilter);
    setTimeCreated();
  };

  const businessOptions = useGetOptions(optionType.business, { isHasOptionAll: true });

  useEffect(() => {
    setCreatedDateFrom(dateFrom);
    setCreatedDateTo(dateTo);
  }, [dateFrom, dateTo]);

  const period = watch('period');
  const setTimeCreated = useCallback(() => {
    if (!period) return () => {};
    const selectedItem = AccountingPeriodOptions.find((_) => _.value === period);
    if (!selectedItem) return () => {};
    methods.setValue('created_date_from', selectedItem.from_date);
    methods.setValue('created_date_to', selectedItem.to_date);
  }, [period]);

  useEffect(() => {
    setTimeCreated();
  }, [setTimeCreated]);

  useEffect(() => {
    dispatch(getOptionsGlobal('paymentForm'));
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={(v) => {
          onChange({ ...v, search: v.search?.trim(), page: 1 });
        }}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder='Nhập mã số chứng từ, mã đối tượng' field='search' />,
          },
          {
            title: 'Loại chứng từ',
            component: <FormSelect list={TYPE_ACCOUNT} field='type_account' />,
          },
          {
            title: 'Chi nhánh',
            component: <FormSelect list={businessOptions} field='business_id' />,
          },
          {
            title: 'Kỳ báo cáo',
            component: (
              <FormSelect
                field='period'
                list={AccountingPeriodOptions}
                onChange={(value) => {
                  methods.setValue('period', value);
                  const selectedItem = AccountingPeriodOptions.find((_) => _.value === value);
                  if (selectedItem) {
                    methods.setValue('created_date_from', selectedItem.from_date);
                    methods.setValue('created_date_to', selectedItem.to_date);
                  }
                }}
              />
            ),
          },
          {
            title: 'Khoảng thời gian',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'created_date_from'}
                fieldEnd={'created_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Hình thức thanh toán',
            component: <FormSelect field='payment_form_id' list={mapDataOptions4SelectCustom(paymentFormData)} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default LedgerFilter;
