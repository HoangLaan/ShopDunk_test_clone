import React, { useEffect } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4SelectCustom, statusTypesOption } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { INIT_FORM_SEARCH, propertys } from '../utils/constants';
const AccountingAccountFilter = ({ onChange }) => {
  const dispatch = useDispatch();
  const methods = useForm();
  const { companyData } = useSelector((state) => state.global);
  useEffect(() => {
    methods.reset(INIT_FORM_SEARCH);
    if (!companyData) dispatch(getOptionsGlobal('company'));
  }, []);

  const onClear = () => {
    methods.reset(INIT_FORM_SEARCH);
    onChange({});
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={onClear}
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder={'Nhập tên tài khoản, mã tài khoản'} field='keyword' />,
          },
          {
            title: 'Công ty',
            component: <FormSelect field='company_id' list={mapDataOptions4SelectCustom(companyData, 'id', 'name')} />,
          },
          {
            title: 'Tính chất',
            component: <FormSelect field='property' list={propertys} />,
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

export default AccountingAccountFilter;
