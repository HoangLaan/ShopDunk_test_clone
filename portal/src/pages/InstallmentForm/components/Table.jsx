import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteList } from 'services/installment-form.service';
import DataTable from 'components/shared/DataTable/index';
import { Image } from 'antd';

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
        header: 'Hình thức trả góp',
        classNameHeader: 'bw_text_center',
        accessor: 'installment_form_name',
      },
      {
        header: 'Đối tác',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'installment_partner_name',
        formatter: (item) => {
          return (
            <div style={{ display: 'flex', gap: '2px' }}>
              {item.installment_partner_logo ? <Image width={40} src={item.installment_partner_logo} /> : null}
              <div>{item?.installment_partner_name}</div>
            </div>
          );
        },
      },
      {
        header: 'Hình thức',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_user',
        formatter: (item) => {
          return <span>{item.is_credit_card ? 'Trả góp qua thẻ' : 'Trả góp qua công ty tài chính'}</span>;
        },
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Kích hoạt',
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
        permission: 'SL_INSTALLMENTFORM_ADD',
        onClick: () => window._$g.rdr(`/installment-form/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SL_INSTALLMENTFORM_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/installment-form/edit/${p?.installment_form_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SL_INSTALLMENTFORM_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/installment-form/detail/${p?.installment_form_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SL_INSTALLMENTFORM_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete([_.installment_form_id]),
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
              await deleteList(e?.map((item) => item.installment_form_id));
              onRefresh();
            },
          ),
        )
      }
    />
  );
};

export default InstallmentTable;
