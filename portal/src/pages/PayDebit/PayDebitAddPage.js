import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { defaultPaging, defaultParams, showToast } from 'utils/helpers';
import { getListReceiveSlip } from './helpers/call-api';
import DataTable from 'components/shared/DataTable';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { formatCurrency } from 'pages/Product/helpers';
import { formatMoney } from 'utils';

const PayDebitAddPage = () => {
  const { debit_id } = useParams();
  const [listData, setDataList] = useState(defaultPaging);
  const [loading, setLoading] = useState(false);

  const { items, itemsPerPage, page, totalItems, totalPages } = listData;
  const [params, setParams] = useState(defaultParams);

  const loadReceiveSlip = useCallback(() => {
    setLoading(true);
    getListReceiveSlip(debit_id)
      .then(setDataList)
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  useEffect(loadReceiveSlip, [loadReceiveSlip]);

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        accessor: '_',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p, i) => <div>{i + 1}</div>,
      },
      {
        header: 'Số phiếu',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (item) => {
          if (item.puchase_order_id) {
            return (
              <span
                onClick={() => {
                  window.open(`/purchase-orders/detail/${item.puchase_order_id}`, '_blank', 'rel=noopener noreferrer');
                }}
                style={{ textDecoration: 'underline', cursor: 'pointer', color: '#576cbc' }}>
                {item.purchase_order_code}
              </span>
            );
          } else if (item.puchase_costs_id) {
            return (
              <span
                onClick={() => {
                  window.open(`/purchase-cost/detail/${item.puchase_costs_id}`, '_blank', 'rel=noopener noreferrer');
                }}
                style={{ textDecoration: 'underline', cursor: 'pointer', color: '#576cbc' }}>
                {item.invoice_no}
              </span>
            );
          } else {
            return '_';
          }
        },
      },
      {
        header: 'Ngày hạch toán',
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số phiếu chi',
        accessor: 'code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Số tiền',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (item) => formatMoney(item.total_money),
      },
      {
        header: 'Trạng thái duyệt',
        formatter: (item) => (
          <div>
            {item.payment_status === 1 ? (
              <span className='bw_label_outline bw_label_outline_success text-center'>{'Đã duyệt'}</span>
            ) : item.payment_status === 0 ? (
              <span className='bw_label_outline bw_label_outline_danger text-center'>{'Không duyệt'}</span>
            ) : item.payment_status === 2 ? (
              <span className='bw_label_outline bw_label_outline_warning text-center'>{'Chưa duyệt'}</span>
            ) : (
              <span className='bw_label_outline bw_label_outline_primary text-center'>{'Đang duyệt'}</span>
            )}
          </div>
        ),
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-eye',
        color: 'blue',
        title: 'Chi tiết',
        permission: 'SL_RECEIVE_PAYMENT_CASH_VIEW',
        onClick: (p) => {
          if (p?.payment_type === 1) {
            return window._$g.rdr(`/receive-payment-slip-cash/detail/${p?.payment_slip_id}`);
          } else {
            return window._$g.rdr(`/receive-payment-slip-credit/detail/${p?.payment_slip_id}`);
          }
        },
      },
    ];
  }, []);
  return (
    <div className='bw_main_wrapp'>
      <DataTable
        noSelect
        loading={loading}
        data={items}
        columns={columns}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
      />
    </div>
  );
};

export default PayDebitAddPage;
