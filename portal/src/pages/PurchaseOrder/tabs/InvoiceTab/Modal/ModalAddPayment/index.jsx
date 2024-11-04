import React, { useState, useEffect } from 'react';
import { showToast } from 'utils/helpers';
import FilterSection from './section/Filter';
import TableSection from './section/Table';
import PurchaseInvoiceService from 'services/purchase-invoice.service';
import usePagination from 'hooks/usePagination';
import lodash from 'lodash';
import { Radio } from 'antd';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { PAYMENT_METHOD } from '../../utils/constants';
import { getCreditAccountOpts, getDeptAccountOpts } from 'services/receive-slip.service';
import { RECEIPTSOBJECT } from 'pages/ReceivePaymentSlipCash/utils/constants';

const StickyFooter = styled.div`
  display: flex;
  justify-content: end;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 2;
  padding-bottom: 20px;
`;

const ModelPayment = ({ open, onClose, title, invoiceIds, purchaseOrder }) => {
  const [params, setParams] = useState({ page: 1, itemsPerPage: 25, purchase_order_code: null });
  const [data, setData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [dataSelect, setDataSelect] = useState([]);
  const [creditAccountingAccountOpts, setCreditAccountingAccountOpts] = useState([]);
  const history = useHistory();

  const creditList = {
    '111_1121': creditAccountingAccountOpts.find((x) => x.name === '111' || x.name === '1121')?.id,
    331: creditAccountingAccountOpts.find((x) => x.name === '331')?.id,
    111: creditAccountingAccountOpts.find((x) => x.name === '111')?.id,
    1111: creditAccountingAccountOpts.find((x) => x.name === '1111')?.id,
    1121: creditAccountingAccountOpts.find((x) => x.name === '1121')?.id,
  };

  const paymentData =
    data?.payment_list?.filter((product) =>
      params?.purchase_order_code ? product.purchase_order_code === params?.purchase_order_code : true,
    ) || [];

  const {
    items = [],
    itemsPerPage,
    page,
    totalItems,
    totalPages,
    onChangePage,
  } = usePagination({
    data: paymentData,
    itemsPerPage: params?.itemsPerPage,
  });

  // load detail
  useEffect(() => {
    if (invoiceIds && invoiceIds.length > 0) {
      Promise.all(invoiceIds.map((invoiceId) => PurchaseInvoiceService.getDetail(invoiceId)))
        .then((data) => {
          const dataMapping = {
            ...data[0],
            payment_list: data.map((item) => ({
              ...item.payment_list[0],
              invoice_id: item.invoice_id,
              invoice_no: item.invoice_no,
            })),
            invoice_options: data.map((invoice) => ({ value: invoice.invoice_id, label: invoice.invoice_no })),
            invoice_ids: data.map((invoice) => invoice.invoice_id),
          };
          setData(dataMapping);
        })
        .catch((err) => console.error(err));
    }
  }, [invoiceIds]);

  useEffect(() => {
    getCreditAccountOpts().then(setCreditAccountingAccountOpts);
  }, []);

  return (
    <div className={`bw_modal ${open ? 'bw_modal_open' : ''}`} id='bw_addProduct' style={{ marginLeft: '140px' }}>
      <div class='bw_modal_container bw_w1200 bw_modal_wrapper' style={{ maxHeight: '75vh', paddingBottom: '0px' }}>
        <div
          class='bw_title_modal'
          style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '0px' }}>
          <h3>{title}</h3>
          <span class='fi fi-rr-cross-small bw_close_modal' onClick={onClose}></span>
        </div>
        <div>
          <div className='bw_main_wrapp'>
            <div>
              <p style={{ margin: '10px 0', fontWeight: '600', fontSize: '15px' }}>
                Hình thức thanh toán <span style={{ color: 'red' }}>*</span>
              </p>
              <Radio.Group
                options={[
                  {
                    label: 'Tiền mặt',
                    value: 1,
                  },
                  {
                    label: 'Chuyển khoản',
                    value: 2,
                  },
                ]}
                onChange={({ target: { value } }) => {
                  setPaymentMethod(value);
                }}
                value={paymentMethod}
              />
            </div>
            <TableSection
              onChangePage={onChangePage}
              data={items}
              setData={setData}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              page={page}
              totalItems={totalItems}
              closeModal={onClose}
              dataSelect={dataSelect}
              setDataSelect={setDataSelect}
            />
          </div>
        </div>
        <StickyFooter className='bw_footer_modal bw_mt_1'>
          <button
            type='button'
            className='bw_btn bw_btn_success'
            onClick={() => {
              if (!dataSelect || dataSelect?.length === 0) {
                showToast.warning('Vui lòng chọn đơn mua hàng');
              } else {
                const is_returned_goods = purchaseOrder.is_returned_goods;
                console.log("is_returned_goods",is_returned_goods);
                console.log("purchaseOrder.is_returned_goods",purchaseOrder.is_returned_goods);
                console.log("purchaseOrder",purchaseOrder);

                if (paymentMethod === 1) {
                  history.push(`/receive-payment-slip-cash/add?type=2`, {
                    invoice_data: {
                      ...data,
                      payment_list: dataSelect,
                      receiver_type: is_returned_goods ? RECEIPTSOBJECT.CUSTOMER : RECEIPTSOBJECT.SUPPLIER,
                      receiver_id: is_returned_goods ? purchaseOrder.member_id : data?.supplier_id,
                      receiver_name: is_returned_goods ? purchaseOrder.receiver_name : data?.supplier_name,
                    },
                    payment_method: PAYMENT_METHOD.CASH,
                    credit_account: creditList['1111'],
                  });
                } else if (paymentMethod === 2) {
                  history.push(`/receive-payment-slip-credit/add?type=2`, {
                    invoice_data: {
                      ...data,
                      payment_list: dataSelect,
                      receiver_type: is_returned_goods ? RECEIPTSOBJECT.CUSTOMER : RECEIPTSOBJECT.SUPPLIER,
                      receiver_id: is_returned_goods ? purchaseOrder.member_id : data?.supplier_id,
                      receiver_name: is_returned_goods ? purchaseOrder.receiver_name : data?.supplier_name,
                    },
                    payment_method: PAYMENT_METHOD.CREDIT,
                    credit_account: creditList['1121'],
                  });
                } else {
                  showToast.warning('Vui lòng chọn hình thức thanh toán !');
                }
              }
            }}>
            <span className='fi fi-rr-check' /> Thanh toán
          </button>
          <button type='button' className='bw_btn_outline bw_close_modal' onClick={onClose}>
            Đóng
          </button>
        </StickyFooter>
      </div>
    </div>
  );
};

export default ModelPayment;
