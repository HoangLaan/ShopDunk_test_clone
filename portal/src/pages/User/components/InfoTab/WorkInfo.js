import React from 'react';
import { useFormContext } from 'react-hook-form';
//compnents
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

export default function WorkInfo({ disabled = true }) {
  const methods = useFormContext();

  return (
    <BWAccordion title='Thông tin làm việc' id='work_info' isRequired={true}>
      <div className='bw_row'>
        <FormItem className='bw_col_4' label='Ngày bắt đầu học việc' disabled={disabled}>
          <FormDatePicker
            format={'DD/MM/YYYY'}
            field={'apprentice_date'}
            placeholder={'dd/mm/yyyy'}
            style={{
              width: '100%',
            }}
            bordered={false}
            allowClear
          />
        </FormItem>

        <FormItem className='bw_col_4' label='Ngày bắt đầu thử việc' disabled={disabled}>
          <FormDatePicker
            format={'DD/MM/YYYY'}
            field={'probation_date'}
            placeholder={'dd/mm/yyyy'}
            style={{
              width: '100%',
            }}
            bordered={false}
            allowClear
          />
        </FormItem>

        <FormItem className='bw_col_4' label='Ngày chính thức' isRequired={true} disabled={disabled}>
          <FormDatePicker
            format={'DD/MM/YYYY'}
            field={'entry_date'}
            validation={{
              required: 'Ngày chính thức là bắt buộc.',
            }}
            placeholder={'dd/mm/yyyy'}
            style={{
              width: '100%',
            }}
            bordered={false}
            allowClear
          />
        </FormItem>

        {methods.watch('work_address') && (
          <FormItem className='bw_col_12' label='Địa chỉ làm việc hiện tại' disabled={true}>
            <FormInput type='text' field='work_address' />
          </FormItem>
        )}
      </div>
    </BWAccordion>
  );
}
