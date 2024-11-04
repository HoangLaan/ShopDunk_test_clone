import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FilterSearchBarCustom from '../Filters/FilterSearchBarCustom';

const ModalDepartmentFilter = ({ onChange, optionsCompany }) => {
  const methods = useForm();

  const handleKeyDownSearch = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      methods.handleSubmit(onChange)(event);
    }
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBarCustom
        title='Tìm kiếm'
        itemColSize={6}
        onSubmit={onChange}
        onClear={() => onChange({ search: '', company_id: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput onKeyDown={handleKeyDownSearch} field='search' placeholder='Tên phòng ban' />,
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' id='bw_company' list={optionsCompany} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default ModalDepartmentFilter;
