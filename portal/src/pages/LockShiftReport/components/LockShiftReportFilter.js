import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { mapDataOptions4Select } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const LockShiftReportFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { shiftData, getShiftLoading } = useSelector((state) => state.global);
  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  useEffect(() => {
    dispatch(getOptionsGlobal('shift'));
  }, [dispatch]);

  const loading = getShiftLoading;

  return (
    <FormProvider {...methods}>
      <Spin spinning={loading} indicator={antIcon}>
        <FilterSearchBar
          title='Tìm kiếm'
          onSubmit={onChange}
          onClear={() =>
            onChange({
              store_id: undefined,
              shift_id: undefined,
              shift_leader: undefined,
              created_date_from: undefined,
              created_date_to: undefined,
            })
          }
          actions={[
            {
              title: 'Cửa hàng',
              isRequired: false,
              component: (
                <FormDebouneSelect
                  field='store_id'
                  // allowClear
                  placeholder={'--Chọn--'}
                  showSearch={true}
                  fetchOptions={(keyword) =>
                    dispatch(getOptionsGlobal('store', { keyword })).then((res) => mapDataOptions4Select(res))
                  }
                  style={{ width: '100%', marginTop: 10 }}
                />
              ),
            },
            {
              title: 'Ca làm việc',
              isRequired: false,
              component: <FormSelect field='shift_id' list={mapDataOptions4Select(shiftData)} allowClear />,
            },
            {
              title: 'Trưởng ca',
              isRequired: false,
              component: (
                <FormDebouneSelect
                  field='shift_leader'
                  // allowClear
                  placeholder={'--Chọn--'}
                  showSearch={true}
                  fetchOptions={(keyword) => dispatch(getOptionsGlobal('user', { keyword }))}
                  style={{ width: '100%', marginTop: 10 }}
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
          ]}
        />
      </Spin>
    </FormProvider>
  );
};

export default LockShiftReportFilter;
