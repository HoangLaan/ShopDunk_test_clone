import React, { useEffect, useState } from 'react';
import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import { FormProvider, useForm } from 'react-hook-form';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { getBusinessV3 } from 'services/business.service';
import { defaultParams } from './constants';

const ReportFilter = ({ onChange }) => {
  const methods = useForm();
  const { watch } = methods;
  const dispatch = useDispatch();
  const { companyData, areaData } = useSelector((state) => state.global);
  const [businessOption, setBusinessOption] = useState([]);

  useEffect(() => {
    if (!companyData) dispatch(getOptionsGlobal('company'));
    if (!companyData) dispatch(getOptionsGlobal('area'));
  }, [companyData, areaData, dispatch]);

  useEffect(() => {
    getBusinessV3({
      area_id: watch('area_id'),
      company_id: watch('company_id'),
    }).then((data) => {
      setBusinessOption(mapDataOptions4SelectCustom(data || []));
    });
  }, [watch('company_id'), watch('area_id')]);

  // init values
  useEffect(() => {
    if (companyData) {
      const hesManCompany = companyData?.find((company) => company.name?.toUpperCase()?.includes('HESMAN'));
      if (hesManCompany) {
        methods.setValue('company_id', Number(hesManCompany.id));
        onChange({ company_id: Number(hesManCompany.id) });
      }
    }
  }, [companyData]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        colSize={6}
        title='Tìm kiếm'
        onSubmit={(value) => {
          onChange({...value, businessOption})
        }}
        onClear={() => onChange(defaultParams)}
        actions={[
          {
            title: 'Công ty',
            component: (
              <FormSelect
                field='company_id'
                allowClear
                list={mapDataOptions4SelectCustom(companyData, 'id', 'name')}
                onChange={(value) => {
                  const field = 'company_id';
                  methods.clearErrors(field);
                  methods.setValue(field, value);
                  methods.setValue('business_id', null);
                }}
              />
            ),
          },
          {
            title: 'Khu vực',
            component: (
              <FormSelect
                allowClear
                field='area_id'
                list={mapDataOptions4SelectCustom(areaData, 'id', 'name')}
                onChange={(value) => {
                  const field = 'area_id';
                  methods.clearErrors(field);
                  methods.setValue(field, value);
                  methods.setValue('business_id', []);
                }}
              />
            ),
          },
          {
            title: 'Miền',
            component: <FormSelect mode='multiple' allowClear disabled={!watch('area_id')} field='business_id' list={businessOption}  />,
          },
          {
            title: 'Ngày tạo đơn',
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

export default ReportFilter;
