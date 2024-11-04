import React, { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { statusTypesOption } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4Select } from 'utils/helpers';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

const CashFlowFilter = ({ onChange, setLoading }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { companyData, getCompanyLoading } = useSelector((state) => state.global);

  useEffect(() => {
    methods.reset({
      is_active: 1,
      cash_flow_type: 3,
    });
  }, [methods]);

  const getOptions = useCallback(() => {
    dispatch(getOptionsGlobal('company'));
  }, [dispatch]);

  useEffect(getOptions, [getOptions]);

  useEffect(() => {
    setLoading(getCompanyLoading);
  }, [getCompanyLoading, setLoading]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            search: undefined,
            is_active: 1,
            cash_flow_type: 3,
            created_date_from: undefined,
            created_date_to: undefined,
            company_id: undefined,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' placeholder={'Nhập mã dòng tiền, tên dòng tiền'} />,
          },
          {
            title: 'Công ty',
            isRequired: false,
            component: <FormSelect field='company_id' list={mapDataOptions4Select(companyData)} />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
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
            title: 'Loại',
            component: (
              <FormSelect
                field='cash_flow_type'
                list={[
                  {
                    label: 'Tất cả',
                    value: 3,
                  },
                  {
                    label: 'Loại thu',
                    value: 1,
                  },
                  {
                    label: 'Loại chi',
                    value: 2,
                  },
                ]}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default CashFlowFilter;
