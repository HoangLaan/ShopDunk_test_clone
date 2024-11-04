import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';

import { TYPE_TASK } from '../utils/constant';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { showToast } from 'utils/helpers';
import {
  getOptionsCustomerType,
  getOptionsTaskType,
  getOptionsSource,
  getOptionsStore,
  getOptionsTask,
} from 'services/customer-of-task.service';

const Filter = ({ onChange }) => {
  const methods = useForm({
    defaultValues: {
      is_active: 1,
    },
  });
  const [optionsCustomerType, setOptionsCustomerType] = useState([]);
  const [optionsTaskType, setOptionsTaskType] = useState([]);
  const [optionsSource, setOptionsSource] = useState([]);
  const [optionsStore, setOptionsStore] = useState([]);
  const [optionsTask, setOptionsTask] = useState([]);
  const task_type_id = methods.watch('task_type_id');
  const task_id = methods.watch('task_id');

  const fetchOptionsSource = () => getOptionsSource();
  const fetchOptionsCustomerType = () => getOptionsCustomerType();
  const fetchOptionsTaskType = () => getOptionsTaskType();
  const fetchOptionsStore = () => getOptionsStore();
  const fetchOptionsTask = () => getOptionsTask({ parent_id: task_type_id?.id || 0 });

  const loadData = useCallback(async () => {
    try {
      const customerType = await fetchOptionsCustomerType();
      const taskType = await fetchOptionsTaskType();
      const source = await fetchOptionsSource();
      const store = await fetchOptionsStore();
      const task = await fetchOptionsTask();
      setOptionsSource(mapDataOptions4Select(source));
      setOptionsCustomerType(mapDataOptions4Select(customerType));
      setOptionsTaskType(mapDataOptions4Select(taskType));
      setOptionsStore(mapDataOptions4Select(store));
      setOptionsTask(mapDataOptions4Select(task));
    } catch (error) {
      showToast.error(error?.message || 'Có lỗi xảy ra!');
    }
  }, []);

  useEffect(() => {
    const fetchTaskOptions = async () => {
      try {
        const taskOptions = await fetchOptionsTask();
        setOptionsTask(mapDataOptions4Select(taskOptions));
        if (taskOptions.length === 0) {
          methods.setValue('task_id', null);
        }
      } catch (error) {
        showToast.error(error?.message || 'Có lỗi xảy ra!');
      }
    };
    if (task_type_id && task_type_id.id) {
      fetchTaskOptions();
    }
  }, [task_type_id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = () => {
    onChange({
      search: methods.getValues('search'),
      task_type_id: methods.getValues('task_type_id.value'),
      customer_type_id: methods.getValues('customer_type_id.value'),
      source_id: methods.getValues('source_id.value'),
      store_id: methods.getValues('store_id.value'),
      task_id: methods.getValues('task_id.value'),
      created_date_from: methods.getValues('created_date_from'),
      created_date_to: methods.getValues('created_date_to'),
      birthday_date_from: methods.getValues('birthday_date_from'),
      birthday_date_to: methods.getValues('birthday_date_to'),
    });
  };

  const onClear = () => {
    const rsvalues = {
      search: '',
      task_type_id: null,
      customer_type_id: null,
      task_type_id: null,
      source_id: null,
      store_id: null,
      task_id: null,
      created_date_from: null,
      created_date_to: null,
      birthday_date_from: null,
      birthday_date_to: null,
    };

    methods.reset(rsvalues);
    onChange(rsvalues);
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
        onSubmit={onSubmit}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput
                field='search'
                onKeyDown={handleKeyDownSearch}
                placeholder='Mã KH, Tên KH, SĐT, Email, Mã đơn hàng'
                maxLength={250}
              />
            ),
          },
          {
            title: 'Hạng khách hàng',
            component: (
              <FormDebouneSelect
                field='customer_type_id'
                fetchOptions={fetchOptionsCustomerType}
                allowClear={true}
                placeholder='--Chọn--'
                list={optionsCustomerType}
              />
            ),
          },
          {
            title: 'Loại công việc',
            component: (
              <FormDebouneSelect
                field='task_type_id'
                fetchOptions={fetchOptionsTaskType}
                allowClear={true}
                placeholder='--Chọn--'
                list={optionsTaskType}
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
          {
            title: 'Ngày sinh nhật',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'birthday_date_from'}
                fieldEnd={'birthday_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Nguồn',
            component: (
              <FormDebouneSelect
                field='source_id'
                fetchOptions={fetchOptionsSource}
                allowClear={true}
                placeholder='--Chọn--'
                list={optionsSource}
              />
            ),
          },
          {
            title: 'Công việc',
            component: <FormSelect field='task_id' list={optionsTask} fetchOptions={fetchOptionsTask} />,
          },
          {
            title: 'Chi nhánh chuyển',
            component: (
              <FormDebouneSelect
                field='store_id'
                fetchOptions={fetchOptionsStore}
                allowClear={true}
                placeholder='--Chọn--'
                list={optionsStore}
              />
            ),
            // hidden: parseInt(task_id) !== parseInt(TYPE_TASK.JOB_SHOP),
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

export default Filter;
