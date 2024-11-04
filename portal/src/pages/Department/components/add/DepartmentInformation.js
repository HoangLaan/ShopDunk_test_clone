import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { getListDepartment, getOptionsCompany } from 'services/department.service';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
const DepartmentInformation = ({ disabled }) => {
  const methods = useFormContext();
  const [listCompany, setListCompany] = useState([]);
  const [listDepartment, setListDepartment] = useState([]);
  const listBlockOptions = useGetOptions(optionType.block)
  const loadCompany = useCallback(() => {
    getOptionsCompany().then((p) => {
      setListCompany(p?.items);
    });
  }, []);
  useEffect(loadCompany, [loadCompany]);

  useEffect(() => {
    if (listCompany.length === 1 && !methods.watch('company_id')) {
      methods.setValue('company_id', listCompany[0]?.company_id);
    }
  }, [listCompany, methods]);

  const loadDeparment = useCallback(() => {
    getListDepartment({
      itemsPerPage: 129391239,
    })
      .then((p) => setListDepartment(p?.items))
      .catch((_) => {});
  }, []);
  useEffect(loadDeparment, [loadDeparment]);

  return (
    <BWAccordion title='Thông tin phòng ban'>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem disabled={disabled} isRequired label='Tên phòng ban'>
            <FormInput
              disabled={disabled}
              type='text'
              field='department_name'
              placeholder='Nhập tên phòng ban'
              validation={{
                required: 'Tên phòng ban là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem disabled={disabled} isRequired label='Thuộc công ty'>
            <FormSelect
              field='company_id'
              list={(listCompany ?? []).map((p) => {
                return {
                  label: p?.company_name,
                  value: p?.company_id,
                };
              })}
              validation={{
                required: 'Thuộc công ty là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem disabled={disabled} label='Thuộc khối'>
            <FormSelect
              field='block_id'
              list={listBlockOptions}
              allowClear
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem disabled={disabled} label='Thuộc phòng ban'>
            <FormSelect
              field='parent_id'
              list={(listDepartment ?? []).map((p) => {
                return {
                  label: p?.department_name,
                  value: p?.department_id,
                };
              })}
              allowClear
            />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem disabled={disabled} label='Mô tả'>
            <FormTextArea type='text' field='descriptions' placeholder='Mô tả' />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default DepartmentInformation;
