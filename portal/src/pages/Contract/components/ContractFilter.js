import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FilterSearchBar from 'components/shared/FilterSearchBar/index';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDateRange from 'components/shared/BWFormControl/FormDateRange';
import { mapDataOptions4Select, statusTypesOption } from 'utils/helpers';
import { getOptionsCompany } from 'services/company.service';
import { getWorkingFormOptions } from 'services/working-form.service';
import { getContractTypeOptions } from 'services/contract-type.service';

const ContractFilter = ({ onChange }) => {
  const methods = useForm();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [workingFormOptions, setWorkingFormOptions] = useState([]);
  const [contractTypeOptions, setContractTypeOptions] = useState([]);

  useEffect(() => {
    methods.reset({
      is_active: 1,
    });
  }, [methods]);

  const getOptions = useCallback(() => {
    getOptionsCompany().then((res) => {
      setCompanyOptions(mapDataOptions4Select(res));
    });

    getWorkingFormOptions().then((res) => {
      setWorkingFormOptions(mapDataOptions4Select(res));
    });
  }, []);

  useEffect(getOptions, [getOptions]);

  const company_id = methods.watch('company_id');

  useEffect(() => {
    if (company_id) {
      getContractTypeOptions({ company_id }).then((res) => {
        setContractTypeOptions(mapDataOptions4Select(res));
      });
    }
  }, [company_id]);

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
            working_form_id: undefined,
            contract_type_id: undefined,
          })
        }
        actions={[
          {
            title: 'Từ khóa',
            component: <FormInput field='keyword' placeholder={'Nhập tên, mã hợp đồng'} />,
          },
          {
            title: 'Công ty',
            isRequired: false,
            component: <FormSelect field='company_id' list={companyOptions} />,
          },
          {
            title: 'Loại hợp đồng',
            isRequired: false,
            component: <FormSelect field='contract_type_id' list={contractTypeOptions} />,
          },
          {
            title: 'Hình thức làm việc',
            isRequired: false,
            component: <FormSelect field='working_form_id' list={workingFormOptions} />,
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

export default ContractFilter;
