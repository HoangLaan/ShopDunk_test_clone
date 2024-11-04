import React, { useEffect, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { getDepartmentOptionsByCompany, getUserOptionsByDepartmentStore } from 'services/task.service';
import { mapDataOptions, mapDataOptions4Select } from 'utils/helpers';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { getCompanyOptions } from 'services/company.service';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import useDetectHookFormChange from 'hooks/useDetectHookFormChange';

const AssignmentInformation = ({ disabled, title }) => {
  const { watch, setValue, unregister } = useFormContext();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const company_id = watch('company_id');
  const department_id = watch('department_id');
  const supervisor_user = watch('supervisor_user');
  const staff_user = watch('staff_user');

  const methods = useFormContext()
  // useDetectHookFormChange(methods)
  console.log('task', methods.watch())

  const getOptions = useCallback(() => {
    getCompanyOptions()
      .then((res) => {
        const _companyOptions = mapDataOptions(res)
        setCompanyOptions(_companyOptions);
        if (res.length === 1) {
          setValue('company_id', _companyOptions[0].value);
        }
      })
      .catch((err) => {});
  }, [setValue]);

  useEffect(getOptions, [getOptions]);

  //get department options
  const getDepartmentOptions = useCallback(() => {
    if (!company_id) {
      setDepartmentOptions([]);
      return;
    }

    getDepartmentOptionsByCompany({ company_id })
      .then((res) => {
        const _departmentOptions = mapDataOptions4Select(res)
        setDepartmentOptions(_departmentOptions);
        if (res.length === 1) {
          setValue('department_id', _departmentOptions[0].value);
        }
      })
      .catch((err) => {});
  }, [company_id, setValue]);

  useEffect(getDepartmentOptions, [getDepartmentOptions]);

  //fetch user options
  const fetchUserOptions = useCallback(
    (search, department_id, ids) => getUserOptionsByDepartmentStore({ search, department_id, ids }),
    [],
  );

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <FormItem label='Công ty' isRequired disabled={disabled}>
            <FormSelect
              field='company_id'
              list={companyOptions}
              validation={{
                required: 'Công ty là bắt buộc',
              }}
              onSelect={(value) => {
                unregister('company_id');

                setValue('department_id', undefined);
                setValue('supervisor_user', undefined);
                setValue('staff_user', undefined);

                setTimeout(() => {
                  setValue('company_id', value);
                }, 1);
              }}
            />
          </FormItem>
        </div>

        <div className='bw_col_6'>
          <FormItem label='Phòng ban' isRequired disabled={disabled || !company_id}>
            <FormSelect
              field='department_id'
              list={departmentOptions}
              validation={{
                required: 'Phòng ban là bắt buộc',
              }}
              onSelect={(value) => {
                unregister('department_id');

                setValue('supervisor_user', undefined);
                setValue('staff_user', undefined);

                setTimeout(() => {
                  setValue('department_id', value);
                }, 1);
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          {department_id && (
            <FormItem label='Nhân viên giám sát' isRequired disabled={disabled}>
              <FormDebouneSelect
                placeholder='--Chọn--'
                field='supervisor_user'
                fetchOptions={(keyword) => fetchUserOptions(keyword, department_id, [staff_user])}
                validation={{
                  required: 'Nhân viên giám sát là bắt buộc',
                }}
              />
            </FormItem>
          )}
        </div>
        <div className='bw_col_6'>
          {department_id && (
            <FormItem label='Nhân viên xử lý' isRequired disabled={disabled}>
              <FormDebouneSelect
                placeholder='--Chọn--'
                field='staff_user'
                fetchOptions={(keyword) => fetchUserOptions(keyword, department_id, [supervisor_user])}
                validation={{
                  required: 'Nhân viên xử lý là bắt buộc',
                }}
              />
            </FormItem>
          )}
        </div>
      </div>
    </BWAccordion>
  );
};

export default AssignmentInformation;
