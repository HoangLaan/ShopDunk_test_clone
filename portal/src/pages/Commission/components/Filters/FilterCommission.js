import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { getOptionsCompany } from 'services/company.service';
import { COMMISSION_STATUS, COMMISSION_STATUS_OPTIONS } from 'pages/Commission/helpers/constants';
import { STATUS_TYPES } from 'utils/constants';

const initFilter = {
  search: '',
  from_date: null,
  to_date: null,
  from_date_apply: null,
  to_date_apply: null,
  company_id: null,
  is_active: STATUS_TYPES.ACTIVE,
  status: null,
};

const FilterCommission = ({ onChange }) => {
  const methods = useForm();
  const { reset } = methods;

  const [optionsCompany, setOptionsCompany] = useState([]);

  useEffect(() => {
    const getDataOptions = async () => {
      let _company = await getOptionsCompany();
      setOptionsCompany(mapDataOptions4Select(_company));
    };
    getDataOptions();

    reset(initFilter);
  }, [reset]);

  const onClear = () => {
    methods.reset(initFilter);
    onChange(initFilter);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({ search: '' })}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder='Tên chương trình hoa hồng' />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                style={{ width: '100%' }}
                fieldStart={'from_date'}
                fieldEnd={'to_date'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Thời gian áp dụng',
            component: (
              <FormRangePicker 
                style={{width: '100%'}}
                fieldStart={'from_date_apply'}
                fieldEnd={'to_date_apply'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear
              />
            )
          },
          {
            title: 'Trạng thái duyệt',
            component: (
              <FormSelect field='status' defaultValue={COMMISSION_STATUS.ALL} list={COMMISSION_STATUS_OPTIONS} />
            ),
          },
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
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

export default FilterCommission;
