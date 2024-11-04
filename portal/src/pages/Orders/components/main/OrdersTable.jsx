/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'antd';

import useVerifyAccess from 'hooks/useVerifyAccess';
import { showConfirmModal } from 'actions/global';
import { msgError } from 'pages/Orders/helpers/msgError';
import { exportPreOrder, read as getDetailOrder } from 'pages/Orders/helpers/call-api';
import { cdnPath, formatPrice } from 'utils/index';
import { exportPDF } from 'pages/Orders/helpers/call-api';
import { orderType, paymentStatus } from 'pages/Orders/helpers/constans';
import { useAuth } from 'context/AuthProvider';
import { viewInvoice } from 'services/misa-invoice.service';
import { showToast } from 'utils/helpers';
import { calculateProductDiscount, exportInvoice } from 'pages/Orders/helpers/utils';
import { formatQuantity } from 'utils/number';

import DataTable from 'components/shared/DataTable/index';
import BWLoader from 'components/shared/BWLoader/index';
import CheckAccess from 'navigation/CheckAccess';

dayjs.extend(customParseFormat);

const OrdersTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  loading,
  handleChecked,
  dataCalPrices,
}) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { verifyPermission } = useVerifyAccess();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingTable, setLoadingTable] = useState();

  const isAdmin = user?.user_name === 'administrator';

  const handleExportPDF = (order_id) => {
    setLoadingPdf(true);

    exportPDF(order_id)
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };

  const handleExportInvoice = async (order_id) => {
    try {
      let orderDetail = await getDetailOrder(order_id);
      if (orderDetail) {
        if (!orderDetail?.transaction_id) {
          showToast.warning('Tính năng tạm ẩn !');
          // orderDetail = calculateProductDiscount(orderDetail);
          // await exportInvoice(orderDetail, setLoadingTable);
        } else {
          const viewLink = await viewInvoice(orderDetail?.transaction_id);
          if (viewLink) {
            window.open(viewLink, '_blank');
          }
        }
      }
    } catch (error) {
      showToast.error('Xuất hóa đơn xảy ra lỗi !');
    }
  };

  const handleExportPreOrder = useCallback((orderId) => {
    setLoadingPdf(true);

    exportPreOrder(orderId)
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  }, []);

  const columns = useMemo(
    () => [
      {
        styleHeader: {
          left: '20px',
        },
        style: {
          left: '20px',
        },
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_center',
      },
      {
        styleHeader: {
          left: '128px',
        },
        style: {
          left: '128px',
        },
        header: 'Mã đơn hàng',
        accessor: 'order_no',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => <b className=''>{p?.order_no}</b>,
      },
      {
        styleHeader: {
          left: '240px',
        },
        style: {
          left: '240px',
        },
        header: 'Khách hàng',
        accessor: 'full_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => (
          <Tooltip title={p?.phone_number}>
            <a
              className=''
              onClick={() => {
                if (p.member_id) {
                  window.open('/customer/detail/' + p.member_id, '_blank', 'rel=noopener noreferrer');
                } else if (p.dataleads_id) {
                  window.open('/customer-lead/detail/' + p.dataleads_id, '_blank', 'rel=noopener noreferrer');
                }
              }}>
              {p?.full_name}
            </a>
          </Tooltip>
        ),
      },
      {
        header: 'Cửa hàng',
        accessor: 'store_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Loại đơn hàng',
        accessor: 'order_type_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tổng tiền (đ)',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <div style={{ width: '100%' }} className='bw_flex bw_align_items_center bw_justify_content_right'>
            <b className='bw_sticky bw_name_sticky'>{formatPrice(
              p?.sub_total_apply_discount,
              false,
              ',',
            )}</b>
          </div>
        ),
      },
      {
        header: 'Đã trả (đ)',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <div style={{ width: '100%' }} className='bw_flex bw_align_items_center bw_justify_content_right'>
            <b className='bw_sticky bw_name_sticky'>{formatPrice(
              p?.total_paid,
              false,
              ',',
            )}</b>
          </div>
        ),
      },
      {
        header: 'Còn lại (đ)',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <div style={{ width: '100%' }} className='bw_flex bw_align_items_center bw_justify_content_right'>
            <b className='bw_sticky bw_name_sticky'>
              {formatPrice(
                p?.total_amount,
                false,
                ',',
              )}
            </b>
          </div>
        ),
      },
      {
        header: 'Trạng thái TT',
        accessor: 'payment_status_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.payment_status === paymentStatus.NOT_PAID ? (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Chưa TT</span>
          ) : p?.payment_status === paymentStatus.PARTIALLY_PAID ? (
            <span className='bw_label_outline bw_label_outline_warning text-center'>TT 1 phần</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_success  text-center'>Đã TT</span>
          ),
      },
      {
        header: 'Trạng thái xuất HĐ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.transaction_id ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Đã xuất HĐ</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_warning text-center'>Chưa xuất HĐ</span>
          ),
      },
      {
        header: 'Trạng thái đơn hàng',
        accessor: 'order_status_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
      },
    ],
    [handleDelete, handleExportInvoice, handleExportPDF, dispatch, handleExportPreOrder],
  );

  const handleBulkAction = (items, action) => {
    let _mapOject = items.map((_key) => _key.order_id).join('|');
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(_mapOject),
        ),
      );
    }
  };

  const hiddenRowSelect = (row) =>
    !row?.is_can_edit || (!verifyPermission(row?.order_type_delete_function) && !isAdmin);

  const actions = useMemo(() => {
    return [
      {
        title: (p) => `${p.transaction_id ? 'Xem' : 'Xuất'} hóa đơn`,
        icon: (p) => `fi ${p.transaction_id ? 'fi-rr-receipt' : 'fi-rr-file-invoice'}`,
        color: 'blue',
        permission: (p) => p?.order_type_view_function,
        outline: true,
        hidden: (p) => !(p?.payment_status === paymentStatus.PAID && +p?.order_type !== orderType.PREORDER),
        onClick: (p) => {
          handleExportInvoice(p.order_id);
        },
      },
      {
        title: 'Thông tin thanh toán',
        icon: 'fi fi-rr-cash-register',
        // hidden: (p) => !(+p?.order_type !== orderType.PREORDER),
        permission: (p) => p?.order_type_edit_function,
        color: 'blue',
        outline: true,
        onClick: (p) => window._$g.rdr(`/orders/payment/${p?.order_id}`),
      },
      {
        title: 'In hoá đơn',
        icon: 'fi fi-rr-print',
        permission: (p) => p?.order_type_view_function,
        type: 'blue',
        outline: true,
        onClick: (p) => {
          handleExportPDF(p?.order_id);
        },
      },
      {
        title: 'Xem chi tiết',
        icon: 'fi fi-rr-eye',
        color: 'blue',
        outline: true,
        permission: (p) => p?.order_type_view_function,
        onClick: (p) => window._$g.rdr(`/orders/detail/${p?.order_id}`),
      },
      {
        title: 'Chỉnh sửa',
        icon: 'fi fi-rr-edit',
        color: 'blue',
        outline: true,
        permission: (p) => p?.order_type_edit_function,
        hidden: (p) => !Boolean(p?.is_can_edit),
        onClick: (p) => window._$g.rdr(`/orders/edit/${p?.order_id}`),
      },
      {
        title: 'Xóa',
        icon: 'fi fi-rr-trash',
        color: 'red',
        outline: true,
        permission: (p) => p?.order_type_delete_function,
        hidden: (p) => !Boolean(p?.is_can_edit),
        onClick: (p) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete(p?.order_id);
            }),
          ),
      },
      {
        title: 'Tiếp tục đặt cọc',
        icon: 'fi fi-rr-money',
        // hidden: (p) => !(+p?.order_type !== orderType.PREORDER),
        permission: (p) => p?.order_type_view_function,
        color: 'blue',
        outline: true,
        onClick: (p) => {
          if (+p?.order_type === orderType.PREORDER && +p?.payment_status === paymentStatus.NOT_PAID) {
            // window.open(
            //   `https://shopdunk.com/iphone15/payment-page/${p?.pre_order_id}`,
            //   '_blank',
            //   'rel=noopener noreferrer',
            // );

            // Preoder samsung
            window.open(
              `https://samcenter.vn/pre-order/payment-page/${p?.pre_order_id}`,
              '_blank',
              'rel=noopener noreferrer',
            );
          }
        },
        hidden: (p) => !(+p?.order_type === orderType.PREORDER && +p?.payment_status === paymentStatus.NOT_PAID),
      },
      {
        title: 'In PreOrder',
        icon: 'fi fi-rr-print',
        // color: 'blue',
        outline: true,
        permission: (p) => p?.order_type_view_function,
        hidden: (p) => !(+p?.order_type === orderType.PREORDER && +p?.payment_status !== paymentStatus.NOT_PAID),
        onClick: (p) => {
          if (+p?.order_type === orderType.PREORDER && +p?.payment_status !== paymentStatus.NOT_PAID)
            handleExportPreOrder(p?.order_id);
        },
      },
    ];
  }, [handleDelete, handleExportPreOrder, dispatch]);

  return (
    <React.Fragment>
      <DataTable
        detailTr={true}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        loading={loading || loadingTable}
        handleBulkAction={handleBulkAction}
        hiddenRowSelect={hiddenRowSelect}
        onChangeSelect={handleChecked}
        customSumRow={[
          {
            index: 1,
            value: 'Tổng: ',
            colSpan: 6,
            style: {
              textAlign: 'center',
            },
          },
          {
            index: 7,
            style: {
              textAlign: 'right',
            },
            formatter: () => {
              return formatPrice(Math.round(
                dataCalPrices?.cal_total_apply_discount),
                false,
                ',',
              );
            },
          },
          {
            index: 8,
            style: {
              textAlign: 'right',
            },
            formatter: () => {
              return formatPrice(Math.round(
                dataCalPrices?.cal_total_paid),
                false,
                ',',
              );
            },
          },
          {
            index: 9,
            style: {
              textAlign: 'right',
            },
            formatter: (list = []) => {
              return formatPrice(Math.round(
                dataCalPrices?.cal_total_amount),
                false,
                ',',
              );
            },
          },
          {
            index: 10,
            value: '',
            colSpan: 13,
          },
        ]}
      />

      {loadingPdf && <BWLoader isPage={false} />}
    </React.Fragment>
  );
};

export default OrdersTable;
