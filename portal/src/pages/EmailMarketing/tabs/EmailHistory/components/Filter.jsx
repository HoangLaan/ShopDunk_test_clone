import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { MAIL_STATUS } from 'pages/EmailMarketing/utils/constants';

const EmailHistoryFilter = ({ onChange }) => {
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
            component: <FormInput field='search' placeholder='Nhập mail nhận, tiêu đề gửi mail' maxLength={250} />,
          },
          {
            title: 'Ngày gửi mail',
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
            title: 'Nhà cung cấp',
            component: <FormSelect defaultValue={1} field='mail_supplier' list={[{ label: 'Mailchimp', value: 1 }]} />,
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

export default EmailHistoryFilter;
