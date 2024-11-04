import React, { useCallback, useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteList } from 'services/installment-form.service';
import DataTable from 'components/shared/DataTable';
import { formatPrice } from 'utils';
import PurchaseInvoiceService from 'services/purchase-invoice.service';
import { showToast } from 'utils/helpers';
import { PAYMENT_DUE_STATUS } from '../utils/constants';

const InvoiceTable = ({
  loading,
  data,
  refreshPage,
  setShowPopupInvoice,
  setShowPopupPayment,
  setActions,
  setInvoiceId,
  reloadGlobal,
  invoiceIdFromLedger,
  setInvoiceIds,
}) => {
  const [selectedData, setSelectedData] = useState([]);

  const dispatch = useDispatch();

  const onChangeSelect = useCallback((items) => {
    const selecteddata = items.filter((item) => [0, 2].includes(item.payment_status) && item.invoice_status === 1);
    setSelectedData(selecteddata);
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => <span className='bw_text_wrap'>{index + 1}</span>,
      },
      {
        header: 'Ngày hạch toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Số hóa đơn',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'invoice_no',
      },
      {
        header: 'Đơn mua hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'purchase_order_list',
        formatter: (_) => (
          <div>
            {_.purchase_order_list?.map((purchaseOrder) => (
              <div>{purchaseOrder?.PURCHASEORDERCODE}</div>
            ))}
          </div>
        ),
      },
      {
        header: 'Mã phiếu chi',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'payment_slip_list',
        formatter: (_) => (
          <div>
            {_.invoice_payments?.length > 0
              ? _.invoice_payments?.map((paymentSlip) => {
                  return (
                    <div
                      onClick={() => {
                        if (paymentSlip.payment_type === 1) {
                          window.open(
                            `/receive-payment-slip-cash/detail/${paymentSlip.payment_slip_id}`,
                            '_blank',
                            'rel=noopener noreferrer',
                          );
                        } else if (paymentSlip.payment_type === 2) {
                          window.open(
                            `/receive-payment-slip-credit/detail/${paymentSlip.payment_slip_id}`,
                            '_blank',
                            'rel=noopener noreferrer',
                          );
                        }
                      }}
                      style={{ textDecoration: 'underline', color: '#2f80ed', cursor: 'pointer' }}>
                      {paymentSlip?.payment_slip_code}
                    </div>
                  );
                })
              : '_'}
          </div>
        ),
      },
      {
        header: 'Số tiền đã thanh toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'paid_price',
        formatter: (p) => formatPrice(p.paid_price || 0, false, ','),
      },
      {
        header: 'Số tiền',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'sum_final_payment_price',
        formatter: (p) => formatPrice(p.sum_final_payment_price, false, ','),
      },
      {
        header: 'Trạng thái thanh toán',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.payment_status === 1 ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Đã thanh toán</span>
          ) : p?.payment_status === 0 ? (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Chưa thanh toán</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_warning text-center'>Thanh toán 1 phần</span>
          ),
      },
      {
        header: 'Thời hạn thanh toán',
        accessor: 'payment_due_status',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.payment_due_status === PAYMENT_DUE_STATUS.DONE ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Đã hoàn thành</span>
          ) : p?.payment_due_status === PAYMENT_DUE_STATUS.EXPIRED ? (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Đã quá hạn</span>
          ) : p?.payment_due_status === PAYMENT_DUE_STATUS.NOT_EXPIRED ? (
            <span class='bw_label_outline bw_label_outline_warning text-center'>Chưa quá hạn</span>
          ) : p?.payment_due_status === PAYMENT_DUE_STATUS.DONE_BUT_EXPIRED ? (
            <span class='bw_label_outline bw_label_outline_warning text-center'>Hoàn thành trễ hạn</span>
          ) : null,
      },
      {
        header: 'Chi nhánh',
        accessor: 'business_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'invoice_status',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.invoice_status === 1 ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Đã hủy</span>
          ),
      },
    ],
    [],
  );

  // Mở popup khi redirect sổ nhật kí chung qua
  useEffect(() => {
    if (invoiceIdFromLedger) {
      setInvoiceId(invoiceIdFromLedger);
      setShowPopupInvoice(true);
    }
  }, [invoiceIdFromLedger]);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi fi-rr-money',
        content: 'Thanh toán',
        hidden: !selectedData || selectedData.length === 0,
        permission: 'SL_INVOICE_EDIT',
        onClick: () => {
          setInvoiceIds(selectedData.map((_) => _.invoice_id));
          setInvoiceId(null);
          setShowPopupPayment(true);
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'SL_INVOICE_ADD',
        onClick: () => {
          setShowPopupInvoice(true);
          setActions({ isEdit: false, isAdd: true });
        },
      },
      {
        icon: 'fi fi fi-rr-money',
        color: 'blue',
        tips: 'Thanh toán hóa đơn mua hàng',
        hidden: (p) => !p?.invoice_status || p?.payment_status === 1,
        permission: 'SL_INVOICE_EDIT',
        onClick: (p) => {
          setInvoiceId(p.invoice_id);
          setShowPopupPayment(true);
        },
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SL_INVOICE_EDIT',
        hidden: (p) => !p?.invoice_status || [1, 2].includes(p?.payment_status),
        onClick: (p) => {
          setShowPopupInvoice(true);
          setActions({ isEdit: true, isAdd: false });
          setInvoiceId(p.invoice_id);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SL_INVOICE_VIEW',
        onClick: (p) => {
          setShowPopupInvoice(true);
          setActions({ isEdit: false, isAdd: false });
          setInvoiceId(p.invoice_id);
        },
      },
      {
        icon: 'fi fi-rr-cross-circle',
        color: 'red',
        tips: 'Hủy hóa đơn mua hàng',
        permission: 'SL_INVOICE_CANCEL',
        hidden: (p) => !p?.invoice_status || [1, 2].includes(p?.payment_status),
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn hủy?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
              PurchaseInvoiceService.cancelInvoie(_.invoice_id)
                .then(() => {
                  showToast.success('Hủy hóa đơn thành công !');
                  reloadGlobal();
                })
                .catch(() => {
                  showToast.error('Hủy hóa đơn thất bại !');
                });
            }),
          ),
      },
    ];
  }, [dispatch, setShowPopupInvoice, selectedData]);

  return (
    <DataTable
      hiddenDeleteClick
      loading={loading}
      key='invoice_id'
      onChangeSelect={onChangeSelect}
      noPaging
      columns={columns}
      data={data}
      actions={actions}
    />
  );
};

export default InvoiceTable;
