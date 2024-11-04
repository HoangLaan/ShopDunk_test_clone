import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';

const ExchangePointFilter = ({ onChange }) => {
  const methods = useForm();
  const dispatch = useDispatch();
  const { companyData } = useSelector((state) => state.global);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, []);

  useEffect(() => {
    if (!companyData) dispatch(getOptionsGlobal('company'));
  }, [companyData, dispatch]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() => onChange({})}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder={'Nhập tên chương trình'} field='keyword' />,
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
            title: 'Công ty',
            component: <FormSelect field='company_id' list={mapDataOptions4SelectCustom(companyData, 'id', 'name')} />,
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

export default ExchangePointFilter;
