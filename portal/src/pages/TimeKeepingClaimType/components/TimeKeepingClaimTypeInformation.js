import React, { useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { useFormContext } from 'react-hook-form';
import UserSendQCTable from './UserSendQC/UserSendQCTable';
import useGetOptions, {optionType} from 'hooks/useGetOptions';

const TimeKeepingClaimTypeInformation = ({ disabled, title }) => {
  const {watch, setValue} = useFormContext();
  const companyOptions = useGetOptions(optionType.company);
  const blockOptions = [{id: 0, value: 0, label: 'Tất cả'}, ...useGetOptions(optionType.block, {params: {parent_id: watch('company_id')}})];

  const departmentOptions = [{id: 0, value: 0, label: 'Tất cả'}, ...useGetOptions(optionType.department, { params: {
    block_ids: watch('block_id')?.map(item => item.id ?? item.value ?? item)?.join(",")
  }})]


  const isSendToQC = watch('is_inform_qc')
  return (
    <BWAccordion title={title} isRequired>
      <div className='bw_row'>
          <FormItem  className='bw_col_4' isRequired label='Công ty áp dụng' disabled={disabled}>
            <FormSelect
             field='company_id'
             validation={{ required: 'Công ty áp dụng là bắt buộc' }}
             list={companyOptions}
            />
          </FormItem>
          <FormItem className='bw_col_4' isRequired label='Khối áp dụng' disabled={disabled || !watch('company_id')}>
            <FormSelect
            mode={'multiple'}
             field='block_id'
             validation={{ required: 'Khối áp dụng là bắt buộc' }}
             list={blockOptions}
             onChange={(value) => {
              // Chọn tất cả thì clear hết value trước đó
              if(value.includes(0)){
                return setValue('block_id', [{id: 0, value: 0}])
              }
              setValue('block_id', value.map(item => ({id: item, value: item})))        
          }}
            />
          </FormItem>
          <FormItem className='bw_col_4' isRequired label='Phòng ban áp dụng' disabled={disabled || !watch('block_id')}>
            <FormSelect
            mode={'multiple'}
             field='department_id'
             validation={{ required: 'Phòng ban áp dụng là bắt buộc' }}
             list={departmentOptions}
             onChange={(value) => {
              // Chọn tất cả thì clear hết value trước đó
              if(value.includes(0)){
                return setValue('department_id', [{id: 0, value: 0}])
              }
              setValue('department_id', value.map(item => ({id: item, value: item})))        
            }}
            />
          </FormItem>
      </div>
      <div className='bw_row'>
          <FormItem className='bw_col_12' label='Tên loại giải trình' isRequired disabled={disabled}>
            <FormInput  
            field='time_keeping_claim_type_name'
            placeholder='Tên loại giải trình' 
            validation={{ required: 'Tên loại giải trình là bắt buộc' }}
             />
          </FormItem>
          <FormItem className='bw_col_12' label='Mô tả' disabled={disabled}>
            <FormTextArea  placeholder='Mô tả' field='description' />
          </FormItem>
      </div>
      <div className='bw_row'>
          <FormItem className='bw_col_6' label='Thời hạn giải trình' isRequired disabled={disabled}>
            <FormNumber min={1} max={31} addonAfter='ngày'  placeholder='Nhập số ngày' field='claim_deadline'
            validation={{ required: 'Số ngày là bắt buộc' }}
             />
          </FormItem>
          <FormItem className='bw_col_6' label='Giới hạn số lần giải trình / nhân viên / tháng' disabled={disabled}>
          <div className='bw_row'>
            <FormNumber className='bw_col_3' min={1} max={31} placeholder='Nhập số lần' field='claim_limits' addonAfter='lần / '
             />
            <FormNumber disabled={true} className='bw_col_3' min={1} max={31} placeholder='Nhập số tháng' field='limits_cycle' addonAfter='tháng'
             />
          </div>
           
          </FormItem>
      </div>
      
      <div className='bw_row'>
        <FormItem className='bw_col_12' disabled={disabled}>
          <label className='bw_checkbox'>
            <FormInput
              type='checkbox'
              field='is_inform_qc'
            />
            <span />
            Gửi đến QC
          </label>
          {isSendToQC ? <UserSendQCTable disabled={disabled} /> : null}
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default TimeKeepingClaimTypeInformation;
