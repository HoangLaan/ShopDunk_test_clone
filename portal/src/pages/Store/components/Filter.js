import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from 'context/AuthProvider';
import { getOptionsForUser } from 'services/company.service';
// import { getOptionsArea } from 'services/area.service';
import { mapDataOptions4Select, statusTypesOption, mapDataOptions4SelectCustom } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
// import BWAddress from 'components/shared/BWAddress/index';
import { getOptionsGlobal } from 'actions/global';

const Filter = ({ onChange }) => {
  const { user } = useAuth();
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const dispatch = useDispatch();
  const { clusterData, businessData } = useSelector((state) => state.global);
  const [optionsCompany, setOptionsCompany] = useState(null);
  // const [optionsArea, setOptionsArea] = useState(null);

  useEffect(() => {
    methods.register('company_id');
    methods.register('is_active');
  }, [methods.register]);

  const getData = async () => {
    let _company = await getOptionsForUser(user.user_name);
    // let _area = await getOptionsArea();
    setOptionsCompany(mapDataOptions4Select(_company));
    // setOptionsArea(mapDataOptions4Select(_area));
    dispatch(getOptionsGlobal('cluster'));
  };

  useEffect(() => {
    getData();
  }, []);

  const onSubmit = () => {
    const q = {
      search: methods.watch('search'),
      is_active: methods.watch('is_active') ?? 1,
      company_id: methods.watch('company_id'),
      // area_id: methods.watch('area_id'),
      province_id: methods.watch('province_id'),
      district_id: methods.watch('district_id'),
      ward_id: methods.watch('ward_id'),
      cluster_id: methods.watch('cluster_id'),
      business_id: methods.watch('business_id'),
    };
    onChange(q);
  };

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      company_id: null,
      // area_id: null,
      province_id: null,
      district_id: null,
      ward_id: null,
      cluster_id: null,
      business_id: null,
    });
    onChange({
      search: '',
      is_active: 1,
      company_id: null,
      // area_id: null,
      province_id: null,
      district_id: null,
      ward_id: null,
      cluster_id: null,
      business_id: null,
    });
  };

  const handleChangeCompany = async (company_id) => {
    // const _dataArea = await getOptionsArea({ company_id });
    // setOptionsArea(mapDataOptions4Select(_dataArea));
    methods.setValue('company_id', company_id);
    // methods.setValue('area_id', null);
  };

  useEffect(() => {
    dispatch(
      getOptionsGlobal('business', {
        company_id: methods.watch('company_id'),
      }),
    );
  }, [methods.watch('company_id')]);

  const handleKeyDownSearch = (event) => {
    if (1 * event.charCode === 13) {
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
                onKeyPress={handleKeyDownSearch}
                type='text'
                placeholder='Nhập mã, tên của hàng, địa chỉ IP'
                field='search'
              />
            ),
          },
          {
            title: 'Trực thuộc công ty',
            component: <FormSelect field='company_id' list={optionsCompany} onChange={handleChangeCompany} />,
          },
          {
            title: 'Miền',
            component: (
              <FormSelect field='business_id' placeholder='Tất cả' list={mapDataOptions4Select(businessData ?? [])} />
            ),
          },
          {
            title: 'Cụm',
            component: (
              <FormSelect field='cluster_id' list={mapDataOptions4SelectCustom(clusterData, 'id', 'name') ?? []} />
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

export default Filter;
