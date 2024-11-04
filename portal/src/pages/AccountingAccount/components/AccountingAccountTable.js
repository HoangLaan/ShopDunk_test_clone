import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteAccountingAccount, getListAccountingAccount } from 'services/accounting-account.service';
import { PERMISSION_ACCOUNTING_ACCOUNT, propertys } from '../utils/constants';

const AccountingAccountTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  exportExcel,
  importExcel,
  params,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Mã tài khoản',
        accessor: 'accounting_account_code',
        classNameHeader: 'bw_sticky bw_name_sticky',
        expanded: true,
      },
      {
        header: 'Tên tài khoản',
        accessor: 'accounting_account_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tính chất',
        accessor: 'property',
        classNameHeader: 'bw_text_center',
        formatter: (p) => propertys.find((x) => x.value === p.property)?.label,
      },
      {
        header: 'Diễn giải',
        accessor: 'description',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Công ty áp dụng',
        accessor: 'company_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        accessor: 'full_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'create_date',
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
        icon: 'fi fi-rr-inbox-out',
        type: 'success',
        content: 'Xuất excel',
        outline: true,
        permission: PERMISSION_ACCOUNTING_ACCOUNT.EXPORT,
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-in',
        type: 'success',
        outline: true,
        content: 'Nhập excel',
        permission: PERMISSION_ACCOUNTING_ACCOUNT.IMPORT,
        onClick: () => importExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: PERMISSION_ACCOUNTING_ACCOUNT.ADD,
        onClick: () => window._$g.rdr(`/accounting-account/add`),
      },

      {
        icon: 'fi fi-rr-copy',
        color: 'green',
        title: 'Copy',
        permission: PERMISSION_ACCOUNTING_ACCOUNT.COPY,
        onClick: (p) => window._$g.rdr(`/accounting-account/copy/${p?.accounting_account_id}`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        title: 'Sửa',
        permission: PERMISSION_ACCOUNTING_ACCOUNT.EDIT,
        onClick: (p) => window._$g.rdr(`/accounting-account/edit/${p?.accounting_account_id}`),
      },
      // {
      //   icon: 'fi fi-rr-eye',
      //   color: 'green',
      //   permission: PERMISSION_ACCOUNTING_ACCOUNT.VIEW,
      //   onClick: (p) => window._$g.rdr(`/accounting-account/detail/${p?.accounting_account_id}`),
      // },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permission: PERMISSION_ACCOUNTING_ACCOUNT.DEL,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteAccountingAccount([_?.accounting_account_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <DataTable
      loading={loading}
      columns={columns}
      data={data}
      actions={actions}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      getChildren={async (query) => {
        return getListAccountingAccount({ ...params, ...query, itemsPerPage: 100 });
      }}
      parentField={'accounting_account_id'}
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteAccountingAccount(e?.map((val) => parseInt(val?.accounting_account_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default AccountingAccountTable;
