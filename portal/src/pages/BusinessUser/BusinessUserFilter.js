import React, { useEffect, useState } from 'react';
import { useAuth } from 'context/AuthProvider';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { getOptionsForUser } from 'services/company.service';
import { mapDataOptions4Select } from 'utils/helpers';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { GENDER_OPTIONS } from 'utils/constants';
import { getStoreOptions } from 'services/purchase-requisition.service';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

function BusinessUserFilter({ onChange }) {
  const { user } = useAuth();
  const methods = useForm();
  const [optionsCompany, setOptionsCompany] = useState(null);
  const [optionsStore, setOptionsStore] = useState(null);
  const optionsCluster = useGetOptions(optionType.cluster);
  useEffect(() => {
    methods.register('company_id');
    methods.register('cluster_id');
    methods.register('store_id');
    methods.register('gender');
  }, [methods.register]);

  const getDataOptions = async () => {
    let _companys = await getOptionsForUser(user.user_name);

    let _store = await getStoreOptions();
    setOptionsCompany(mapDataOptions4Select(_companys));

    setOptionsStore(mapDataOptions4Select(_store));
  };

  useEffect(() => {
    getDataOptions();
  }, []);

  const onSubmit = () => {
    const q = {
      search: methods.watch('search'),
      company_id: methods.watch('company_id'),
      cluster_id: methods.watch('cluster_id'),
      store_id: methods.watch('store_id'),
      gender: methods.watch('gender'),
    };
    onChange(q);
  };

  const onClear = () => {
    methods.reset({
      search: '',
      company_id: null,
      cluster_id: null,
      store_id: null,
      gender: null,
    });
    onChange({
      search: '',
      company_id: null,
      cluster_id: null,
      store_id: null,
      gender: null,
    });
  };

  const handleChangeCompany = async (company_id) => {
    methods.setValue('company_id', company_id);
  };

  const handleKeyDownSearch = (event) => {
    if (1 * event.keyCode === 13) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                handleKeyDown={handleKeyDownSearch}
                type='text'
                placeholder='Nhập mã, tên nhân viên'
                field='search'
              />
            ),
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' list={optionsCompany} onChange={handleChangeCompany} />,
          },
          {
            title: 'Cụm',
            component: <FormSelect field='cluster_id' list={optionsCluster} />,
          },
          {
            title: 'Cửa hàng',
            component: <FormSelect field='store_id' list={optionsStore} />,
          },
          {
            title: 'Giới tính',
            component: <FormSelect field='gender' list={GENDER_OPTIONS} />,
          },
        ]}
      />
    </FormProvider>
  );
}

export default BusinessUserFilter;
