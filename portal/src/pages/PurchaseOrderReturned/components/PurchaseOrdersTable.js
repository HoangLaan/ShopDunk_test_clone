import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { PURCHASE_ORDER_PERMISSIONS } from '../helpers/constants';
import { deletePurchaseOrder, getListCountOrderStatus } from '../helpers/call-api';
import { formatMoney } from 'utils';
import { STATUS_PURCHASE_ORDERS, statusPurchaseOrdersOption } from '../utils/constants';
import { formatQuantity } from 'utils/number';

const PurchaseOrdersTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  onChangeParams,
}) => {
  const [tabActive, setTabActive] = useState(statusPurchaseOrdersOption[0].value);
  const [listCountOrderStatus, setListCountOrderStatus] = useState([]);

  useEffect(() => {
    getListCountOrderStatus().then((res) => setListCountOrderStatus(res));
  }, []);

  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Mã đơn mua hàng',
        accessor: 'purchase_order_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      // {
      //   header: 'Mã đơn đặt hàng',
      //   accessor: 'request_purchase_code',
      //   classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
      //   classNameBody: 'bw_sticky bw_name_sticky',
      // },
      {
        header: 'Số hóa đơn',
        classNameHeader: 'bw_text_center',
        accessor: 'supplier_name',
        formatter: (p) => {
          return (
            <div>
              {p?.invoice_list?.map((invoice) => (
                <div
                  onClick={() => {
                    window.open(
                      `/purchase-orders/detail/${p.purchase_order_id}?tab_active=invoice`,
                      '_blank',
                      'rel=noopener noreferrer',
                    );
                  }}
                  className='bw_blue'
                  style={{ textAlign: 'center', textDecoration: 'underline', cursor: 'pointer' }}>
                  {invoice?.invoice_no}
                </div>
              ))}
            </div>
          );
        },
      },
      // {
      //   header: 'Nhà cung cấp',
      //   classNameHeader: 'bw_text_center',
      //   accessor: 'supplier_name',
      // },
      {
        header: 'Khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_name',
      },
      // {
      //   header: 'Ngày dự kiến hàng về',
      //   classNameHeader: 'bw_text_center',
      //   accessor: 'expected_date',
      // },
      {
        header: 'Chi nhánh nhận hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'business_name',
      },
      {
        header: 'Tổng giá trị',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (p) => `${formatQuantity(p?.total_money ?? 0)} VND`,
      },
      {
        header: 'Trạng thái đơn hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'order_status',
        formatter: (p) =>
          p?.order_status === 1 ? (
            <span class='text-center'>Đang đặt hàng</span>
          ) : p?.order_status === 2 ? (
            <span class='text-center'>Nhà cung cấp xác nhận</span>
          ) : p?.order_status === 3 ? (
            <span class='text-center'>Hàng đi đường</span>
          ) : (
            <span class='text-center'>Đã nhập kho</span>
          ),
      },
      {
        header: 'Trạng thái thanh toán',
        classNameHeader: 'bw_text_center',
        formatter: (p) =>
          p?.is_payments_status_id === 1 ? (
            <span class='text-center'>Đã thanh toán</span>
          ) : p?.is_payments_status_id === 2 ? (
            <span class='text-center'>Thanh toán một phần</span>
          ) : p?.is_payments_status_id === 0 ? (
            <span class='text-center'>Chưa thanh toán</span>
          ) : (
            <></>
          ),
      },
      {
        header: 'Trạng thái hóa đơn',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.invoice_status === 1 ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Đã có HĐ</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_warning text-center'>Chưa có HĐ</span>
          ),
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Lập đơn mua hàng',
        permission: PURCHASE_ORDER_PERMISSIONS.ADD,
        onClick: () => window._$g.rdr(`/purchase-orders-returned/add`),
      },
      {
        icon: 'fi fi-rr-add',
        color: 'blue',
        title: 'Tạo phiếu nhập kho',
        permission: 'ST_STOCKSIN_ADD',
        hidden: (p) => p?.order_status === STATUS_PURCHASE_ORDERS.IMPORTED,
        onClick: (p) => window._$g.rdr(`/stocks-in-request/add?tab_active=stocks_in_request&purchase_order_id=${p?.purchase_order_id}`)
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PURCHASE_ORDER_PERMISSIONS.VIEW,
        onClick: (p) => {
          window._$g.rdr(`/purchase-orders/detail/${p?.purchase_order_id}`);
        },
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: PURCHASE_ORDER_PERMISSIONS.EDIT,
        hidden: (_) => _.order_status === STATUS_PURCHASE_ORDERS.IMPORTED || _.is_payments_status_id !== 0,
        onClick: (p) => {
          window._$g.rdr(`/purchase-orders/edit/${p?.purchase_order_id}`);
        },
      },

      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permissions: PURCHASE_ORDER_PERMISSIONS.DEL,
        hidden: (_) => _.order_status === STATUS_PURCHASE_ORDERS.IMPORTED || _.is_payments_status_id !== 0,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete(_.purchase_order_id),
            ),
          ),
      },
    ];
  }, []);

  const handleDelete = async (params) => {
    await deletePurchaseOrder(params);
    onRefresh();
  };

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(items?.map((po) => po?.purchase_order_id)),
        ),
      );
    }
  };

  const getTotalOrderStatus = useCallback(
    (order_status) => {
      // Tất cả
      if (order_status === 0) {
        return listCountOrderStatus.reduce((acc, cur) => (acc += cur.total), 0);
      }
      return listCountOrderStatus.find((st) => st.order_status === order_status)?.total ?? 0;
    },
    [listCountOrderStatus],
  );

  const title = (
    <ul className='bw_tabs'>
      {statusPurchaseOrdersOption.map((o) => {
        return (
          <li
            onClick={() => {
              setTabActive(o.value);
              onChangeParams({
                order_status: o?.value,
              });
            }}
            className={tabActive === o.value ? 'bw_active' : ''}>
            <a className='bw_link'>
              {o?.label} ({getTotalOrderStatus(o?.value)})
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <DataTable
        loading={loading}
        title={title}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={handleBulkAction}
      />
    </>
  );
};

export default PurchaseOrdersTable;