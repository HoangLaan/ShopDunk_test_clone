import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { getOptionsCompany } from 'services/company.service';
import { getDistrict, getProvince, getWard } from 'services/location.service';

const BusinessFilter = ({ onChange }) => {
  const methods = useForm();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [addressOptions, setAddressOptions] = useState({
    provinceOptions: [],
    districtOptions: [],
    wardOptions: [],
  });

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const getOptions = useCallback(() => {
    getOptionsCompany().then((res) => {
      setCompanyOptions(mapDataOptions4Select(res));
    });

    getProvince().then((res) => {
      setAddressOptions({
        provinceOptions: mapDataOptions4Select(res),
      });
    });
  }, []);

  useEffect(getOptions, [getOptions]);

  const province_id = methods.watch('province_id');

  const getDistrictOptions = useCallback(() => {
    if (province_id) {
      getDistrict({ parent_id: province_id }).then((res) => {
        setAddressOptions((prev) => {
          return {
            ...prev,
            districtOptions: mapDataOptions4Select(res),
          };
        });
      });
    }
  }, [province_id]);

  useEffect(getDistrictOptions, [getDistrictOptions]);

  const district_id = methods.watch('district_id');

  const getWardOptions = useCallback(() => {
    if (district_id) {
      getWard({ parent_id: district_id }).then((res) => {
        setAddressOptions((prev) => {
          return {
            ...prev,
            wardOptions: mapDataOptions4Select(res),
          };
        });
      });
    }
  }, [district_id]);

  useEffect(getWardOptions, [getWardOptions]);

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            search: undefined,
            is_active: 1,
            created_date_from: undefined,
            created_date_to: undefined,
            company_id: undefined,
            province_id: undefined,
            district_id: undefined,
            ward_id: undefined,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput placeholder={'Nhập mã miền, tên miền, số điện thoại, email'} field='keyword' />,
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
            title: 'Trực thuộc công ty',
            isRequired: false,
            component: <FormSelect field='company_id' list={companyOptions} />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
          },
          {
            title: 'Tỉnh/Tp',
            isRequired: false,
            component: <FormSelect field='province_id' list={addressOptions.provinceOptions} />,
          },
          {
            title: 'Quận/Huyện',
            isRequired: false,
            component: <FormSelect field='district_id' list={addressOptions.districtOptions} disabled={!province_id} />,
          },
          {
            title: 'Phường/Xã',
            isRequired: false,
            component: <FormSelect field='ward_id' list={addressOptions.wardOptions} disabled={!district_id} />,
          },
        ]}
        colSize={4}
      />
    </FormProvider>
  );
};

export default BusinessFilter;
