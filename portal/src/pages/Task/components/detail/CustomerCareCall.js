import { useCallback, useEffect, useState } from 'react';

import { getTaskOptions, getUserOptions, getUserOptionsByDepartmentStore } from 'services/task.service';
import { mapDataOptions4Select } from 'utils/helpers';
import { callPhone } from 'pages/VoidIp/utils/helpers';
import useQueryString from 'hooks/use-query-string';
import JsSIP from 'jssip';
import i__callGen from 'assets/bw_image/i__callGen.svg';
import { TABS } from './CustomerCare';

function CustomerCareCall({ currTab, methods, phoneNumber }) {
  const [value] = useQueryString();
  const isValidate = currTab === TABS.CALL ? null : {};

  useEffect(() => {
    methods.reset();
  }, [currTab]);
  const [taskOptions, setTaskOptions] = useState([]);

  const fetchUserOptions = useCallback((search) => getUserOptions({ search }), []);

  const getOptions = useCallback(() => {
    getTaskOptions()
      .then((res) => {
        setTaskOptions(mapDataOptions4Select(res));
      })
      .catch((err) => { });
  }, []);

  useEffect(getOptions, [getOptions]);

  return (
    <div style={{
      display: 'flex'
    }} className='bw_tab_items bw_active'>
      {/* <FormItem className='bw_col_12' label='Loại cuộc gọi'>
        <FormSelect
          field='call_type_id'
          list={taskOptions}
          validation={isValidate ?? { required: 'Chưa chọn loại cuộc gọi' }}
        />
      </FormItem> */}

      {/* <FormItem className='bw_col_12' label='Nhân viên thực hiện'>
        <FormDebouneSelect
          placeholder='--Chọn--'
          field='username'
          fetchOptions={fetchUserOptions}
          validation={isValidate ?? { required: 'Chưa chọn nhân viên thực hiện' }}
        />
      </FormItem> */}

      {/* <FormItem className='bw_col_12' label='Ngày gọi'>
        <FormDatePicker
          style={{ width: '100%' }}
          field='date'
          placeholder={'dd/mm/yyyy'}
          format={'DD/MM/YYYY'}
          allowClear={true}
          bordered={false}
          validation={
            isValidate ?? {
              required: 'Chưa chọn ngày gọi',
              validate: {
                positiveNumber: (value) => {
                  const formatDate = (date) => new Date(date.split('/').reverse().join('-'));
                  const compareDate = formatDate(value) >= formatDate(MIN_DAYS);
                  return compareDate ? compareDate : `Ngày gọi phải >= ${MIN_DAYS}`;
                },
              },
            }
          }
        />
      </FormItem> */}

      <div className='bw_col_12'>
        <a style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
          onClick={() => {
            callPhone(phoneNumber);
          }}
          className='bw_btn_call'>
          <img style={{
            marginRight: '6px'
          }} src={i__callGen} />
          <p>Bắt đầu cuộc gọi</p>
        </a>
        {/* <button
          onClick={() => {
            callPhone('0909970240');
          }}>

        </button> */}
        {/* <div className='bw_row'>
          <FormItem className='bw_col_6' label='Thời gian từ'>
            <FormInput
              type='time'
              field='time_from'
              placeholder='Thời gian từ'
              validation={
                isValidate ?? {
                  required: 'Chưa chọn thời gian từ',
                  validate: {
                    positiveNumber: (value, { date }) => {
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
          <FormItem className='bw_col_6' label='Thời gian đến'>
            <FormInput
              type='time'
              field='time_to'
              placeholder='Thời gian đến'
              validation={isValidate ?? { required: 'Chưa chọn thời gian đến' }}
            />
          </FormItem>
        </div> */}
      </div>
      <input />
    </div >
  );
}

export default CustomerCareCall;
