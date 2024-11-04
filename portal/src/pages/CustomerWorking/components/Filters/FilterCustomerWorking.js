import React, { useState, useEffect, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { STATUS_TYPES } from 'utils/constants';
import { GENDER_OPTIONS, GENDER } from 'pages/CustomerLead/utils/constants';

import { getOptionsAllStore } from 'pages/PurchaseOrder/helpers/call-api';

const FilterCustomerWorking = ({ onChange }) => {
  const methods = useForm();

  const [optionsStore, setOptionsStore] = useState();

  const getOptionsStore_ = useCallback(() => {
    getOptionsAllStore()
    .then(res => {
      if (res?.items) {
        setOptionsStore(mapDataOptions4Select(res.items, 'store_id', 'store_name'));
      } else {
        setOptionsStore([]);
      }
    })
    .catch((_) => {})
    .finally(() => {
      // methods.setValue('store_id', '0');
    });
  }, []);
  useEffect(getOptionsStore_, [getOptionsStore_]);

  const onClear = () => {
    const initFilter = {
      search: null,
      created_date_from: null,
      created_date_to: null,
      is_active: STATUS_TYPES.ACTIVE,
      gender: GENDER.ALL,
      company_name: null,
      store_id: null,
      business_id: null,
    };
    methods.reset(initFilter);
    onChange(initFilter);
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
              <FormInput field='search' placeholder='Nhập Mã Walk in, Mã khách hàng, Tên khách hàng, Số điện thoại, Email' />
            ),
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
          {
            title: 'Cửa hàng',
            component: (
              <FormSelect
                field='store_id'
                list={optionsStore}
                defaultValue={null}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default FilterCustomerWorking;
