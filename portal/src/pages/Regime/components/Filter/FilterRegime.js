import React, {useEffect} from 'react';
import {FormProvider, useForm, useFormContext} from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';

import {mapDataOptions4SelectCustom, statusTypesOption} from 'utils/helpers';
import { STATUS_TYPES } from 'utils/constants';
import {useDispatch, useSelector} from "react-redux";
import {getOptionsGlobal} from "../../../../actions/global";

const FilterRegime = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const {setValue}=methods
  useEffect(() => {
    dispatch(getOptionsGlobal('regimeType'))
    dispatch(getOptionsGlobal('user'))
  }, [])
  const {regimeTypeData} = useSelector(state => state.global)
  const {userData} = useSelector(state => state.global)

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
        colSize={4}
        onClear={() => onClear({ search: '' })}
        actions={[
         {
            title: 'Từ khóa',
            component: (
              <FormInput field='search' placeholder='Tên đăng ký chế độ' />
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
            title: 'Loại chế độ',
            component: (
              <FormSelect
                field='regime_type_id'
                allowClear={true}
                list={mapDataOptions4SelectCustom(regimeTypeData)}
              />
            ),
          },
          {
            title: 'Nhân viên',
            component: (
              <FormSelect
                field='user_filter'
                allowClear={true}
                list={mapDataOptions4SelectCustom(userData)}
              />
            ),
          },
        ]}
      />
    </FormProvider>
  );
};

export default FilterRegime;
