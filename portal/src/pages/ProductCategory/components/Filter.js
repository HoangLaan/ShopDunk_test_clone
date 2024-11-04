import React, { useState, useEffect, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { useAuth } from 'context/AuthProvider';
import { getOptionsForUser } from 'services/company.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { categoryTypeOptions } from '../helpers/index';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const STATUS_OPTIONS = [
  {
    value: 2,
    label: 'Tất cả',
  },
  {
    value: 1,
    label: 'Kích hoạt',
  },
  {
    value: 0,
    label: 'Ẩn',
  },
];

const Filter = ({ onChange, hiddenBoxFilter }) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const username = user?.user_name;
  const methods = useForm();
  const { setValue, watch } = methods;
  const [optionsCompany, setOptionsCompany] = useState(null);

  useEffect(() => {
    methods.register('company_id');
    methods.register('is_active');
  }, [methods]);

  const getData = useCallback(() => {
    getOptionsForUser(username).then((res) => {
      setOptionsCompany(mapDataOptions4Select(res));
    });
  }, [username]);

  useEffect(() => {
    getData();
  }, [getData]);

  const onSubmit = useCallback(() => {
    const q = {
      search: watch('search'),
      is_active: watch('is_active') ?? 1,
      company_id: watch('company_id'),
      from_date: watch('from_date'),
      to_date: watch('to_date'),
      parent_id: watch('parent_id')?.value,
      type: watch('type'),
      is_show_web: watch('is_show_web'),
    };
    onChange(q);
  }, [watch, onChange]);

  useEffect(() => {
    if (optionsCompany && optionsCompany.length === 1) {
      setValue('company_id', optionsCompany[0].value);
    }
  }, [optionsCompany, setValue]);

  const onClear = () => {
    methods.reset({
      search: '',
      is_active: 1,
      company_id: null,
      from_date: null,
      to_date: null,
      parent_id: null,
      type: null,
      is_show_web: null,
    });
    onChange({
      search: '',
      is_active: 1,
      company_id: null,
      from_date: null,
      to_date: null,
      parent_id: null,
      type: null,
      is_show_web: null,
    });
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
        onSubmit={onSubmit}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput onKeyDown={handleKeyDownSearch} type='text' placeholder='Nhập tên ngành hàng' field='search' />
            ),
          },
          {
            title: 'Công ty',
            hidden: hiddenBoxFilter?.company,
            component: <FormSelect field='company_id' list={optionsCompany} allowClear />,
          },
          {
            title: 'Thuộc ngành hàng',
            component: (
              <FormDebouneSelect
                field='parent_id'
                fetchOptions={(keyword) => dispatch(getOptionsGlobal('productCategory', { keyword }))}
              />
            ),
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' defaultValue={1} list={STATUS_OPTIONS} />,
          },
          {
            title: 'Ngày tạo',
            hidden: hiddenBoxFilter?.date_construct,
            component: (
              <FormRangePicker
                fieldStart={'from_date'}
                allowClear
                fieldEnd='to_date'
                format={['DD/MM/YYYY', 'DD/MM/YYYY']}
                placeholder={['dd/mm/yyyy', 'dd/mm/yyyy']}
              />
            ),
          },
          {
            title: 'Loại',
            hidden: hiddenBoxFilter?.type,
            component: <FormSelect field='type' defaultValue={4} list={categoryTypeOptions} />,
          },

          {
            title: 'Hiển thị web',
            hidden: hiddenBoxFilter?.show_web,
            component: (
              <FormSelect
                field='is_show_web'
                defaultValue={2}
                list={[
                  {
                    value: 2,
                    label: 'Tất cả',
                  },
                  {
                    value: 1,
                    label: 'Hiện',
                  },
                  {
                    value: 0,
                    label: 'Ẩn',
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

export default Filter;
