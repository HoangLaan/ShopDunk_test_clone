import { useCallback, useEffect, useState } from 'react';

import { getUserOptions } from 'services/task.service';

import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormDebouneSelect from 'components/shared/BWFormControl/FormDebouneSelect';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormSelect from 'components/shared/BWFormControl/FormSelect';

import { MIN_DAYS } from './helpers/const';
import { TABS } from './CustomerCare';
import useGetOptions, { optionType } from 'hooks/useGetOptions';
import { mapDataOptions4Select } from 'utils/helpers';
import FormTimePicker from 'components/shared/BWFormControl/FormTime';

function CustomerCareAppointment({ currTab, methods }) {
  // const isValidate = currTab === TABS.APPOINTMENT ? null : {};
  const isValidate = null
  const storeOptions = useGetOptions(optionType.store);

  useEffect(() => {
    methods.reset();
    return () => {
      methods.unregister('store_id');
      methods.unregister('username');
      methods.unregister('date');
      methods.unregister('time_from');
      methods.unregister('time_to');
      methods.unregister('appointment_subject');
      methods.unregister('location');
      methods.unregister('content_appointment');
    }
  }, [currTab]);

  const store_id = methods.watch('store_id');
  const fetchUserOptions = useCallback((search) => getUserOptions({ search, store_id }), [store_id]);

  const [initUserOptions, setInitUserOptions] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetchUserOptions({ store_id });
      setInitUserOptions(mapDataOptions4Select(response));
    }
    fetchData();
  }, [store_id]);

  return (
    <div className={`bw_tab_items bw_active`}>
      <FormItem className='bw_col_12' label='Cửa hàng' style='gray' isRequired={true}>
        <FormSelect
          placeholder='--Chọn--'
          field='store_id'
          list={storeOptions}
          validation={isValidate ?? { required: 'Chưa chọn cửa hàng' }}
        />
      </FormItem>
      <FormItem className='bw_col_12' label='Nhân viên thực hiện' style='gray' isRequired={true}>
        <FormDebouneSelect
          placeholder='--Chọn--'
          field='username'
          fetchOptions={(keyword) => fetchUserOptions(keyword)}
          validation={isValidate ?? { required: 'Chưa chọn nhân viên thực hiện' }}
          list={initUserOptions}
          key={store_id}
        />
      </FormItem>

      <FormItem className='bw_col_12' label='Ngày hẹn' style='gray'>
        <FormDatePicker
          style={{ width: '100%' }}
          field='date'
          placeholder={'dd/mm/yyyy'}
          format={'DD/MM/YYYY'}
          allowClear={true}
          bordered={false}
        />
      </FormItem>

      <div className='bw_col_12'>
        <div className='bw_row'>
          <FormItem className='bw_col_6' label='Thời gian từ' style='gray'>
            <FormTimePicker
              field='time_from'
              type='time'
              format='HH:mm'
              bordered={false}
              style={{ width: '100%' }}
              validation={
                isValidate ?? {
                  validate: {
                    positiveNumber: (value, { date }) => {
                      if (!value) return true;
                      const [hoursSelect, minutesSelect] = value.split(':');
                      const hoursNow = new Date().getHours();
                      const minutesNow = new Date().getMinutes();
                      if (date !== MIN_DAYS || +hoursSelect > hoursNow) return true;
                      if (+hoursSelect === hoursNow && +minutesSelect >= minutesNow) {
                        return true;
                      }

                      return `Thời gian từ phải >= ${hoursNow}:${minutesNow} ${hoursNow >= 12 ? 'PM' : 'AM'}`;
                    },
                  },
                }
              }
            />
          </FormItem>
          <FormItem className='bw_col_6' label='Thời gian đến' style='gray'>
            <FormTimePicker type='time' format='HH:mm' bordered={false} style={{ width: '100%' }} field='time_to' />
          </FormItem>
        </div>
      </div>

      <FormItem className='bw_col_12' label='Chủ đề' style='gray' isRequired={true}>
        <FormInput
          type='text'
          field='appointment_subject'
          placeholder='Chủ đề cuộc gọi'
          validation={isValidate ?? { required: 'Chủ đề cuộc gọi không được trống' }}
        />
      </FormItem>
      <FormItem className='bw_col_12' label='Địa chỉ' style='gray'>
        <FormInput field='location' placeholder='Nhập địa chỉ' />
      </FormItem>
      <FormItem className='bw_col_12' label='Nội dung' style='gray' isRequired={true}>
        <FormTextArea
          field='content_appointment'
          rows={3}
          placeholder='Nội dung'
          validation={isValidate ?? { required: 'Nội dung không được trống' }}
        />
      </FormItem>
    </div>
  );
}

export default CustomerCareAppointment;
