import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteCustomerCareType } from 'services/customer-care-type.service';

const CustomerCareTypeTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên loại chăm sóc khách hàng',
        accessor: 'customer_care_type_name',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Thời gian định kì',
        accessor: '',
        classNameHeader: 'bw_sticky bw_name_sticky',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) =>
          p.is_filter_daily || p.is_filter_monthly
            ? p.is_filter_daily
              ? `${p.time_value} hàng ngày`
              : `${p.time_value} - ngày ${p.date_value} hàng ngày`
            : null,
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
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'CRM_CUSTOMERCARETYPE_ADD',
        onClick: () => window._$g.rdr(`/customer-care-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'CRM_CUSTOMERCARETYPE_EDIT',
        onClick: (p) => window._$g.rdr(`/customer-care-type/edit/${p?.customer_care_type_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'CRM_CUSTOMERCARETYPE_VIEW',
        onClick: (p) => window._$g.rdr(`/customer-care-type/detail/${p?.customer_care_type_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'CRM_CUSTOMERCARETYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteCustomerCareType([_?.customer_care_type_id]);
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
      totalItems={totalItems}
      onChangePage={onChangePage}
      handleBulkAction={(e) => {
        dispatch(
          showConfirmModal(
            ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
            async () => {
              await deleteCustomerCareType(e?.map((val) => parseInt(val?.customer_care_type_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default CustomerCareTypeTable;
