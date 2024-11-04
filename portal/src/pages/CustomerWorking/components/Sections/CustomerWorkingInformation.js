/* eslint-disable react/style-prop-object */
import React from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import { phoneRule } from 'pages/CustomerLead/utils/formRules';
import { GENDER } from 'pages/CustomerLead/utils/constants';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { CUSTOMER_TYPE } from 'pages/CustomerType/utils/constants';

function CustomerWorkingInformation({ disabled, title }) {
  const methods = useFormContext();
  const customerTypeOptions = useGetOptions(optionType.customerType);
  const _customerTypeOptions = customerTypeOptions.filter((x) => x.type_apply === CUSTOMER_TYPE.LEADS);

  const taskTypeOptions = useGetOptions(optionType.taskTypeAuto, {
    params: {
      parent_id: methods.watch('customer_type_id'),
      is_active: 1
    },
  });

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <div className='bw_row'>
            <div className='bw_col_2'>
              <FormItem label='Giới tính'>
                <FormSelect
                  field={'gender'}
                  placeholder='Giới tính'
                  list={[
                    { value: GENDER.MALE, label: 'Anh' },
                    { value: GENDER.FEMALE, label: 'Chị' },
                  ]}
                  disabled={disabled}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem disabled={disabled} isRequired label='Họ và tên'>
                <FormInput
                  type='text'
                  field='full_name'
                  placeholder='Nhập họ và tên khách hàng'
                  validation={{
                    required: 'Họ và tên là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_4'>
              <FormItem label='Số điện thoại' isRequired={true}>
                <FormInput
                  field='phone_number'
                  placeholder='Nhập số điện thoại'
                  validation={phoneRule}
                  disabled={disabled}
                  onChange={(e) => {
                    methods.clearErrors('phone_number');
                    methods.setValue('phone_number', e.target.value);
                    const affiliateId = e.target.value.replace(/^0+/, '');
                    methods.setValue('affiliate', `https://shopdunk.com/${affiliateId}`);
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Hạng khách hàng'>
                <FormSelect
                  field='customer_type_id'
                  list={_customerTypeOptions}
                  placeholder='Hạng khách hàng'
                  disabled={disabled}
                  onChange={(value) => {
                    methods.clearErrors('customer_type_id');
                    methods.setValue('customer_type_id', value);
                    methods.setValue('task_type_id', null);
                  }}
                />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Loại công việc' isRequired disabled={disabled}>
                <FormSelect
                  field='task_type_id'
                  list={taskTypeOptions}
                  validation={{
                    required: 'Loại công việc là bắt buộc',
                  }}
                />
              </FormItem>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
}

export default CustomerWorkingInformation;
