import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { statusTypesOption, mapDataOptions4Select } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { defaultParams } from 'utils/helpers';

const EquipmentGroupFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const { equipmentGroupData } = useSelector((state) => state.global);

  useEffect(() => {
    dispatch(getOptionsGlobal('equipmentGroup'));
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onChange(defaultParams)}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='search' placeholder={'Nhập tên, mã nhóm thiết bị'} />,
          },
          {
            title: 'Thuộc nhóm thiết bị',
            component: <FormSelect field='parent_id' list={mapDataOptions4Select(equipmentGroupData)} />,
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
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default EquipmentGroupFilter;
