import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { MAIL_STATUS } from 'pages/EmailMarketing/utils/constants';

const ZaloHistoryFilter = ({ onChange }) => {
  const methods = useForm();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const onClear = () => {
    methods.reset({
      search: '',
      created_date_from: null,
      created_date_to: null,
      status: null,
    });
    onChange({
      search: '',
      created_date_from: null,
      created_date_to: null,
      status: null,
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={(v) => {
          methods.setValue('search', v.search?.trim());
          onChange(v);
        }}
        onClear={() => onClear()}
        actions={[
          {
            title: 'Tìm kiếm',
            component: <FormInput field='search' placeholder='Nhập tiêu đề gửi zalo' maxLength={250} />,
          },
          {
            title: 'Ngày gửi',
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
            title: 'Trạng thái gửi',
            component: <FormSelect field='status' list={MAIL_STATUS} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default ZaloHistoryFilter;
