import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { customerTypeOptions as objectTypeOptions } from 'pages/CustomerType/utils/constants';

const TaskFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { userData, taskTypeData } = useSelector((state) => state.global);
  useEffect(() => {
    methods.reset({ is_active: 1 });
  }, [methods]);

  useEffect(() => {
    if (!userData) dispatch(getOptionsGlobal('user'));
    if (!taskTypeData) dispatch(getOptionsGlobal('taskType'));
  }, []);

  const customerTypeOptions = useGetOptions(optionType.customerType);

  const object_type = methods.watch('object_type');
  const _customerTypeOptions =
    object_type === 4 || !object_type
      ? customerTypeOptions
      : customerTypeOptions.filter((x) => x.type_apply === object_type);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onChange({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' placeholder='Nhập tên hay loại công việc' />,
          },
          {
            title: 'Đối tượng',
            component: <FormSelect field='object_type' list={objectTypeOptions} allowClear />,
          },
          {
            title: 'Hạng khách hàng',
            component: <FormSelect field='customer_type_id' list={_customerTypeOptions} allowClear />,
          },
          {
            title: 'Loại công việc',
            component: (
              <FormSelect field='task_type_id' list={mapDataOptions4SelectCustom(taskTypeData, 'id', 'name')} />
            ),
          },
          {
            title: 'Ngày bắt đầu',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'start_date_from'}
                fieldEnd={'start_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Ngày kết thúc',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'end_date_from'}
                fieldEnd={'end_date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          // {
          //   title: 'Thuộc loại công việc',
          //   component: <FormSelect field='parent_id' list={mapDataOptions4SelectCustom(taskTypeData, 'id', 'name')} />,
          // },
          {
            title: 'Người giám sát',
            component: (
              <FormSelect field='supervisor_name' list={mapDataOptions4SelectCustom(userData, 'id', 'name')} />
            ),
          },
          {
            title: 'Người xử lý',
            component: <FormSelect field='user_name' list={mapDataOptions4SelectCustom(userData, 'id', 'name')} />,
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

export default TaskFilter;
