import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import FormItemLabel from 'antd/es/form/FormItemLabel';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

const information = ({ disabled, title }) => {
    const unitOpts = [
        {id:'1',
    label:'Ngày',value:1},
    {id:'2',
    label:'Tuần',value:2},
    {id:'3',
    label:'Tháng',value:3},
    ]
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormItem className='bw_col_12' label='Tên chính sách quản lý phép tồn' isRequired disabled={disabled}>
           <FormInput
           field='time_can_off_policy_name' placeholder='Nhập tên chính sách quản lý phép tồn' disabled={disabled} 
           />
          </FormItem>
          <label className='bw_col_12 bw_mb_1'>Chính sách cộng phép tồn theo chu kỳ</label>
          <FormItem className='bw_col_3' label='Số phép được cộng theo chu kỳ' isRequired disabled={disabled}>
          <FormInput
           field='monthly_time_can_off' placeholder='1' disabled={disabled} 
           />  
          </FormItem>
          <FormItem className='bw_col_2' label='Đơn vị tính phép' disabled={true}>
          <FormInput
            value='Ngày' disabled={true} 
           />  
          </FormItem>
          <FormItem className='bw_col_2' label='Theo chu kỳ' disabled={true}>
          <FormInput
            value='Tháng' disabled={true} 
           />  
          </FormItem>
          <label className='bw_col_12 bw_mb_1'>Chính sách cộng phép tồn theo thâm niên</label>
          <FormItem className='bw_col_3' label='Số phép được cộng theo thâm niên' isRequired disabled={disabled}>
          <FormInput
           field='seniority_time_can_off' placeholder='1' disabled={disabled} 
           />  
          </FormItem>
          <FormItem className='bw_col_2' label='Đơn vị tính phép' isRequired disabled={disabled}>
          <FormSelect
          list={unitOpts}
           field='time_can_off_unit' disabled={disabled} 
           />  
          </FormItem>
          <FormItem className='bw_col_3' label='Theo chu kỳ' isRequired disabled={disabled}>
          <FormInput
           field='time_can_off_cycle' placeholder='5' disabled={disabled} 
           />  
          </FormItem>
          <FormItem className='bw_col_2' label='Đơn vị tính phép' disabled={true}>
          <FormInput value="Năm"/>
          </FormItem>
          <label className='bw_col_12 bw_mb_1'>Chính sách reset phép tồn từ năm trước</label>
          <FormItem className='bw_col_4' label='Thời gian reset phép'>
          <FormDatePicker
              field='reset_time_can_off_date'
              validation={{ required: 'Thời gian reset là bắt buộc' }}
              placeholder={'DD/MM'}
              style={{
                width: '100%',
              }}
              format='DD/MM'
              bordered={false}
              disabled={disabled}
              picker="day"
              id='reset_time_can_off_date'
            />
          </FormItem>
          <FormItem className='bw_col_2' label='Theo chu kỳ' disabled={true}>
          <FormInput
            field='reset_time_can_off_cycle'
            value='Hàng năm'
            disabled={disabled}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};
export default information;
