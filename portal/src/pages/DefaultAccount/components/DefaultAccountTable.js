import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteDefaultAccount } from 'services/default-account.service';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton/index';

const DefaultAccountTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  exportExcel,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        formatter: (_, i) => i + 1,
      },
      {
        header: 'Tên định khoản',
        accessor: 'ac_default_account_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (d) => {
          return (
            <CheckAccess permission={'AC_DEFAULTACCOUNT_EDIT'}>
              <BWButton
                onClick={() => window._$g.rdr(`/default-account/edit/${d?.ac_default_account_id}`)}
                type={'blue'}
                content={d.ac_default_account_name}
              />
            </CheckAccess>
          );
        },
      },
      {
        header: 'TK Nợ',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (data) => {
          return data.debt?.length > 0 && data.debt.map((de) => <p>{de.accounting_account_code}</p>);
        },
      },
      {
        header: 'TK Có',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (data) => {
          return data.credit?.length > 0 && data.credit.map((de) => <p>{de.accounting_account_code}</p>);
        },
      },
      {
        header: 'Loại chứng từ',
        accessor: 'document_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
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
        hidden: data.length === 0,
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'success',
        content: 'Xuất excel',
        outline: true,
        permission: 'AC_DEFAULTACCOUNT_EXPORT',
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'AC_DEFAULTACCOUNT_ADD',
        onClick: () => window._$g.rdr(`/default-account/add`),
      },

      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'AC_DEFAULTACCOUNT_EDIT',
        onClick: (p) => window._$g.rdr(`/default-account/edit/${p?.ac_default_account_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'AC_DEFAULTACCOUNT_VIEW',
        onClick: (p) => window._$g.rdr(`/default-account/detail/${p?.ac_default_account_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'AC_DEFAULTACCOUNT_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteDefaultAccount([_?.ac_default_account_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh, data]);

  return (
    <DataTable
      noSelect={false}
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
              await deleteDefaultAccount(e?.map((val) => parseInt(val?.ac_default_account_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default DefaultAccountTable;
