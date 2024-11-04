import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { getOptionsGlobal } from 'actions/global';

import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';

const LockshiftFilter = ({ onChange }) => {
  const methods = useForm({ defaultValues: { is_active: 1 } });
  const dispatch = useDispatch();

  const { storeData, shiftData, userData } = useSelector((state) => state.global);

  const onClear = () => {
    methods.reset({
      created_date_from: null,
      created_date_to: null,
      store_id: null,
      shift_id: null,
      created_user: null,
    });

    onChange({
      created_date_from: null,
      created_date_to: null,
      store_id: null,
      shift_id: null,
      created_user: null,
    });
  };

  useEffect(() => {
    dispatch(getOptionsGlobal('store'));
    dispatch(getOptionsGlobal('shift'));
    dispatch(getOptionsGlobal('user'));
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear()}
        colSize={3}
        expanded
        actions={[
          {
            title: 'Cửa hàng',
            component: <FormSelect field='store_id' id='store_id' list={mapDataOptions4SelectCustom(storeData)} />,
          },
          {
            title: 'Ca làm việc',
            component: <FormSelect field='shift_id' id='shift_id' list={mapDataOptions4SelectCustom(shiftData)} />,
          },
          {
            title: 'Người kết ca',
            component: (
              <FormSelect field='created_user' id='created_user' list={mapDataOptions4SelectCustom(userData)} />
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

export default LockshiftFilter;
