/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Alert } from 'antd';
import classNames from 'classnames';

import FormInput from 'components/shared/BWFormControl/FormInput';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import FormItemCheckbox from '../Shared/FormItemCheckbox';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTimePicker from 'components/shared/BWFormControl/FormTime';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';

function FormFrequencyCare({ disabled }) {
  const methods = useFormContext();

  return (
    <Fragment>
      <div className='bw_collapse_title bw_mb_1'>
        <h3>Tần suất chăm sóc</h3>
      </div>
      <FormItemCheckbox label='Hằng ngày'>
        <FormInput
          disabled={disabled}
          type='checkbox'
          field='is_filter_daily'
          onChange={(e) => {
            methods.clearErrors('is_filter_daily');
            methods.setValue('is_filter_daily', e.target.checked ? 1 : 0);
            if (e.target.checked) {
              methods.setValue('is_filter_monthly', 0);
              methods.setValue('is_filter_once', 0);
            }
          }}
        />
      </FormItemCheckbox>
      <FormItem label='Vui lòng chọn thời gian trong ngày' className='bw_mt_-25px'>
        <FormTimePicker
          className='bw_form_bordered'
          disabled={disabled || methods.watch('is_filter_daily') !== 1}
          field='time_value_daily'
          type='time'
          format='HH:mm'
          placeholder='Chọn giờ'
          validation={{
            required: methods.watch('is_filter_daily') ? 'Chọn giờ là bắt buộc' : false,
          }}
          onChange={(e, date) => {
            if (date) {
              methods.clearErrors('time_value_daily');
              methods.setValue('time_value_daily', date);
              methods.setValue('time_value', date);
            } else {
              methods.setValue('time_value_daily', '');
            }
          }}
        />
      </FormItem>
      {/* <FormItemCheckbox label='Định kì theo tháng'>
        <FormInput
          disabled={disabled}
          type='checkbox'
          field='is_filter_monthly'
          onChange={(e) => {
            methods.clearErrors('is_filter_monthly');
            methods.setValue('is_filter_monthly', e.target.checked ? 1 : 0);
            if (e.target.checked) {
              methods.setValue('is_filter_daily', 0);
              methods.setValue('is_filter_once', 0);
            }
          }}
        />
      </FormItemCheckbox>
      <FormItem label='Vui lòng chọn thời gian trong ngày' className='bw_mt_-25px'>
        <div className='bw_row'>
          <div className='bw_col_6'>
            <FormTimePicker
              className={'bw_form_bordered'}
              disabled={disabled || methods.watch('is_filter_monthly') !== 1}
              field='time_value_monthly'
              type='time'
              format='HH:mm'
              placeholder='Chọn giờ'
              validation={{
                required: methods.watch('is_filter_monthly') === 1 ? 'Chọn giờ là bắt buộc' : false,
              }}
              onChange={(e, date) => {
                if (date) {
                  methods.clearErrors('time_value_monthly');
                  methods.setValue('time_value_monthly', date);
                  methods.setValue('time_value', date);
                } else {
                  methods.setValue('time_value_monthly', '');
                }
              }}
            />
          </div>
          <div className='bw_col_6'>
            <FormNumber
              disabled={disabled || methods.watch('is_filter_monthly') !== 1}
              bordered={true}
              placeholder='Nhập ngày'
              field='date_value'
              min={0}
              max={31}
              validation={{
                required: methods.watch('is_filter_monthly') === 1 ? 'Chọn ngày là bắt buộc' : false,
              }}
            />
          </div>
        </div>
      </FormItem>
      <Alert
        type='warning'
        message={
          <Fragment>
            <b>Chú ý:</b> Nếu ngày không tồn tại trong tháng sẽ mặc định lấy ngày cuối cùng của tháng.
          </Fragment>
        }
      />
      <FormItemCheckbox label='Một lần' className='bw_mt_1'>
        <FormInput
          disabled={disabled}
          type='checkbox'
          field='is_filter_once'
          onChange={(e) => {
            methods.clearErrors('is_filter_once');
            methods.setValue('is_filter_once', e.target.checked ? 1 : 0);
            if (e.target.checked) {
              methods.setValue('is_filter_daily', 0);
              methods.setValue('is_filter_monthly', 0);
            }
          }}
        />
      </FormItemCheckbox>
      <FormItem label='Vui lòng chọn ngày' className='bw_mt_-25px'>
        <FormDatePicker
          className={'bw_form_bordered'}
          disabled={disabled || methods.watch('is_filter_once') !== 1}
          field='time_value_once'
          placeholder={'dd/mm/yyyy'}
          format='DD/MM/YYYY'
          validation={{
            required: methods.watch('is_filter_once') === 1 ? 'Chọn ngày là bắt buộc' : false,
          }}
          onChange={(e, date) => {
            if (date) {
              methods.clearErrors('time_value_once');
              methods.setValue('time_value_once', date);
              methods.setValue('time_value', date);
            } else {
              methods.setValue('time_value_once', '');
            }
          }}
        />
      </FormItem> */}
    </Fragment>
  );
}

export default FormFrequencyCare;
