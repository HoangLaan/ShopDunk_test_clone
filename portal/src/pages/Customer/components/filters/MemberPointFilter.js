import React from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';

const INIT_FILTER = {
  created_date_from: null,
  created_date_to: null,
};

const MemberPointFilter = ({ onChange }) => {
  const methods = useForm();

  const onClear = () => {
    methods.reset(INIT_FILTER);
    onChange(INIT_FILTER);
  };

  return (
    <div className='bw_customer_filter'>
      <FormProvider {...methods}>
        <FilterSearchBar
          title={'Tìm kiếm'}
          onSubmit={onChange}
          onClear={onClear}
          actions={[
            {
              title: 'Ngày tạo',
              component: (
                <FormRangePicker
                  style={{ width: '100%' }}
                  allowClear={true}
                  fieldStart={'created_date_from'}
                  fieldEnd={'created_date_to'}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  format={'DD/MM/YYYY'}
                />
              ),
            },
          ]}
        />
      </FormProvider>
    </div>
  );
};

export default MemberPointFilter;
