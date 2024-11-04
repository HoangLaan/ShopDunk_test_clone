import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { mapDataOptions4SelectCustom } from 'utils/helpers';

const UserLevelHistoryFilter = ({ onChange }) => {
  const methods = useForm();
  const departmentData = useGetOptions(optionType.department);
  const positionData = useGetOptions(optionType.positionByDepartment, {params: {parent_id: methods.watch('department_id')}});

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);
  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            keyword: undefined,
            from_date: undefined,
            to_date: undefined,
            department_id: undefined,
            position_id: undefined,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' placeholder='Tên nhên viên' />,
          },
          {
            title: 'Phòng ban',
            component: <FormSelect field='department_id' list={mapDataOptions4SelectCustom(departmentData)} />,
          },
          {
            title: 'Vị trí',
            component: <FormSelect field='position_id' list={mapDataOptions4SelectCustom(positionData)} />,
          },
          {
            title: 'Thời gian chuyển cấp',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'from_date'}
                fieldEnd={'to_date'}
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

export default UserLevelHistoryFilter;
