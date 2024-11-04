import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { getCompanyOptions, getExpendTypeOptions } from 'services/expend-type.service';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

const ExpendTypeFilter = ({ onChange, onClear }) => {
  const methods = useForm();
  const [companyList, setCompanyList] = useState([]);
  const [expendTypeOptions, setExpendTypeOptions] = useState([]);

  const loadCompanyList = useCallback(() => {
    getCompanyOptions().then(setCompanyList);
  }, []);
  useEffect(loadCompanyList, [loadCompanyList]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  useEffect(() => {
    getExpendTypeOptions({ parent_id: 0 }).then((data) => {
      const opts = data.map((_) => ({
        id: _.id,
        value: _.value,
        label: _.title.split(' - ')[1],
      }));
      setExpendTypeOptions(opts);
    });
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear({})}
        actions={[
          {
            title: 'Từ khoá',
            component: <FormInput field='search' placeholder='Mã loại chi, tên loại chi, người tạo' />,
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
            title: 'Loại chi cha',
            component: <FormSelect field='parent_id' list={expendTypeOptions} />,
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
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default ExpendTypeFilter;
