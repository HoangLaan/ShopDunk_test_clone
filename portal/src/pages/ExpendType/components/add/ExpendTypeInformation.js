import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getBusinessOptions, getCompanyOptions, getExpendTypeOptions } from 'services/expend-type.service';
import FormTreeSelect from 'components/shared/BWFormControl/FormTreeSelect';

const ExpendTypeInformation = ({ disabled }) => {
  const methods = useFormContext();
  const [companyList, setCompanyList] = useState([]);
  const [businessList, setBusinessList] = useState([]);

  const loadCompanyList = useCallback(() => {
    getCompanyOptions().then(setCompanyList);
  }, []);
  useEffect(loadCompanyList, [loadCompanyList]);

  useEffect(() => {
    if (companyList?.length === 1 && !methods.getValues('company_id')) {
      methods.setValue('company_id', companyList[0]?.id);
    }
  }, [companyList, methods]);

  const company_id = useMemo(() => methods.watch('company_id'), [methods]);
  const loadBusinessList = useCallback(() => {
    getBusinessOptions({ company_id: company_id }).then(setBusinessList);
  }, [company_id]);
  useEffect(loadBusinessList, [loadBusinessList]);

  return (
    <BWAccordion title='Thông tin nhà cung cấp'>
      <div className='bw_row'>
        <FormItem className='bw_col_6' disabled={disabled} isRequired label='Mã loại chi'>
          <FormInput
            type='text'
            field='expend_type_code'
            placeholder='Nhập mã loại chi'
            validation={{
              required: 'Mã loại chi là bắt buộc',
              validate: (value) => !!value.trim() || 'Mã loại chi là bắt buộc.',
            }}
            maxlength={20}
          />
        </FormItem>

        <FormItem className='bw_col_6' disabled={disabled} isRequired label='Tên loại chi'>
          <FormInput
            type='text'
            field='expend_type_name'
            placeholder='Nhập tên loại chi'
            validation={{
              required: 'Tên loại chi là bắt buộc',
              validate: (value) => !!value.trim() || 'Tên loại chi là bắt buộc.',
            }}
            maxlength={250}
          />
        </FormItem>

        <FormItem className='bw_col_6' label='Loại chi cha' disabled={disabled}>
          <FormTreeSelect
            field='parent_id'
            fetchOptions={getExpendTypeOptions}
            allowClear={true}
            treeDataSimpleMode
            placeholder='--Chọn--'
          />
        </FormItem>
        <FormItem className='bw_col_6' isRequired label='Công ty áp dụng' disabled={disabled}>
          <FormSelect
            field='company_id'
            list={companyList?.map((p) => {
              return {
                label: p?.name,
                value: p?.id,
              };
            })}
            validation={{
              required: 'Công ty áp dụng là bắt buộc.',
            }}
          />
        </FormItem>

        <FormItem
          className='bw_col_6'
          isRequired
          label='Chi nhánh áp dụng'
          disabled={disabled || !methods.watch('company_id')}>
          <FormSelect
            field='business_id_list'
            list={businessList?.map((p) => {
              return {
                label: p?.name,
                value: parseInt(p?.id),
              };
            })}
            validation={{
              required: 'Chi nhánh áp dụng là bắt buộc.',
            }}
            mode={'multiple'}
            allowClear={true}
          />
        </FormItem>
      </div>

      <div className='bw_row'>
        <FormItem className='bw_col_12' label='Ghi chú' disabled={disabled}>
          <FormTextArea
            type='text'
            field='note'
            placeholder='Nhập ghi chú'
            validation={{
              validate: (value) => !value || value.length <= 2000 || 'Ghi chú không vượt quá 2000 từ.',
            }}
          />
        </FormItem>
      </div>

      <div className='bw_row'>
        <FormItem className='bw_col_12' label='Mô tả' disabled={disabled}>
          <FormTextArea
            type='text'
            field='description'
            placeholder='Nhập mô tả'
            validation={{
              validate: (value) => !value || value.length <= 2000 || 'Mô tả không vượt quá 2000 từ.',
            }}
          />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default ExpendTypeInformation;
