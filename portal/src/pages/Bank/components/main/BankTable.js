import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deleteBank } from 'services/bank.service';
import DataTable from 'components/shared/DataTable/index';
import BWImage from 'components/shared/BWImage/index';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton';

const BankTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Logo',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <div className='bw_inf_pro' style={{ display: 'flex', justifyContent: 'center' }}>
            <BWImage src={p?.bank_logo} alt={p?.bank_name} className='' />
          </div>
        ),
      },
      {
        header: 'Tên viết tắt',
        accessor: 'bank_code',
        classNameHeader: 'bw_text_center',
        formatter: (p) => 
          <CheckAccess permission={'MD_BANK_EDIT'} >
            <div style={{cursor: 'pointer'}} onClick={() => window._$g.rdr(`/bank/edit/${p?.bank_id}`)}>{p.bank_code}</div>
          </CheckAccess>
      },
      {
        header: 'Tên đầy đủ',
        accessor: 'bank_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => 
        <CheckAccess permission={'MD_BANK_EDIT'} >
          <div style={{cursor: 'pointer'}} onClick={() => window._$g.rdr(`/bank/edit/${p?.bank_id}`)}>{p.bank_name}</div>
        </CheckAccess>
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
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
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
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
        permission: 'MD_BANK_ADD',
        onClick: () => window._$g.rdr(`/bank/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        title: 'Sửa',
        permission: 'MD_BANK_EDIT',
        onClick: (p) => window._$g.rdr(`/bank/edit/${p?.bank_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        title: 'Chi tiết',
        permission: 'MD_BANK_VIEW',
        onClick: (p) => window._$g.rdr(`/bank/detail/${p?.bank_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permission: 'MD_BANK_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteBank([_?.bank_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <DataTable
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
              await deleteBank(e?.map((_) => _?.bank_id));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default BankTable;
