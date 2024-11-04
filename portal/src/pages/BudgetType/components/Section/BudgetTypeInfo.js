import React, { useCallback, useEffect, useState } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { getOptionsCompany } from '../../../../services/company.service';
import { mapDataOptions4SelectCustom } from '../../../../utils/helpers';
import FormSelect from '../../../../components/shared/BWFormControl/FormSelect';
import { getBusinessOptions } from '../../../../services/business.service';
import { useFormContext } from 'react-hook-form';

function BudgetTypeInfo({ disabled, title }) {
  const [companyOptions, setCompanyOptions] = useState([]);
  const [businessOptions, setBusinessOptions] = useState([]);
  const { setValue } = useFormContext();

  const getOptions = useCallback(() => {
    getOptionsCompany().then((res) => {
      setCompanyOptions(mapDataOptions4SelectCustom(res));
      getBusinessOptions().then((res) => {
        setBusinessOptions(mapDataOptions4SelectCustom(res));
      });
    });
  }, []);

  useEffect(getOptions, [getOptions]);

  useEffect(() => {
    if (companyOptions.length > 0) setValue('company_id', 1);
  }, [companyOptions]);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Thuộc công ty' isRequired disabled={disabled}>
            <FormSelect
              field='company_id'
              list={companyOptions}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Thuộc miền' isRequired disabled={disabled}>
            <FormSelect
              field='business_id'
              list={businessOptions}
              validation={{
                required: 'Miền là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Tên loại ngân sách' isRequired={true} disabled={disabled}>
            <FormInput
              field='budget_type_name'
              placeholder='Nhập tên loại ngân sách'
              validation={{
                required: 'Tên loại ngân sách là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Mã loại ngân sách' isRequired={true} disabled={disabled}>
            <FormInput
              field='budget_type_code'
              placeholder='Nhập mã loại ngân sách'
              validation={{
                validate: (value) => {
                  if (!value || value === '') return 'Mã loại ngân sách là bắt buộc';
                  const regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
                  if (regexSpecial.test(value)) return 'Mã không được chứa ký tự đặc biệt';

                  return true;
                },
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Thời gian hiệu lực của PR (Ngày)' disabled={disabled}>
            <FormInput
              field='effective_time'
              type={'number'}
              placeholder='Nhập thời gian hiệu lực PR'
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' disabled={disabled}>
            <FormTextArea rows={1} field='description' placeholder='Nhập mô tả loại ngân sách' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Ghi chú' disabled={disabled}>
            <FormInput field='notes' placeholder='Nhập ghi chú' disabled={disabled} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default BudgetTypeInfo;
