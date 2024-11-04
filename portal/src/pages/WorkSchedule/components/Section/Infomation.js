import React, { useEffect, useState } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import moment from 'moment';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { mapDataOptions4SelectCustom } from 'utils/helpers';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormRangePicker from 'components/shared/BWFormControl/FormDateRange';
import { useDispatch, useSelector } from 'react-redux';
import { getOptionsGlobal } from 'actions/global';
import { useFormContext } from 'react-hook-form';
import { getListWorkScheduleType, getOrderApply } from 'services/work-schedule.service';
import { useAuth } from 'context/AuthProvider';

function WorkScheduleInfo({ id = null, disabled, title }) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { user } = useAuth();
  const { setValue, watch, getValues } = methods;
  useEffect(() => {
    dispatch(getOptionsGlobal('workScheduleType'));
    dispatch(getOptionsGlobal('workScheduleReason'));
    // dispatch(getOptionsGlobal('order'));
  }, []);
  const [orderOptions, setOrderOptions] = useState([]);
  const { workScheduleTypeData, workScheduleReasonData } = useSelector((state) => state.global);

  useEffect(() => {
    getOrderApply().then((data) => setOrderOptions(mapDataOptions4SelectCustom(data)));
  }, []);

  return (
    <BWAccordion title={title}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Loại lịch công tác' isRequired disabled={disabled}>
            <FormSelect
              field='work_schedule_type_id'
              list={mapDataOptions4SelectCustom(workScheduleTypeData)}
              onChange={(value) => {
                methods.clearErrors('work_schedule_type_id');
                methods.setValue('work_schedule_type_id', value);

                getListWorkScheduleType({ work_schedule_type_id: value }).then((reviewList = []) => {
                  methods.reset((data) => ({
                    ...data,
                    work_schedule_review: reviewList,
                  }));
                });
                // hidden review status
                setValue('show_review_status', false);
              }}
              validation={{
                required: 'Loại công tác là bắt buộc',
              }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Người đăng ký' disabled={true}>
            <div style={{ padding: '8px 0' }}>{id ? getValues('created_user') : user.full_name}</div>
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Thời gian đăng ký' disabled={true}>
            <div style={{ padding: '8px 0' }}>
              {id ? getValues('created_date') : moment().format('HH:MM DD/MM/YYYY')}
            </div>
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Tên công việc' disabled={disabled}>
            <FormInput field='work_schedule_name' placeholder='Nhập tên công việc' disabled={disabled} />
          </FormItem>
        </div>
        <div className='bw_col_12'>
          <FormItem label='Lý do đăng ký' isRequired disabled={disabled}>
            <FormSelect
              mode={'tags'}
              field='reason_list'
              disabled={disabled}
              list={mapDataOptions4SelectCustom(workScheduleReasonData)}
              validation={{
                required: 'Lý do đăng ký là bắt buộc !',
              }}
            />
          </FormItem>
        </div>
        {/*         
        <div className='bw_col_6'>
          <FormItem label='Áp dụng đơn hàng' disabled={disabled}>
            <FormSelect field='order_id' disabled={disabled} list={orderOptions} />
          </FormItem>
        </div> */}

        <div className='bw_col_6'>
          <FormItem label='Thời gian từ' isRequired={true} disabled={disabled}>
            <FormRangePicker
              showTime
              style={{ width: '100%' }}
              fieldStart='start_time'
              fieldEnd='end_time'
              validation={{
                required: 'Khoảng thời gian công tác là bắt buộc',
              }}
              placeholder={['Từ ngày', 'Đến ngày']}
              format={'hh:mm A DD/MM/YYYY'}
              allowClear={true}
              disabledDate={(current) => {
                const customDate = moment().format('YYYY-MM-DD');
                return current && current < moment(customDate, 'YYYY-MM-DD');
              }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
}

export default WorkScheduleInfo;
