import React, { useEffect } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormDatePicker from 'components/shared/BWFormControl/FormDate';
import FormSelect from 'components/shared/BWFormControl/FormSelect';
import { PAYMENT_STATUS_OPTIONS } from '../utils/constants';
import FormTextArea from 'components/shared/BWFormControl/FormTextArea';
import { useForm, useFormContext } from 'react-hook-form';
import styled from 'styled-components';

const HiddenArow = styled.div`
  .ant-select-arrow {
    display: none;
  }
`;

const InvoiceInfo = ({ disabled, title, id, purchaseOrder, isEdit, isAdd }) => {
  const methods = useFormContext();
  const { setValue, watch } = methods;

  useEffect(() => {
    if (isAdd) {
      if (purchaseOrder?.supplier_code) {
        setValue('supplier_code', purchaseOrder?.supplier_code);
      }
      if (purchaseOrder?.supplier_name) {
        setValue('supplier_name', purchaseOrder?.supplier_name);
      }
      if (purchaseOrder?.tax_code) {
        setValue('tax_code', purchaseOrder?.tax_code);
      }
      if (purchaseOrder?.company_name) {
        setValue('company_name', purchaseOrder?.company_name);
      }
      if (purchaseOrder?.address_full) {
        setValue('address_full', purchaseOrder?.address_full);
      }
      if (purchaseOrder?.business_name) {
        setValue('business_name', purchaseOrder?.business_name);
      }
      if (purchaseOrder?.supplier_name) {
        setValue(
          'invoice_note',
          `Mua hàng của ${purchaseOrder?.supplier_name} ${
            watch('invoice_no') ? `theo hóa đơn ${watch('invoice_no')}` : ''
          }`,
        );
      }
    }
  }, [purchaseOrder, isAdd, watch('invoice_no')]);

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div class='bw_col_3'>
          <FormItem label='Ngày hóa đơn' disabled={disabled}>
            <FormDatePicker
              field='invoice_date'
              style={{ width: '100%' }}
              placeholder={'Ngày hóa đơn'}
              format='DD/MM/YYYY'
              bordered={false}
              allowClear
            />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Ký hiệu hóa đơn' disabled={disabled}>
            <FormInput type='text' field='invoice_serial' placeholder='Nhập ký hiệu hóa đơn' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Mẫu số hóa đơn' disabled={disabled}>
            <FormInput type='text' field='invoice_form_no' placeholder='Nhập mẫu số hóa đơn' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Số hóa đơn' disabled={disabled}>
            <FormInput type='text' field='invoice_no' placeholder='Nhập số hóa đơn' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Mã nhà cung cấp' disabled>
            <FormInput type='text' field='supplier_code' disabled />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Tên nhà cung cấp' disabled>
            <FormInput type='text' field='supplier_name' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Mã số thuế' disabled>
            <FormInput type='text' field='tax_code' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Địa chỉ' disabled>
            <FormInput type='text' field='address_full' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Công ty' disabled>
            <FormInput type='text' field='company_name' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Trạng thái thanh toán' disabled>
            <HiddenArow>
              <FormSelect field='payment_status' list={PAYMENT_STATUS_OPTIONS} />
            </HiddenArow>
          </FormItem>
        </div>
        <div class='bw_col_3'>
          <FormItem label='Thời hạn thanh toán' disabled={disabled}>
            <FormDatePicker
              field='payment_expire_date'
              style={{ width: '100%' }}
              placeholder={'Chọn thời hạn thanh toán'}
              format='DD/MM/YYYY'
              // validation={{
              //   isRequired: 'Thời hạn thanh toán là bắt buộc !',
              // }}
              bordered={false}
              allowClear
            />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Người tạo' disabled>
            <FormInput type='text' field='created_user' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Chi nhánh' disabled>
            <FormInput type='text' field='business_name' />
          </FormItem>
        </div>
        <div className='bw_col_3'>
          <FormItem label='Ngày tạo' disabled>
            <FormDatePicker
              field='created_date'
              style={{ width: '100%' }}
              placeholder={'Ngày tạo'}
              format='DD/MM/YYYY'
              bordered={false}
              allowClear
            />
          </FormItem>
        </div>
        <div className='bw_col_9'>
          <FormItem label='Diễn giải' disabled={disabled}>
            <FormTextArea field='invoice_note' placeholder='Nội dung diễn giải' rows={3} />
          </FormItem>
        </div>
      </div>
    </BWAccordion>
  );
};

export default InvoiceInfo;
