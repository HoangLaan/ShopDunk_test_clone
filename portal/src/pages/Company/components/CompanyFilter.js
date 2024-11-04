import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
// common
import { useAuth } from '../../../context/AuthProvider';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
//components
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import BWButton from 'components/shared/BWButton/index';
// service
import { getOptionsCompanyType } from 'services/company-type.service';
import { getOptionsProvince } from 'services/province.service';
import { getOptionsDistrict } from 'services/district.service';
import { getOptionsWard } from 'services/ward.service';
// utils
import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';

import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FilterSearchBar from 'components/shared/FilterSearchBar';

export default function CompanyFilter({ handleSubmitFilter, onChange }) {
  const { user } = useAuth();
  const methods = useForm();
  const [isShowSearch, setIsShowSearch] = useState(true);
  const [optionsCompanyType, setOptionsCompanyType] = useState([]);
  const [optionsAddress, setOptionsAddress] = useState({
    optionsProvince: [],
    optionsDistrict: [],
    optionsWard: [],
  });

  useEffect(() => {
    methods.register('company_type_id');
    methods.register('is_active');
    methods.reset({ is_active: 1 });
  }, [methods]);
  const getDataOptions = async () => {
    let _company = await getOptionsCompanyType(user.user_name);
    setOptionsCompanyType(mapDataOptions4Select(_company));
    let _province = await getOptionsProvince();
    setOptionsAddress({
      optionsProvince: mapDataOptions4Select(_province),
    });
  };
  useEffect(() => {
    getDataOptions();
  }, []);

  const onSubmit = () => {
    const q = {
      keyword: methods.watch('keyword'),
      is_active: methods.watch('is_active'),
      company_type_id: methods.watch('company_type_id'),
      province_id: methods.watch('province_id'),
      district_id: methods.watch('district_id'),
      ward_id: methods.watch('ward_id'),
    };
    handleSubmitFilter(q);
  };

  const onClear = () => {
    methods.reset({
      keyword: '',
      is_active: 1,
      company_type_id: null,
      province_id: null,
      district_id: null,
      ward_id: null,
    });
    handleSubmitFilter({
      keyword: '',
      is_active: 1,
      company_type_id: null,
      province_id: null,
      district_id: null,
      ward_id: null,
    });
  };
  const handleGetOptionsDistrict = async (province_id) => {
    let _district = await getOptionsDistrict({ parent_id: province_id });
    setOptionsAddress({
      ...optionsAddress,
      optionsDistrict: mapDataOptions4Select(_district),
      optionsWard: [],
    });
    methods.setValue('province_id', province_id);
    methods.setValue('district_id', null);
    methods.setValue('ward_id', null);
  };
  const handleGetOptionsWard = async (district_id) => {
    let _ward = await getOptionsWard({ parent_id: district_id });
    setOptionsAddress({
      ...optionsAddress,
      optionsWard: mapDataOptions4Select(_ward),
    });
    methods.setValue('district_id', district_id);
    methods.setValue('ward_id', null);
  };
  useEffect(() => {
    if (methods.watch('province_id')) {
      handleGetOptionsDistrict(methods.watch('province_id'));
    }
  }, [methods.watch('province_id')]);
  useEffect(() => {
    if (methods.watch('district_id')) {
      handleGetOptionsWard(methods.watch('district_id'));
    }
  }, [methods.watch('district_id')]);

  return (
    <>
      <FormProvider {...methods}>
        <FilterSearchBar
          title='Tìm kiếm'
          colSize={3}
          onSubmit={onChange}
          onClear={() =>
            onChange({
              keyword: undefined,
              is_active: 1,
              company_type: undefined,
              created_date_from: undefined,
              created_date_to: undefined,
            })
          }
          actions={[
            {
              title: 'Từ khoá',
              component: <FormInput field='keyword' placeholder='Nhập mã công ty, tên công ty' />,
            },
            {
              title: 'Loại hình công ty',
              component: <FormInput field='company_type' placeholder='Nhập loại hình' />,
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
    </>
  );
}
