import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FilterSearchBarCustom from '../Filters/FilterSearchBarCustom';

const ModalStoreFilter = ({ onChange, optionsArea }) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <FilterSearchBarCustom
        title='Tìm kiếm'
        itemColSize={6}
        onSubmit={onChange}
        onClear={() => onChange({ search: '', area_id: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Tên cửa hàng' />,
          },
          {
            title: 'Khu vực',
            component: <FormSelect field='area_id' id='bw_area' list={optionsArea} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default ModalStoreFilter;
