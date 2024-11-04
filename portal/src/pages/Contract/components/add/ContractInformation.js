import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getOptionsCompany } from 'services/company.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { getWorkingFormOptions } from 'services/working-form.service';
import { getContractTypeDetail, getContractTypeOptions } from 'services/contract-type.service';
import { getContractTermOptions } from 'services/contract-term.service';

const ContractInformation = ({ disabled, title }) => {
  const methods = useFormContext();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [workingFormOptions, setWorkingFormOptions] = useState([]);
  const [contractTypeOptions, setContractTypeOptions] = useState([]);
  const [contractTermOptions, setContractTermOptions] = useState([]);

  const getOptions = useCallback(() => {
    getOptionsCompany().then((res) => {
      setCompanyOptions(mapDataOptions4Select(res));
    });

    getWorkingFormOptions().then((res) => {
      setWorkingFormOptions(mapDataOptions4Select(res));
    });

    getContractTermOptions().then((res) => {
      setContractTermOptions(mapDataOptions4Select(res));
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

  const contract_type_id = methods.watch('contract_type_id');

  useEffect(() => {
    if (contract_type_id) {
      getContractTypeDetail(contract_type_id).then((res) => {
        if (res?.is_apply_contract_term) {
          getContractTermOptions().then((res) => {
            setContractTermOptions(mapDataOptions4Select(res));
          });
        } else {
          setContractTermOptions([]);
        }
      });
    }
  }, [contract_type_id]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Mã hợp đồng' disabled>
            <FormInput type='text' field='contract_no' />
          </FormItem>

          <FormItem className='bw_col_6' label='Tên hợp đồng' isRequired disabled={disabled}>
            <FormInput
              type='text'
              field='contract_name'
              placeholder='Nhập tên hợp đồng'
              validation={{
                required: 'Tên hợp đồng là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Công ty áp dụng' isRequired disabled={disabled}>
            <FormSelect
              field='company_id'
              list={companyOptions}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
            />
          </FormItem>

          <FormItem className='bw_col_6' label='Hình thức làm việc' isRequired disabled={disabled}>
            <FormSelect
              field='working_form_id'
              list={workingFormOptions}
              validation={{
                required: 'Hình thức làm việc là bắt buộc',
              }}
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Loại hợp đồng' isRequired disabled={disabled || !methods.watch('company_id')}>
            <FormSelect
              field='contract_type_id'
              list={contractTypeOptions}
              validation={{
                required: 'Loại hợp đồng là bắt buộc',
              }}
            />
          </FormItem>

          {Boolean(contractTermOptions?.length) && (
            <FormItem className='bw_col_6' label='Thời hạn hợp đồng' isRequired disabled={disabled}>
              <FormSelect
                field='contract_term_id'
                list={contractTermOptions}
                validation={{
                  required: !Boolean(contractTermOptions?.length) && 'Thời hạn hợp đồng là bắt buộc',
                }}
              />
            </FormItem>
          )}
        </div>
      </div>
    </BWAccordion>
  );
};
export default ContractInformation;
