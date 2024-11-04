import React from 'react';
import styled from 'styled-components';

import { cdnPath, formatPrice } from 'utils';
import { exportPDF } from 'services/receive-slip.service';
import { paymentFormType } from 'pages/Orders/helpers/constans';
import { useFormContext } from 'react-hook-form';

const PaymentHistoryItem = styled.div`
  border: 1px dashed var(--borderColor);
  border-radius: 5px;
  padding: 10px;
  background: var(--whiteColor);
  margin-top: 10px;

  h4 {
    font-size: 15px;
    margin-bottom: 3px;
  }

  p {
    margin-top: 7px;
  }

  span {
    font-size: 14px;
    color: var(--mainColor);
    text-decoration: underline;
  }

  p span {
    padding: 0px 8px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: 1px solid var(--borderColor);
    font-size: 16px;
    color: var(--blackColor);
  }

  ul {
    display: flex;
    flex-wrap: wrap;
  }

  ul li {
    width: 50%;
    padding: 4px 0;
  }

  .mail_wrapper {
    display: flex;
    gap: 40px;
    align-items: center;
  }

  .product_list {
    border: 1px solid var(--borderColor);
    padding-bottom: 10px;
  }

  .product_list div {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .product_list img {
    max-width: 40px;
    max-height: 40px;
    margin: 0 10px;
  }
`;

const PaymentHistory = ({ setLoading, paymentHistory }) => {
  const methods = useFormContext();
  const { watch } = methods;

  const handleExportPaymentSlipPdf = (receive_payment_id) => {
    setLoading(true);
    exportPDF({ receive_payment_id })
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        window.open(url, '_blank', 'rel=noopener noreferrer');

        // const pdflink = document.createElement('a');
        // pdflink.target = '_blank';
        // pdflink.href = url;
        // document.body.appendChild(pdflink);
        // pdflink.click();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <div className='bw_row '>
        <div className='bw_col_12 bw_collapse_title'>
          <h3>Lịch sử thanh toán</h3>
        </div>
      </div>

      {!!watch('other_acc_voucher_id') && (
        <PaymentHistoryItem className='bw_row bw_mt_2' key={`payment-history`}>
          <div className='bw_col_4'>
            <div className='bw_row bw_flex bw_align_items_center'>{watch('installment_form_name')}</div>
          </div>

          <div className='bw_col_3'>
            <div className='bw_row bw_flex bw_align_items_center bw_justify_content_right'>
              <b>{formatPrice(Math.round(watch('installment_money') || 0), true, ',')}</b>
            </div>
          </div>

          <div className='bw_col_3'>
            <div className='bw_row bw_flex bw_align_items_center bw_justify_content_right'>
              {watch('installment_payment_date')}
            </div>
          </div>

          <div className='bw_col_2'>
            <div className='bw_row bw_flex bw_align_items_center bw_justify_content_right'>
              <a
                href='/'
                className='bw_btn_table bw_green'
                style={{ marginRight: '2px' }}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    `/other-voucher/detail/${watch('other_acc_voucher_id')}?tab_active=accountings`,
                    '_blank',
                    'rel=noopener noreferrer',
                  );
                }}>
                <i className='fi fi fi-rr-eye'></i>
              </a>
            </div>
          </div>
        </PaymentHistoryItem>
      )}

      {paymentHistory?.map((item, idx) => (
        <PaymentHistoryItem className='bw_row bw_mt_2' key={`payment-history-${idx}`}>
          <div className='bw_col_4'>
            <div className='bw_row bw_flex bw_align_items_center'>{item.payment_form_name}</div>
          </div>

          <div className='bw_col_3'>
            <div className='bw_row bw_flex bw_align_items_center bw_justify_content_right'>
              <b>{formatPrice(Math.round(item.total_money), true, ',')}</b>
            </div>
          </div>

          <div className='bw_col_3'>
            <div className='bw_row bw_flex bw_align_items_center bw_justify_content_right'>{item.created_date}</div>
          </div>

          <div className='bw_col_2'>
            <div className='bw_row bw_flex bw_align_items_center bw_justify_content_right'>
              <a
                href='/'
                className='bw_btn_table bw_green'
                style={{ marginRight: '2px' }}
                onClick={(e) => {
                  e.preventDefault();
                  handleExportPaymentSlipPdf(`${item.receive_slip_id}_1`);
                }}>
                <i className='fi fi fi-rr-print'></i>
              </a>

              <a
                href='/'
                className='bw_btn_table bw_green'
                style={{ marginRight: '2px' }}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.payment_type === paymentFormType.CASH) {
                    window.open(
                      `/receive-payment-slip-cash/detail/${item.receive_slip_id}_1`,
                      '_blank',
                      'rel=noopener noreferrer',
                    );
                  } else if (
                    item.payment_type === paymentFormType.BANK ||
                    item.payment_type === paymentFormType.PARTNER ||
                    item.payment_type === paymentFormType.POS
                  ) {
                    window.open(
                      `/receive-payment-slip-credit/detail/${item.receive_slip_id}_1`,
                      '_blank',
                      'rel=noopener noreferrer',
                    );
                  }
                }}>
                <i className='fi fi fi-rr-eye'></i>
              </a>
            </div>
          </div>

          <p>{item.bank_name}</p>
        </PaymentHistoryItem>
      ))}
    </React.Fragment>
  );
};

export default PaymentHistory;
