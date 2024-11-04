import React, { useCallback, useEffect, useState } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { statusTypesOption } from 'utils/helpers';
import { getListDepartment, getOptionsCompany } from 'services/department.service';

const DepartmentFilter = ({ onChange }) => {
  const methods = useForm();
  const [listCompany, setListCompany] = useState([]);
  const [listDepartment, setListDepartment] = useState([]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
      search: null,
    });
  }, []);

  const onClear = () => {
    const initFilter = {
      search: null,
      is_active: 1,
    };
    methods.reset(initFilter);
    onChange(initFilter);
  };

  const loadCompany = useCallback(() => {
    getOptionsCompany().then((p) => {
      setListCompany(p?.items);
    });
  }, []);
  useEffect(loadCompany, [loadCompany]);

  const loadDeparment = useCallback(() => {
    getListDepartment({
      itemsPerPage: 129391239,
    })
      .then((p) => setListDepartment(p?.items))
      .catch((_) => {});
  }, []);
  useEffect(loadDeparment, [loadDeparment]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Từ khóa'
        onSubmit={onChange}
        onClear={() => onClear({ search: '' })}
        colSize={4}
        actions={[
          {
            title: 'Tên phòng ban',
            component: <FormInput field='search' placeholder='Nhập mã phòng ban, tên phòng ban' />,
          },

          {
            title: 'Thuộc phòng ban',
            component: (
              <FormSelect
                field='department'
                //list={statusTypesOption}
                list={(listDepartment ?? []).map((p) => {
                  return {
                    label: p?.department_name,
                    value: p?.department_id,
                  };
                })}
              />
            ),
          },
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default DepartmentFilter;
