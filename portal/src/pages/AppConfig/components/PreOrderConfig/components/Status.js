import React from 'react';
import BWAccordion from 'components/shared/BWAccordion';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import FormItem from 'components/shared/BWFormControl/FormItem';
import { useFormContext } from 'react-hook-form';
import { mapDataOptions4Select } from 'utils/helpers';

const Status = () => {
  const methods = useFormContext();
  const { watch } = methods;
  return (
    <BWAccordion title='Cài đặt trạng thái đơn hàng pre-order' id='bw_pre_order_status_config' isRequired={true}>
      <div className='bw_row'>
        <div className='bw_col_4'>
          <FormItem label='Trạng thái đã đặt cọc đơn PreOrder' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_ODSTATUS_DEPOSITED'
              list={mapDataOptions4Select(watch('order_status_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Trạng thái đã đặt hàng đơn PreOrder' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_ODSTATUS_ORDERED'
              list={mapDataOptions4Select(watch('order_status_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Trạng thái hàng đang về đơn PreOrder' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_ODSTATUS_GOING'
              list={mapDataOptions4Select(watch('order_status_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Trạng thái chưa đủ tiền cọc đơn PreOrder' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_ODSTATUS_NEDEPOSIT'
              list={mapDataOptions4Select(watch('order_status_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Trạng thái đơn mới và chờ trả hàng đơn PreOrder' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_ODSTATUS_NEW'
              list={mapDataOptions4Select(watch('order_status_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Trạng thái hàng đã về đơn PreOrder' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_ODSTATUS_ALREADY'
              list={mapDataOptions4Select(watch('order_status_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
        <div className='bw_col_4'>
          <FormItem label='Trạng thái đã thanh toán và chờ trả hàng đơn PreOrder' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_ODSTATUS_PAID'
              list={mapDataOptions4Select(watch('order_status_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Trạng thái đã hoàn thành và chờ trả hàng đơn PreOrder' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_ODSTATUS_COMPLETE'
              list={mapDataOptions4Select(watch('order_status_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
          <FormItem label='Trạng thái đơn hàng trả PreOrder' isRequired={true} disabled={false}>
            <FormSelect
              field='PREOD_ODSTATUS_RETURNING'
              list={mapDataOptions4Select(watch('order_status_option'))}
              // validation={{
              //   required: 'Công ty là bắt buộc.',
              // }}
            />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default Status;
