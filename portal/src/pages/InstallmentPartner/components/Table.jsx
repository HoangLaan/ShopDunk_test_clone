import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteList } from 'services/installment-partner.service';
import DataTable from 'components/shared/DataTable/index';
import { PAYMENT_TYPE } from '../utils/constant';

const InstallmentTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky bw_text_center',
        formatter: (_, index) => <span className='bw_text_wrap'>{index + 1}</span>,
      },
      {
        header: 'Mã đối tác',
        classNameHeader: 'bw_text_center',
        accessor: 'installment_partner_code',
      },
      {
        header: 'Tên đối tác',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'installment_partner_name',
        formatter: (item) => (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {item.installment_partner_logo ? (
              <img
                style={{ width: '40px', height: '40px', borderRadius: '4px', boder: '1px solid #ccc' }}
                src={item.installment_partner_logo}
              />
            ) : null}
            <span>{item.installment_partner_name}</span>
          </div>
        ),
      },
      {
        header: 'Thanh toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => (
          <span className='bw_text_wrap'>{_?.payment_type === PAYMENT_TYPE.FIXED ? 'Cố định' : 'Linh động'}</span>
        ),
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span class='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span class='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const handleDelete = useCallback(
    async (params) => {
      await deleteList(params);
      onRefresh();
    },
    [onRefresh],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'SL_INSTALLMENTPARTNER_ADD',
        onClick: () => window._$g.rdr(`/installment-partner/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SL_INSTALLMENTPARTNER_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/installment-partner/edit/${p?.installment_partner_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SL_INSTALLMENTPARTNER_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/installment-partner/detail/${p?.installment_partner_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SL_INSTALLMENTPARTNER_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete([_.installment_partner_id]),
            ),
          ),
      },
    ];
  }, [dispatch, handleDelete]);

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
      handleBulkAction={(e) =>
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteList(e?.map((item) => item.installment_partner_id));
              onRefresh();
            },
          ),
        )
      }
    />
  );
};

export default InstallmentTable;
