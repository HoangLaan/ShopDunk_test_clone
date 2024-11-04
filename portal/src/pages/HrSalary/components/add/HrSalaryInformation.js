// import { useLocation } from 'react-router-dom';
// import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormNumber from 'components/shared/BWFormControl/FormNumber';

const HrSalaryInformation = ({ disabled }) => {
  const methods = useFormContext();
  // const { pathname } = useLocation();

  return (
    <BWAccordion title='Thông tin mức lương'>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} isRequired label='Tên mức lương'>
              <FormInput
                type='text'
                field='hr_salary_name'
                placeholder='Nhập tên mức lương'
                validation={{
                  required: 'Vui lòng không bỏ trống Tên mức lương',
                  validate: (value) => value.trim() !== '' || 'Vui lòng không bỏ trống Tên mức lương',
                }}
                maxlenght={250}
              />
            </FormItem>
          </div>

          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Tiền lương tối thiểu'>
              <FormNumber
                field='hr_salary_from'
                bordered={false}
                controls={false}
                style={{ width: '100%' }}
                addonAfter='đ'
                validation={{
                  required: 'Vui lòng không bỏ trống Tiền lương tối thiểu',
                  min: {
                    value: 0,
                    message: 'Tiền lương phải lớn hơn hoặc bằng 0',
                  },
                  validate: {
                    lessThanTo: (v) =>
                      parseInt(v) < parseInt(methods.watch('hr_salary_to')) ||
                      'Lương tối thiểu phải nhỏ hơn lương tối đa',
                  },
                }}
              />
            </FormItem>
          </div>

          <div className='bw_col_6'>
            <FormItem disabled={disabled} isRequired label='Tiền lương tối đa'>
              <FormNumber
                field='hr_salary_to'
                bordered={false}
                controls={false}
                style={{ width: '100%' }}
                addonAfter='đ'
                validation={{
                  required: 'Vui lòng không bỏ trống tiền lương tối đa',
                  min: {
                    value: 0,
                    message: 'Tiền lương phải lớn hơn hoặc bằng 0',
                  },
                  validate: {
                    greaterThanFrom: (v) =>
                      parseInt(v) > parseInt(methods.watch('hr_salary_from')) ||
                      'Lương tối đa phải lớn hơn lương tối thiểu',
                  },
                }}
              />
            </FormItem>
          </div>

          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Nhập mô tả'>
              <FormTextArea type='text' field='description' placeholder='Mô tả' />
            </FormItem>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default HrSalaryInformation;
