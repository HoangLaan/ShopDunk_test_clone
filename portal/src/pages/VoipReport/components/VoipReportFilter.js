import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import { TYPE_REPORT, DEFAULT_VALUE } from '../utils/constants';

const CDRsFilter = ({ onChange }) => {

  const methods = useForm({
    defaultValues: DEFAULT_VALUE,
  });

  useEffect(() => {
    methods.reset(DEFAULT_VALUE);
  }, []);

  const onClear = () => {
    methods.reset(DEFAULT_VALUE);
    onChange(DEFAULT_VALUE);
  };


  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={(values) => {
          onChange({ ...values });
        }}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Loại báo cáo',
            component: (
              <FormSelect
                field='type_report'
                list={TYPE_REPORT}
                style={{
                  width: '100%',
                }}
              />
            ),
          },
          {
            title: 'Thời gian',
            component: (
              <FormRangePicker
                fieldStart={'start_date'}
                fieldEnd={'end_date'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
        ]}
        colSize={6}
      />
    </FormProvider>
  );
};

export default CDRsFilter;
