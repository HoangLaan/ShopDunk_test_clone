import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { mapDataOptions4Select } from 'utils/helpers';
import { getDepartmentByBlock } from 'services/offwork-management.service';
const optionAll = { id: 0, name: 'Tất cả', label: 'Tất cả', value: 0 };

const BusinessApply = ({ disabled, title }) => {
  const methods = useFormContext();
  const { setValue, watch, reset } = methods;
  const companyOpts = useGetOptions(optionType.company);
  const blockOpts = useGetOptions(optionType.block, { params: { parent_id: watch('company_id') } });
  blockOpts.unshift(optionAll);
  const [departmentOpts, setDepartmentOpts] = useState([]);

  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Công ty' isRequired disabled={disabled}>
            <FormSelect field='company_id' list={companyOpts} validation={{ required: 'Công ty là bắt buộc' }} />
          </FormItem>
          <FormItem className='bw_col_6' label='Khối' isRequired disabled={disabled || !watch('company_id')}>
            <FormSelect
              field='block_list'
              list={blockOpts}
              onChange={(value) => {
                getDepartmentByBlock(value).then((res) => setDepartmentOpts([optionAll, ...res]));
                if (value.includes(0)) {
                  return setValue(
                    'block_list',
                    blockOpts.filter((item) => item.id),
                  );
                }
                setValue('block_list', value);
              }}
              validation={{ required: 'Khối là bắt buộc' }}
              mode='multiple'
            />
          </FormItem>
        </div>

        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Phòng ban' isRequired disabled={disabled || !watch('block_list')}>
            <FormSelect
              field='department_list'
              list={departmentOpts}
              onChange={(value) => {
                if (value.includes(0)) {
                  return setValue(
                    'department_list',
                    departmentOpts.filter((item) => item.id),
                  );
                }
                setValue('department_list', value);
              }}
              mode='multiple'
              validation={{ required: 'Phòng ban là bắt buộc' }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};
export default BusinessApply;
