import React, { useEffect } from 'react';
import BWAccordion from 'components/shared/BWAccordion/index';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormTimePicker from 'components/shared/BWFormControl/FormTime';
import { useFormContext } from 'react-hook-form';

const CustomerCareTypeInformation = ({ disabled, title }) => {
  const methods = useFormContext();
  useEffect(() => {
    if (methods.watch('is_birthday') === 1) {
      methods.setValue('is_wedding_anniversary', 0);
      methods.setValue('is_time_not_buying', 0);
      methods.setValue('is_final_buy', 0);
      methods.setValue('time_final_buy', null);
      methods.setValue('value_time_note_buying', null);
    }
  }, [methods.watch('is_birthday')]);
  useEffect(() => {
    if (methods.watch('is_wedding_anniversary') === 1) {
      methods.setValue('is_birthday', 0);
      methods.setValue('is_time_not_buying', 0);
      methods.setValue('is_final_buy', 0);
      methods.setValue('time_final_buy', null);
      methods.setValue('value_time_note_buying', null);
    }
  }, [methods.watch('is_wedding_anniversary')]);
  useEffect(() => {
    if (methods.watch('is_time_not_buying') === 1) {
      methods.setValue('is_birthday', 0);
      methods.setValue('is_wedding_anniversary', 0);
      methods.setValue('is_final_buy', 0);
      methods.setValue('time_final_buy', null);
    }
  }, [methods.watch('is_time_not_buying')]);
  useEffect(() => {
    if (methods.watch('is_final_buy') === 1) {
      methods.setValue('is_birthday', 0);
      methods.setValue('is_time_not_buying', 0);
      methods.setValue('is_wedding_anniversary', 0);
      methods.setValue('value_time_note_buying', null);
    }
  }, [methods.watch('is_final_buy')]);

  useEffect(() => {
    if (methods.watch('is_filter_daily') === 1) {
      methods.setValue('is_filter_monthly', 0);
      methods.setValue('date_value', null);
    }
  }, [methods.watch('is_filter_daily')]);

  useEffect(() => {
    if (methods.watch('is_filter_monthly') === 1) {
      methods.setValue('is_filter_daily', 0);
    }
  }, [methods.watch('is_filter_monthly')]);
  return (
    <BWAccordion title={title}>
      <div className='bw_col_12'>
        <div className='bw_row'>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} isRequired label='Tên loại chăm sóc khách hàng'>
              <FormInput
                type='text'
                field='customer_care_type_name'
                placeholder='Nhập tên loại chăm sóc khách hàng '
                validation={{
                  required: 'Tên loại chăm sóc khách hàng cần nhập là bắt buộc',
                }}
              />
            </FormItem>
          </div>
          <div className='bw_col_12'>
            <FormItem disabled={disabled} label='Ghi chú'>
              <FormTextArea type='text' field='description' placeholder='Nhập ghi chú' />
            </FormItem>
          </div>
          <div className='bw_col_6'>
            <div className='bw_collapse_title'>
              <h3>Chỉ tiêu chăm sóc</h3>
            </div>
            <div className='bw_mt_2 bw_row'>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field={'is_birthday'}></FormInput>
                <span />
                Sinh nhật trong ngày
              </label>
            </div>
            <div className='bw_mt_2 bw_row'>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field={'is_wedding_anniversary'}></FormInput>
                <span />
                Kỷ niệm ngày cưới
              </label>
            </div>
            <div className='bw_mt_2 bw_row'>
              <label className='bw_checkbox '>
                <FormInput disabled={disabled} type='checkbox' field={'is_time_not_buying'}></FormInput>
                <span />
                Thời gian lâu chưa mua
              </label>
              <div className='bw_frm_box bw_col_2'>
                <FormInput
                  disabled={disabled || methods.watch('is_time_not_buying') !== 1}
                  type='number'
                  field={'value_time_note_buying'}
                  min='0'
                  max='31'
                  placeholder={'Nhập số ngày'}
                  validation={{
                    required: methods.watch('is_time_not_buying') === 1 ? 'Số ngày là bắt buộc' : false,
                  }}></FormInput>
              </div>
            </div>
            <div className='bw_mt_2 bw_row'>
              <label className='bw_checkbox'>
                <FormInput disabled={disabled} type='checkbox' field={'is_final_buy'}></FormInput>
                <span />
                Lần mua cuối cùng kể từ ngày
              </label>
              <div className='bw_frm_box'>
                <FormDatePicker
                  format='DD/MM/YYYY'
                  disabled={disabled || methods.watch('is_final_buy') !== 1}
                  field={'time_final_buy'}
                  validation={{
                    required: methods.watch('is_final_buy') === 1 ? 'Chọn ngày là bắt buộc' : false,
                  }}
                  placeholder='Chọn ngày'></FormDatePicker>
              </div>
            </div>
          </div>
          <div className='bw_col_6'>
            <div className='bw_collapse_title'>
              <h3>Tần suất chăm sóc</h3>
            </div>
            <div className='bw_mt_2 bw_row'>
              <label className='bw_checkbox bw_col_12'>
                <FormInput disabled={disabled} type='checkbox' field={'is_filter_daily'}></FormInput>
                <span />
                Hằng ngày
              </label>
              <div className='bw_mt_2'>
                <label>Vui lòng chọn thời gian trong ngày{'  '}</label>
                <FormTimePicker
                  disabled={disabled || methods.watch('is_filter_daily') !== 1}
                  field={'time_value'}
                  type='time'
                  format='HH:mm'
                  placeholder='Chọn giờ'
                  validation={{
                    required: methods.watch('is_filter_daily') === 1 ? 'Chọn giờ là bắt buộc' : false,
                  }}></FormTimePicker>
              </div>
            </div>
            <div className=' bw_mt_2 bw_row'>
              <label className='bw_checkbox bw_col_12'>
                <FormInput disabled={disabled} type='checkbox' field={'is_filter_monthly'}></FormInput>
                <span />
                Định kì theo tháng
              </label>
            </div>
            <label>Vui lòng chọn thời gian trong ngày</label>
            <div className='bw_mt_2 bw_row'>
              <div className='bw_mt_1 bw_col_3'>
                <FormTimePicker
                  disabled={disabled || methods.watch('is_filter_monthly') !== 1}
                  field={'time_value'}
                  type='time'
                  format='HH:mm'
                  placeholder='Chọn giờ'
                  validation={{
                    required: methods.watch('is_filter_monthly') === 1 ? 'Chọn giờ là bắt buộc' : false,
                  }}></FormTimePicker>
              </div>
              <div className='bw_col_6'>
                <div className='bw_row'>
                  <label className='bw_col_2 bw_mt_2'>Ngày</label>
                  <div className='bw_frm_box bw_col_6'>
                    <FormInput
                      type='number'
                      disabled={disabled || methods.watch('is_filter_monthly') !== 1}
                      placeholder={'Nhập ngày'}
                      field={'date_value'}
                      min='0'
                      max='31 '
                      validation={{
                        required: methods.watch('is_filter_monthly') === 1 ? 'Chọn ngày là bắt buộc' : false,
                      }}></FormInput>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default CustomerCareTypeInformation;
