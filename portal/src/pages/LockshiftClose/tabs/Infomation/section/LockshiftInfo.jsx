import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
//components

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormDate from 'components/shared/BWFormControl/FormDate';

const Information = ({ disabled, title }) => {
  return (
    <BWAccordion title={title} id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <FormItem label='Cửa hàng' className='bw_col_6' isRequired>
          <FormInput type='text' field='store_name' disabled={true} />
        </FormItem>
        <FormItem label='Ngày làm việc' className='bw_col_6'>
          <FormDate field='shift_date' disabled={true} format={'DD/MM/YYYY'}/>
        </FormItem>
        <FormItem label='Người kết ca' className='bw_col_6' isRequired>
          <FormInput type='text' field='created_user' disabled={true} />
        </FormItem>
        <FormItem label='Ca làm việc' className='bw_col_6'>
          <FormInput type='text' field='shift_name' disabled={true} />
        </FormItem>
        <FormItem label='Trưởng ca' className='bw_col_6'>
          <FormInput field='shift_leader' disabled={true} />
        </FormItem>
        <FormItem label='Giờ làm việc' className='bw_col_6'>
          <FormInput field='work_time' disabled />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default Information;
