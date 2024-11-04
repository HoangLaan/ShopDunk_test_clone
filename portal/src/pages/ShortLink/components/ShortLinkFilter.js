import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { statusTypesOption } from 'utils/helpers';
import { STATUS_TYPES } from 'utils/constants';


const initFilter = {
    search: null,
    is_active: 1,
  };

function ShortLinkFilter({ onChange, onClearParams }) {
    const methods = useForm();

    const onClear = () => {
      methods.reset(initFilter);
      onClearParams(initFilter);
    };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        colSize={4}
        onClear={() => onClear({ search: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Tên short-link' />,
          },
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  )
}

export default ShortLinkFilter