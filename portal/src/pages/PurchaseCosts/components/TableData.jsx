import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import DataTable from 'components/shared/DataTable/index';
import { showConfirmModal } from 'actions/global';
import { formatPrice } from 'utils/index';

import { statusPaymentFormOption } from 'pages/PurchaseOrder/utils/constants';
import { formatQuantity } from 'utils/number';

const definedValueReturn = (value, valueReturn = []) => {
  let result = valueReturn;
  if (value && JSON.stringify(value) !== '{}') {
    result = value;
  }
  return result;
};

const renderItemSplit = (dataSplit = '' , defaultValue = '') => {
  return (
      <ul className='bw_text_center'>
        {(dataSplit || defaultValue).split('|').map((_name, i) => {
          if(_name) {
            return (
              <li key={i}>
                <p>{_name}</p>
              </li>
            );
          }
        })}
      </ul>
  );
};

const checkGetValueInJson = (value, obj, fieldGet, fieldSet, valueDefault = '') => {
  let result = valueDefault;
  obj.map((val) => {
    if (val) {
      if (val[fieldGet] == value && val[fieldSet]) {
        result = val[fieldSet];
      }
    }
  });
  return result;
};

const MAX_COLUMN_IN_PAGE = 25;

const PurchaseCostsTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  loading,
  reload,
}) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      // {
      //   header: 'STT',
      //   accessor: '_',
      //   classNameBody: 'bw_text_center',
      //   classNameHeader: 'bw_text_center',
      //   formatter: (_, index) => index + 1 + MAX_COLUMN_IN_PAGE * (parseInt(page) - 1),
      // },
      {
        header: 'Ngày hạch toán',
        accessor: 'accounting_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số chứng từ',
        accessor: 'payment_code',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mã nhà cung cấp',
        accessor: 'supplier_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên nhà cung cấp',
        accessor: 'supplier_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mã đơn mua hàng',
        accessor: 'purchase_order_code',
        classNameHeader: 'bw_text_center',
        formatter: (p) => renderItemSplit(p?.purchase_order_code),
      },
      {
        header: 'Mã phiếu nhập kho',
        accessor: 'stocks_in_code',
        classNameHeader: 'bw_text_center',
        formatter: (p) => renderItemSplit(p?.stocks_in_code),
      },
      {
        header: 'Diễn giải',
        accessor: 'purchase_cost_note',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Thành tiền',
        accessor: 'total_purchase_cost',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <div className='bw_text_right'>{formatQuantity(p.total_purchase_cost)}</div>,
      },
      {
        header: 'Trạng thái thanh toán',
        accessor: 'is_payments_status_id',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <div className='bw_text_right'>
            {checkGetValueInJson(p?.is_payments_status_id, statusPaymentFormOption, 'value', 'label')}
          </div>
        ),
      },
      {
        header: 'Nhân viên mua hàng',
        accessor: 'employee_purchase_name',
        classNameHeader: 'bw_text_center',
      },
    ],
    [page],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        content: 'Thêm chi phí mua hàng',
        icon: 'fi fi-rr-plus',
        color: 'blue',
        permission: 'SL_RECEIVE_PAYMENT_CASH_VIEW',
        onClick: () => window._$g.rdr(`/purchase-cost/add?type=1`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'blue',
        permission: 'SL_RECEIVE_PAYMENT_CASH_VIEW',
        onClick: (p) => window._$g.rdr(`/purchase-cost/detail/${p?.purchase_cost_id}`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SL_RECEIVE_PAYMENT_CASH_EDIT',
        onClick: (p) => window._$g.rdr(`/purchase-cost/edit/${p?.purchase_cost_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SL_RECEIVE_PAYMENT_CASH_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await handleDelete([_?.purchase_cost_id]);
              },
            ),
          ),
      },
    ];
  }, []);

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      let list_id = items.map((item) => item.purchase_cost_id);
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(list_id),
        ),
      );
    }
  };

  return (
    <div>
      <DataTable
        loading={loading}
        data={definedValueReturn(data, [])}
        columns={columns}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={handleBulkAction}
      />
    </div>
  );
};

export default PurchaseCostsTable;
