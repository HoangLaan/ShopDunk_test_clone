import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteReturnPolicy } from 'services/return-policy.service';

const ReturnPolicyTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Mã chính sách',
        accessor: 'return_policy_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Tên chính sách',
        accessor: 'return_policy_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
      },
      {
        header: 'Thời gian áp dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d) => d.start_date && `${d.start_date} ${d.end_date ? `- ${d.end_date}` : ''}`,
      },
      {
        header: 'Tỷ lệ thu phí',
        accessor: 'percent_value',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d) => d.percent_value ?? 0,
      },
      {
        header: 'Ngành hàng áp dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
        formatter: (d) => (d.is_apply_all_category ? 'Tất cả ngành hàng' : d.category_list),
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_left',
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

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới trả hàng',
        permission: 'PRO_RETURNPOLICY_ADD',
        onClick: () => {
          return window._$g.rdr(`/return-policy/add`);
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới đổi hàng',
        permission: 'PRO_RETURNPOLICY_ADD',
        onClick: () => {
          return window._$g.rdr(`/return-policy/add?r=1`);
        },
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'PRO_RETURNPOLICY_EDIT',
        onClick: (p) => window._$g.rdr(`/return-policy/edit/${p?.return_policy_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'PRO_RETURNPOLICY_VIEW',
        onClick: (p) => window._$g.rdr(`/return-policy/detail/${p?.return_policy_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'PRO_RETURNPOLICY_DEL',
        onClick: (d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteReturnPolicy([parseInt(d?.return_policy_id)]);
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
              await deleteReturnPolicy(e?.map((val) => parseInt(val?.return_policy_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default ReturnPolicyTable;
