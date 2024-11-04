import React, { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import { statusTypesOption } from 'utils/helpers';
import { getOptionsBusiness } from 'services/business.service';
import { getOptionsDepartment } from 'services/department.service';
import { REVIEW_TYPES } from 'pages/PurchaseRequisition/utils/constants';
// import { getOptionsManufacture } from 'services/product.service';

const PurchaseRequisitionFilter = ({ onChange }) => {
  const methods = useForm();
  // const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [businessOptions, setBusinessOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
      // pr_status_id: 0,
      review_status: 0,
    });
  }, [methods]);

  // const fetchManufacturerOptions = (search) => getOptionsManufacture({ search, limit: 100 });
  const fetchBusinessOptions = (search) => getOptionsBusiness({ search, limit: 100 });
  const fetchDepartmentOptions = (search) => getOptionsDepartment({ search, limit: 100 });

  // const loadManufacturerOptions = useCallback(() => {
  //   fetchManufacturerOptions().then(setManufacturerOptions);
  // }, []);
  // useEffect(loadManufacturerOptions, [loadManufacturerOptions]);

  const loadBusinessOptions = useCallback(() => {
    fetchBusinessOptions().then(setBusinessOptions);
  }, []);
  useEffect(loadBusinessOptions, [loadBusinessOptions]);

  const loadDepartmentOptions = useCallback(() => {
    fetchDepartmentOptions().then(setDepartmentOptions);
  }, []);
  useEffect(loadDepartmentOptions, [loadDepartmentOptions]);

  const convertOptions = (options) => {
    return options?.map((p) => {
      return {
        label: p?.name,
        value: p?.id,
      };
    });
  };

  return (
    <FormProvider {...methods}>
      <FilterSearchBar
        title='Tìm kiếm'
        onSubmit={onChange}
        onClear={() =>
          onChange({
            search: undefined,
            // manufacturer_id: undefined,
            pr_status_id: 0,
            is_active: 1,
            created_date_from: undefined,
            created_date_to: undefined,
            business_request_id: undefined,
            department_request_id: undefined,
            review_status: 0,
          })
        }
        actions={[
          {
            title: 'Từ khoá',
            component: <FormInput field='search' placeholder='Mã yêu cầu, người yêu cầu, tên sản phẩm' />,
          },
          {
            title: 'Miền',
            component: (
              <FormDebouneSelect
                field='business_request_id'
                placeholder='--Chọn--'
                fetchOptions={fetchBusinessOptions}
                list={convertOptions(businessOptions)}
              />
            ),
          },
          {
            title: 'Phòng ban',
            component: (
              <FormDebouneSelect
                field='department_request_id'
                placeholder='--Chọn--'
                fetchOptions={fetchDepartmentOptions}
                list={convertOptions(departmentOptions)}
              />
            ),
          },
          // {
          //   title: 'Hãng',
          //   component: (
          //     <FormDebouneSelect
          //       field='manufacturer_id'
          //       placeholder='--Chọn--'
          //       fetchOptions={fetchManufacturerOptions}
          //       list={convertOptions(manufacturerOptions)}
          //     />
          //   ),
          // },
          {
            title: 'Duyệt',
            component: <FormSelect field='review_status' list={REVIEW_TYPES} />,
          },
          {
            title: 'Trạng thái',
            component: <FormSelect field='is_active' list={statusTypesOption} />,
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

export default PurchaseRequisitionFilter;
