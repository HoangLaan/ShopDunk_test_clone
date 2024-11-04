import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import { useFormContext } from 'react-hook-form';
import { getUserScheduleOtps } from '../helpers/call-api';
import { showToast } from 'utils/helpers';
import { useState } from 'react';

import { Checkbox } from 'antd';
import moment from 'moment';
const OffWorkItem = ({ offwork, index ,shift_list , date = null}) => {
  const { setValue, register, watch } = useFormContext();
  const [shiftList, setShiftList] = useState([]);
  const [chooseItem, setChooseItem] = useState([]);
  const handleSchedule = async (date, dateString) => {
    try {
      if (dateString) {
        const res = await getUserScheduleOtps({ date: dateString });
        setShiftList(res);
      }
    } catch (e) {
      showToast.error('Có lỗi xảy ra');
    }
  };
  useEffect(() => {
    const getData = async () => {
      if (date?.date) {
        const res = await getUserScheduleOtps({ date: date.date });
        setShiftList(res);
        setChooseItem(shift_list.filter((x) => x.shift_date == date.date));
      }
    };
    getData();
  }, [date]);

  useEffect(() => {
    register('shift_list');
  }, [register]);
  
  const onChange = (e, item) => {
    const currentShiftSchedule = watch('shift_list') || [];
    if(e.target.checked){
        const updatedShiftSchedule = [...currentShiftSchedule, item];
        setValue('shift_list', updatedShiftSchedule);
    }else{
        const updatedShiftSchedule = currentShiftSchedule.filter((i) => i.schedule_id !== item.schedule_id);
        setValue('shift_list', updatedShiftSchedule);
    }
  };

  const disabledDate = current => {
    const today = moment();
    return current && current < today;
  };

  return (
    <React.Fragment>
      <FormItem label='Nghỉ từ ngày' className='bw_col_3' isRequired={true}>
        <FormDatePicker
          disabledDate={disabledDate}
          field= {`date_list.${index}`}
          validation={{ required: 'Ngày bắt đầu là bắt buộc' }}
          placeholder={'dd/mm/yyyy'}
          style={{ width: '100%' }}
          format='DD/MM/YYYY'
          bordered={false}
          allowClear
          onChange={(date, dateString) => {
            handleSchedule(date, dateString);
            setValue(`date_list.${index}`, dateString);
          }}
        />
      </FormItem>
        <div className='bw_col_9 bw_row bw_mt_2'>
        {shiftList.map((item) => 
        <div className='bw_c3'>
            <Checkbox checked={chooseItem.some(x => x.schedule_id === item.schedule_id)} onChange={(e) => onChange(e,item)}>{item?.shift_name}</Checkbox>
            <div style={{marginLeft: '25px'}}>{item?.time_start} - {item?.time_end}</div>
        </div>)}
        </div>
    </React.Fragment>
  );
};

OffWorkItem.propTypes = {
    offwork: {}
}

export default OffWorkItem
