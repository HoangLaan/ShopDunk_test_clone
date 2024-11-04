import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { useDispatch, useSelector } from 'react-redux';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { getOptionsGlobal } from 'actions/global';
import { TRANSFER_STAUTS_FILTER } from '../utils/constants';

const ClusterFilter = ({ onChange, businessOption }) => {
  const dispatch = useDispatch();
  const methods = useForm();
  const { transferShiftTypeData } = useSelector((state) => state.global);
  // useEffect(() => {
  //   methods.reset({
  //     is_active: 1,
  //   });
  // }, []);

  const onClear = () => {
    methods.reset({
      keyword: null,
      date_from: null,
      date_to: null,
      transfer_shift_type_id: null,
      transfer_status: null,
    });

    onChange({
      keyword: null,
      date_from: null,
      date_to: null,
      transfer_shift_type_id: null,
      transfer_status: null,
    });
  };

  useEffect(() => {
    if (!transferShiftTypeData) dispatch(getOptionsGlobal('transferShiftType'));
  }, [dispatch, transferShiftTypeData]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onClear()}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder='Nhập mã nhân viên, tên nhân viên' field='keyword' />,
          },
          {
            title: 'Ngày tạo',
            component: (
              <FormDateRange
                allowClear={true}
                fieldStart={'date_from'}
                fieldEnd={'date_to'}
                placeholder={['Từ ngày', 'Đến ngày']}
                format={'DD/MM/YYYY'}
              />
            ),
          },
          {
            title: 'Loại chuyển ca',
            component: (
              <FormSelect
                field={'transfer_shift_type_id'}
                allowClear
                list={mapDataOptions4SelectCustom(transferShiftTypeData, 'id', 'name')}
              />
            ),
          },
          {
            title: 'Trạng thái duyệt',
            component: <FormSelect field={'transfer_status'} list={TRANSFER_STAUTS_FILTER} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default ClusterFilter;
