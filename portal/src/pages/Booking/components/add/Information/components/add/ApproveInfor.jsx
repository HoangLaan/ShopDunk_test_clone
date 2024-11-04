import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useAuth } from 'context/AuthProvider';
import dayjs from 'dayjs';
//components
import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';

//components
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
dayjs.extend(customParseFormat);

const Information = ({ disabled, orderId, userSchedule, isOrderFromStocksTransfer }) => {
  const methods = useFormContext({});
  const { watch, setValue, clearErrors } = methods;

  const [storeOpts, setStoreOpts] = useState([]);
  const store_id = watch('store_id');
  const booking_id = watch('booking_id');
  //const approvaluser = watch('approvaluser');

  const order_type_id = watch('order_type_id');
  const { user } = useAuth();

  useEffect(() => {
    if (booking_id && watch('appointment_status') !== 2) {
      setValue(
        'approvaluser',
        user?.isAdministrator === 1 ? user?.full_name : ` ${user?.user_name} - ${user?.full_name} `,
      );
      setValue('approvaldate', dayjs().format('DD/MM/YYYY'));
    }
  }, [booking_id, user, watch]);


  // setValue(
  //   'approvaluser',
  //   user?.isAdministrator === 1 ? user?.full_name : ` ${user?.user_name} - ${user?.full_name} `,
  // );
  // setValue('created_date', dayjs().format('DD/MM/YYYY'));

  return (
    <BWAccordion title='Thông tin đặt lịch' id='bw_info_cus' isRequired={isOrderFromStocksTransfer ? false : true}>
      <div className='bw_row'>
        {/* <FormItem label='Mã đặt lịch' className='bw_col_4' disabled>
          <FormInput type='text' field='order_no' disabled placeholder='YC0001' />
        </FormItem> */}
        <FormItem label='Người duyệt' className='bw_col_6' disabled>
          <FormInput type='text' field='approvaluser' disabled />
        </FormItem>

        <FormItem label='Ngày duyệt' className='bw_col_6' disabled>
          <FormInput type='text' field='approvaldate' disabled />
        </FormItem>


      </div>

      <div className='bw_row'>


        {/* <FormItem disabled={disabled} isRequired label='Ngày nhận hàng dự kiến' className='bw_col_4'>
          <FormDatePicker
            style={{
              width: '100%',
              padding: '2px 0px',
            }}
            placeholder='DD/MM/YYYY'
            bordered={false}
            field='receiving_date'
            format='DD/MM/YYYY'
            validation={{
              required: 'Ngày nhận hàng là bắt buộc',
            }}
            disabledDate={(current) => {
              return moment().add(-1, 'days') >= current || moment().add(1, 'month') <= current;
            }}
          />
        </FormItem> */}

      </div>


    </BWAccordion>
  );
};

export default Information;
