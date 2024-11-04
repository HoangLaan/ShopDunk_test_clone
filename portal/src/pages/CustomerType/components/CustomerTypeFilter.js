import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
// common
import { useAuth } from '../../../context/AuthProvider';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
//compnents
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
// service
import { getOptionsForUser } from 'services/company.service';
import { getOptionsBusiness } from 'services/business.service';

// utils
import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import FilterSearchBar from 'components/shared/FilterSearchBar';
import { customerTypeOptions } from '../utils/constants';

export default function CustomerTypeFilter({ onChange }) {
  const { user } = useAuth();
  const methods = useForm({ defaultValues: { is_active: 1 } });
  const [optionsCompany, setOptionsCompany] = useState(null);
  const [optionsBusiness, setOptionsBusiness] = useState(null);

  useEffect(() => {
    methods.register('company_id');
    methods.register('is_active');
  }, [methods.register]);

  const defOptionAllBusiness = {
    id: '-1',
    name: 'Tất cả',
    parent_id: '1',
  }

  const getData = async () => {
    let _company = await getOptionsForUser(user.user_name);
    let _business = await getOptionsBusiness();
    
    if(_business) {
      _business.push(defOptionAllBusiness);
    }
    setOptionsCompany(mapDataOptions4Select(_company));
    setOptionsBusiness(mapDataOptions4Select(_business));
  };
  useEffect(() => {
    getData();
  }, []);


  const onClear = () => {
    methods.reset({
      keyword: '',
      is_active: 1,
      company_id: null,
      business_id: null,
      object_type: null,
      create_date_from: null,
      create_date_to: null,
    });
    onChange({
      keyword: '',
      is_active: 1,
      company_id: null,
      business_id: null,
      object_type: null,
      create_date_from: null,
      create_date_to: null,
    });
  };
  const handlegetOptsBusines = async (company_id) => {
    const _dataBusiness = await getOptionsBusiness({ company_id });
    setOptionsBusiness(mapDataOptions4Select(_dataBusiness));
    methods.setValue('company_id', company_id);
    methods.setValue('business_id', null);
  };
  useEffect(() => {
    if (methods.watch('company_id')) {
      handlegetOptsBusines(methods.watch('company_id'));
    }
  }, [methods.watch('company_id')]);

  const onSubmit = () => {
    const q = {
      keyword: methods.watch('keyword'),
      is_active: methods.watch('is_active') ?? 1,
      company_id: methods.watch('company_id'),
      object_type: methods.watch('object_type'),
      business_id: methods.watch('business_id'),
    };
    onChange(q);
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
        colSize={3}
        onSubmit={onChange}
        onClear={() => onClear({ search: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput  onKeyDown={handleKeyDownSearch} type='text' placeholder='Nhập hạng khách hàng' field='keyword' />,
          },
          {
            title: 'Đối tượng',
            component: <FormSelect field='object_type' list={customerTypeOptions} />,
          },

          {
            title: 'Công ty',
            component: <FormSelect field='company_id' id='bw_company' list={optionsCompany} />
          },
          {
            title: 'Miền',
            component: <FormSelect field='business_id' list={optionsBusiness} />
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' defaultValue={1} list={statusTypesOption} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                fieldStart={'create_date_from'}
                fieldEnd={'create_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
}
