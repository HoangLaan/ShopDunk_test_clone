import React from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItemCheckbox from '../Shared/FormItemCheckbox';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { customerTypeOptions as objectTypeOptions } from 'pages/CustomerType/utils/constants';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { wrappedOptionAll } from 'utils/helpers';

function TaskTypeInformation({ disabled, title }) {
  const methods = useFormContext();
  const { object_type } = methods.watch();

  const typeOptions = useGetOptions(optionType.customerType);
  const _typeOptions = wrappedOptionAll(typeOptions.filter((x) => x.type_apply === object_type));

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_12'>
          <FormItemCheckbox label='Loại công việc hệ thống tự động tạo'>
            <FormInput disabled={disabled} type='checkbox' field='is_task_type_auto' />
          </FormItemCheckbox>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Tên loại công việc' isRequired={true} disabled={disabled}>
            <FormInput
              field='type_name'
              placeholder='Nhập tên loại công việc'
              validation={{
                required: 'Tên loại công việc là bắt buộc',
              }}
              disabled={disabled}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Đối tượng' disabled={disabled}>
            <FormSelect
              field='object_type'
              list={objectTypeOptions}
              disabled={disabled}
              onChange={(value) => {
                methods.clearErrors('object_type');
                methods.setValue('object_type', value);
                methods.setValue('customer_type_id', null);
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_6'>
          <FormItem label='Hạng khách hàng' disabled={disabled}>
            <FormSelect field='customer_type_id' list={_typeOptions} disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Mô tả' isRequired={true}>
            <FormTextArea
              rows={3}
              field='description'
              placeholder='Nhập mô tả công việc'
              disabled={disabled}
              validation={{
                required: 'Mô tả là bắt buộc',
              }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default TaskTypeInformation;
