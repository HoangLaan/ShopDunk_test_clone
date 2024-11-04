import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FilterSearchBar from 'components/shared/FilterSearchBar';

const FilterProductRequisitionList = ({ onChange }) => {
  const methods = useForm();

  const onClear = () => {
    const initFilter = {
      search: '',
    };
    methods.reset(initFilter);
    onChange(initFilter);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        colSize={12}
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({ search: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập mã yêu cầu nhập hàng, chi nhánh yêu cầu, cửa hàng yêu cầu' />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default FilterProductRequisitionList;
