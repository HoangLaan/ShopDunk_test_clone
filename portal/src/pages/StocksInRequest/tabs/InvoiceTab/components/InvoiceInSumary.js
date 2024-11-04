import React, { useMemo } from 'react';

import BWAccordion from 'components/shared/BWAccordion/index';
import FormItem from 'components/shared/BWFormControl/FormItem';
import FormInput from 'components/shared/BWFormControl/FormInput';
import DataTable from 'components/shared/DataTable';
import styled from 'styled-components';
import FormNumber from 'components/shared/BWFormControl/FormNumber';
import { useFormContext } from 'react-hook-form';
import { formatPrice } from 'utils';

const InvoiceSumary = ({ disabled, title, id }) => {
  const methods = useFormContext();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã đơn mua hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'purchase_order_code',
      },
      {
        header: 'Phiếu chi',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'payment_slip_code',
        formatter: (item) => {
          return (
            <div
              onClick={() => {
                if (item.payment_type === 1) {
                  window.open(
                    `/receive-payment-slip-cash/detail/${item.payment_slip_id}`,
                    '_blank',
                    'rel=noopener noreferrer',
                  );
                } else if (item.payment_type === 2) {
                  window.open(
                    `/receive-payment-slip-credit/detail/${item.payment_slip_id}`,
                    '_blank',
                    'rel=noopener noreferrer',
                  );
                }
              }}
              style={{ textDecoration: 'underline', color: '#2f80ed', cursor: 'pointer' }}>
              {item?.payment_slip_code}
            </div>
          );
        },
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_review === 1 ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Đã duyệt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_warning text-center'>Chưa duyệt</span>
          ),
      },
      {
        header: 'Trạng thái ghi sổ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'is_bookkeeping',
        formatter: (p) =>
          p?.is_bookkeeping ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Đã ghi sổ</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_warning text-center'>Chưa ghi sổ</span>
          ),
      },
      {
        header: 'Số tiền',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        accessor: 'payment_value',
        formatter: (item) => formatPrice(item?.payment_value, false, ','),
      },
    ],
    [],
  );

  return (
    <BWAccordion title={title} id={id}>
      <div className='bw_row'>
        <div className='bw_col_6'>
          <div className='bw_row'>
            <div className='bw_col_12'>
              <FormItem label='Nhập mã tra cứu HDDT' disabled={disabled}>
                <FormInput type='text' field='invoice_transaction' placeholder='Nhập mã tra cứu' />
              </FormItem>
            </div>
            <div className='bw_col_12'>
              <FormItem label='Đường dẫn tra cứu HHDT' disabled={disabled}>
                <FormInput type='text' field='invoice_url' placeholder='Nhập đường dẫn' />
              </FormItem>
            </div>
            <div className='bw_col_12 table-minimun'>
              <DataTable noSelect noPaging columns={columns} data={methods.watch('payment_slip_list')} />
            </div>
            <div className='bw_col_12'>
              <FormItem label='' disabled={disabled}>
                <label className='bw_checkbox'>
                  <FormInput type='checkbox' field='is_active' />
                  <span />
                  Kích hoạt
                </label>
              </FormItem>
            </div>
          </div>
        </div>
        <div className='bw_col_6'>
          <div className='bw_row'>
            <div className='bw_col_6'>
              <FormItem label='Tổng tiền hàng' disabled>
                <FormNumber field='sum_into_money' />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Tổng VAT' disabled>
                <FormNumber field='sum_vat_price' />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Tổng cộng' disabled>
                <FormNumber field='sum_total_price' />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Chiết khấu' disabled>
                <FormNumber field='sum_discount_price' />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Tổng tiền phải thanh toán' disabled>
                <FormNumber field='sum_final_payment_price' />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Chi phí mua hàng' disabled>
                <FormNumber field='sum_purchase_cost' />
              </FormItem>
            </div>
            <div className='bw_col_6'>
              <FormItem label='Giá trị nhập kho' disabled>
                <FormNumber type='text' field='sum_payment_price' />
              </FormItem>
            </div>
          </div>
        </div>
      </div>
    </BWAccordion>
  );
};

export default InvoiceSumary;
