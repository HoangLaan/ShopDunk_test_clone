import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getBusinessOptions, getCompanyOptions, getReceiveTypeOptions } from 'services/receive-type.service';

const ReceiveTypeInformation = ({ disabled }) => {
  const methods = useFormContext();
  const [receiveTypeList, setReceiveTypeList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [businessList, setBusinessList] = useState([]);

  const loadReceiveTypeList = useCallback(() => {
    getReceiveTypeOptions().then(setReceiveTypeList);
  }, []);
  useEffect(loadReceiveTypeList, [loadReceiveTypeList]);

  const loadCompanyList = useCallback(() => {
    getCompanyOptions().then((res) => {
      if (res) {
        setCompanyList(res);
        if (Array.isArray(res) && res.length === 1) {
          methods.setValue('company_id', res[0].id);
        }
      }
    });
  }, []);
  useEffect(loadCompanyList, [loadCompanyList]);
  const company_id = useMemo(() => methods.watch('company_id'), [methods]);
  const loadBusinessList = useCallback(() => {
    getBusinessOptions({ company_id: company_id }).then(setBusinessList);
  }, [company_id]);
  useEffect(loadBusinessList, [loadBusinessList]);

  return (
    <BWAccordion title='Thông tin nhà cung cấp'>
      <div className='bw_row'>
        <FormItem className='bw_col_6' disabled={disabled} isRequired label='Mã loại thu'>
          <FormInput
            type='text'
            field='receive_type_code'
            placeholder='Nhập mã loại thu'
            validation={{
              required: 'Mã loại thu là bắt buộc',
            }}
          />
        </FormItem>

        <FormItem className='bw_col_6' disabled={disabled} isRequired label='Tên loại thu'>
          <FormInput
            type='text'
            field='receive_type_name'
            placeholder='Nhập tên loại thu'
            validation={{
              required: 'Tên loại thu là bắt buộc',
            }}
          />
        </FormItem>
      </div>

      <div className='bw_row'>
        <FormItem className='bw_col_6' label='Loại thu cha' disabled={disabled}>
          <FormSelect
            allowClear
            field='parent_id'
            list={receiveTypeList?.map((p) => {
              return {
                label: p?.name,
                value: p?.id,
              };
            })}
          />
        </FormItem>
      </div>

      <div className='bw_row'>
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
          <FormTextArea type='text' field='note' placeholder='Nhập ghi chú' />
        </FormItem>
      </div>

      <div className='bw_row'>
        <FormItem className='bw_col_12' label='Mô tả' disabled={disabled}>
          <FormTextArea type='text' field='description' placeholder='Nhập mô tả' />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default ReceiveTypeInformation;
