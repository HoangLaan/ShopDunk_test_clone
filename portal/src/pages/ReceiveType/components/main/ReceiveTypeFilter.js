import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';
import { getCompanyOptions, getReceiveTypeOptions } from 'services/receive-type.service';

const ReceiveTypeFilter = ({ onChange }) => {
  const methods = useForm();
  const [receiveTypeList, setReceiveTypeList] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const loadReceiveTypeList = useCallback(() => {
    getReceiveTypeOptions().then(setReceiveTypeList);
  }, []);
  useEffect(loadReceiveTypeList, [loadReceiveTypeList]);

  const loadCompanyList = useCallback(() => {
    getCompanyOptions().then(setCompanyList);
  }, []);
  useEffect(loadCompanyList, [loadCompanyList]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        //onClear={() => onClear()}
        onClear={() =>
          onChange({
            search: '',
            parent_id: null,
            created_date_from: null,
            created_date_to: null,
            company_id: null,
            is_active: 1,
            itemsPerPage: 15,
            page: 1,
            level: null,
          })
        }
        actions={[
          {
            title: 'Từ khoá',
            component: <FormInput field='search' placeholder='Nhập mã, tên loại thu' />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          }
          ,
          {
            title: 'Loại thu cha',
            component: (
              <FormSelect
                field='parent_id'
                list={receiveTypeList?.map((p) => {
                  return {
                    label: p?.name,
                    value: p?.id,
                  };
                })}
              />
            ),
          },
          {
            title: 'Công ty',
            component: (
              <FormSelect
                field='company_id'
                list={companyList?.map((p) => {
                  return {
                    label: p?.name,
                    value: p?.id,
                  };
                })}
              />
            ),
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
         
        ]}
      />
    </FormProvider>
  );
};

export default ReceiveTypeFilter;
