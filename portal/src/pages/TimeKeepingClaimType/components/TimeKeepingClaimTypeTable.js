import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTimeKeepingClaimType } from 'services/time-keeping-claim-type.service';

const TimeKeepingClaimTypeTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên loại giải trình',
        classNameHeader: ' bw_text_center',
        formatter: (d) => <b>{d.time_keeping_claim_type_name}</b>,
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'Khối áp dụng',
        classNameHeader: 'bw_text_center',
        formatter: (d) => {
          return d.blocks.map((block) => <p>{block}</p>);
        },

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
        onClick: () => window._$g.rdr(`/time-keeping-claim-type/add`),
        permission: 'HR_TIMEKEEPINGCLAIMTYPE_ADD',
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        onClick: (p) => {
          window._$g.rdr(`/time-keeping-claim-type/edit/${p?.time_keeping_claim_type_id}`);
        },
        permission: 'HR_TIMEKEEPINGCLAIMTYPE_EDIT',
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        onClick: (p) => window._$g.rdr(`/time-keeping-claim-type/detail/${p?.time_keeping_claim_type_id}`),
        permission: 'HR_TIMEKEEPINGCLAIMTYPE_VIEW',
      },
      {
        icon: 'fi fi-rr-trash',
        permission: 'HR_TIMEKEEPINGCLAIMTYPE_DEL',
        color: 'red',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteTimeKeepingClaimType(p?.time_keeping_claim_type_id);
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
              await deleteTimeKeepingClaimType(e.map((o) => o.time_keeping_claim_type_id)?.join(","));

              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default TimeKeepingClaimTypeTable;
