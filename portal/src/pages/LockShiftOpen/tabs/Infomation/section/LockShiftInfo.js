import React, { useCallback, useEffect, useState } from 'react';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import { getDetail } from 'services/lockshift-open.service';
import { useFormContext } from 'react-hook-form';

const Information = ({ disabled, title, lockShiftId }) => {
  const methods = useFormContext();
  const {setValue} = methods
  const [infoShift, setInfoShift] = useState({});
  const getInfoShift = useCallback(() => {
    getDetail({ lockShiftId })
      .then(setInfoShift)
      .catch((err) => {});
  }, [lockShiftId]);

  useEffect(getInfoShift, [getInfoShift]);
  useEffect(()=>{
    setValue('shift_leader',infoShift?.shift_leader)
    setValue('store_id',infoShift?.store_id)
    setValue('shift_id',infoShift?.shift_id)
  },[infoShift])
  return (
    <BWAccordion title={title} id='bw_info_cus' isRequired>
      <div className='bw_row'>
        <FormItem label='Cửa hàng' className='bw_col_6'>
          <FormInput type='text' value={infoShift?.store_name} disabled={true} />
        </FormItem>
        <FormItem label='Ngày làm việc' className='bw_col_6'>
          <FormInput type='text' value={infoShift?.shift_date} disabled={true} format={'DD/MM/YYYY'} />
        </FormItem>
        <FormItem label='Người nhận ca' className='bw_col_6' isRequired>
          <FormInput
            type='text'
            value={infoShift?.shift_recipient + ' - ' + infoShift?.shift_recipient_fullname}
            disabled={true}
          />
        </FormItem>
        <FormItem label='Ca làm việc' className='bw_col_6'>
          <FormInput value={infoShift?.shift_name} type='text' disabled={true} />
        </FormItem>
        <FormItem label='Trưởng ca' className='bw_col_6'>
          <FormInput value={infoShift?.shift_leader + ' - ' + infoShift?.shift_leader_fullname} disabled={true} />
        </FormItem>
        <FormItem label='Giờ làm việc' className='bw_col_6'>
          <FormInput value={infoShift?.work_time} disabled />
        </FormItem>
      </div>
    </BWAccordion>
  );
};

export default Information;
