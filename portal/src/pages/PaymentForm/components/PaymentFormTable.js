import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { PAYMENTFORM_TYPE_OPTIONS, PERMISSION_PAYMENT_FORM } from '../utils/constants';
import { deletePaymentForm } from 'services/payment-form.service';

const PaymentFormTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên hình thức thanh toán',
        accessor: 'payment_form_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_title_page bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_title_page',
      },
      {
        header: 'Loại',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (item) => PAYMENTFORM_TYPE_OPTIONS.find((x) => x.value === item.payment_type)?.label,
      },
      {
        header: 'Công ty áp dụng',
        accessor: 'company_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Áp dụng tất cả miền',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',

        formatter: (p) =>
          p?.is_all_business ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
      },
      {
        header: 'Áp dụng tất cả cửa hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',

        formatter: (p) =>
          p?.is_all_store ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Có</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không</span>
          ),
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: PERMISSION_PAYMENT_FORM.ADD,
        onClick: () => window._$g.rdr(`/payment-form/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: PERMISSION_PAYMENT_FORM.EDIT,
        onClick: (p) => window._$g.rdr(`/payment-form/edit/${p?.payment_form_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PERMISSION_PAYMENT_FORM.VIEW,
        onClick: (p) => window._$g.rdr(`/payment-form/detail/${p?.payment_form_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: PERMISSION_PAYMENT_FORM.DEL,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deletePaymentForm([parseInt(_?.payment_form_id)]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deletePaymentForm(e?.map((val) => parseInt(val?.payment_form_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default PaymentFormTable;
