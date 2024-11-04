import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { STATUS_TYPES } from 'utils/constants';
import { GENDER_OPTIONS, GENDER } from 'pages/CustomerLead/utils/constants';
import CustomerLeadService from 'services/customer-lead.service';
import useGetOptions, { optionType } from 'hooks/useGetOptions';

const FilterCustomerLead = ({ onChange, onClearParams }) => {
  const methods = useForm();
  const [optionsSource, setOptionsSource] = useState([]);
  const [optionsCustomerType, setOptionsCustomerType] = useState([]);
  const wflowOptions = useGetOptions(optionType.taskWorkFlow)
  const interestContentOptions = useGetOptions(optionType.interestContent);

  useEffect(() => {
    const getDataOptions = async () => {
      const _optionsCustomerType = await CustomerLeadService.getOptionsCustomerType();
      setOptionsCustomerType(mapDataOptions4Select(_optionsCustomerType));

      let _source = await CustomerLeadService.getOptionsSource();
      setOptionsSource(mapDataOptions4Select(_source));
    };
    getDataOptions();
  }, []);

  const onClear = () => {
    const initFilter = {
      search: null,
      created_date_from: null,
      created_date_to: null,
      is_active: STATUS_TYPES.ACTIVE,
      gender: GENDER.ALL,
      customer_type_id: null
    };
    methods.reset(initFilter);
    onClearParams(initFilter);
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
            component: (
              <FormInput field='search' placeholder='Nhập Mã khách hàng, Tên khách hàng, Số điện thoại, Số điện thoại phụ, Email' />
            ),
          },
          {
            title: 'Nguồn khách hàng',
            component: <FormSelect field='source_id' list={optionsSource} />,
          },
          {
            title: 'Hạng khách hàng',
            component: <FormSelect field='customer_type_id' id='bw_company' list={optionsCustomerType} allowClear />,
          },
          {
            title: 'Trạng thái CSKH',
            component: <FormSelect field='wflow_id' id='bw_company' list={wflowOptions} allowClear />,
          },
          {
            title: 'Nội dung quan tâm',
            component: <FormSelect field='interest_content' list={interestContentOptions} />,
          },
          {
            title: 'Giới tính',
            component: <FormSelect field='gender' defaultValue={GENDER.ALL} list={GENDER_OPTIONS} />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormRangePicker
                style={{ width: '100%' }}
                fieldStart='created_date_from'
                fieldEnd='created_date_to'
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
                allowClear={true}
              />
            ),
          },
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default FilterCustomerLead;
