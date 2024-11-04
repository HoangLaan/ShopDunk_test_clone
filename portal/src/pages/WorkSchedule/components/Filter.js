import React, { useEffect } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { STATUS_TYPES } from 'utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from '../../../actions/global';

const FilterWorkSchedule = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { setValue } = methods;
  useEffect(() => {
    dispatch(getOptionsGlobal('workScheduleType'));
    dispatch(getOptionsGlobal('user'));
  }, []);
  const { workScheduleTypeData, userData } = useSelector((state) => state.global);

  const onClear = () => {
    const initFilter = {
      search: null,
      created_date_from: null,
      created_date_to: null,
      is_active: STATUS_TYPES.ACTIVE,
    };
    methods.reset(initFilter);
    onChange(initFilter);
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        colSize={3}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput style={{ padding: '8px 0' }} field='search' placeholder='Tên đăng ký chế độ' />,
          },
          {
            title: 'Loại lịch công tác',
            component: (
              <FormSelect field='work_schedule_type_id' list={mapDataOptions4SelectCustom(workScheduleTypeData)} />
            ),
          },
          {
            title: 'Kích hoạt',
            component: <FormSelect field='is_active' defaultValue={STATUS_TYPES.ACTIVE} list={statusTypesOption} />,
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
            title: 'Nhân viên',
            component: <FormSelect field='user_filter' list={mapDataOptions4SelectCustom(userData)} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default FilterWorkSchedule;
