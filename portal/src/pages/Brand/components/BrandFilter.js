import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

const BrandFilter = ({ onChange }) => {
  const methods = useForm();

  const dispatch = useDispatch();
  const { companyData } = useSelector((state) => state.global);

  useEffect(() => {
    if (!companyData) dispatch(getOptionsGlobal('company'));
  }, []);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            search: '',
            is_active: 1,
            create_date_from: null,
            create_date_to: null,
            company_id: null,
            page: 1,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Nhập tên thương hiệu' />,
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' list={mapDataOptions4SelectCustom(companyData)} />,
          },
          {
            title: 'Ngày tạo',
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
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default BrandFilter;
