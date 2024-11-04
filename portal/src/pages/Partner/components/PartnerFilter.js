import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';

const PartnerFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { sourceData, customerTypeData } = useSelector((state) => state.global);

  useEffect(() => {
    if (!sourceData) dispatch(getOptionsGlobal('source'));
  }, [dispatch, sourceData]);

  useEffect(() => {
    if (!customerTypeData) dispatch(getOptionsGlobal('customerType'));
  }, [customerTypeData, dispatch]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
      source_id: 0,
      customer_type_id: 0,
    });
  }, []);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => {
          methods.reset({
            is_active: 1,
            source_id: 0,
            customer_type_id: 0,
          });
          onChange({});
        }}
        actions={[
          {
            title: 'Từ khóa',
            component: (
              <FormInput placeholder={'Nhập mã khách hàng DN, tên khách hàng DN, số điện thoại'} field='keyword' />
            ),
          },
          {
            title: 'Nguồn khách hàng',
            component: (
              <FormSelect
                field='source_id'
                list={mapDataOptions4SelectCustom(
                  [
                    {
                      id: 0,
                      name: 'Tất cả',
                    },
                    ...(sourceData || []),
                  ],
                  'id',
                  'name',
                )}
              />
            ),
          },
          {
            title: 'Hạng khách hàng',
            component: (
              <FormSelect
                field='customer_type_id'
                list={mapDataOptions4SelectCustom(
                  [{ id: 0, name: 'Tất cả' }, ...(customerTypeData || [])],
                  'id',
                  'name',
                )}
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
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
        ]}
      />
    </FormProvider>
  );
};

export default PartnerFilter;
