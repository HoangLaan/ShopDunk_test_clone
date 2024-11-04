import React, { useMemo } from 'react';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { useDispatch } from 'react-redux';
import { deleteCustomer } from 'services/customer-type.service';
import styled from 'styled-components';

const TypeCustomer = styled.span`
  background-color: ${(p) => p?.color ?? ''};
  color: ${(p) => (p?.noteColor ? p?.noteColor : 'black')};
`;

const CustomerTypeTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Tên hạng khách hàng',
        accessor: 'customer_type_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => (
          <TypeCustomer color={p?.color} className={p?.color ? 'bw_label' : ''} noteColor={p?.note_color}>
            {p?.customer_type_name}
          </TypeCustomer>
        ),
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'Miền áp dụng',
        classNameHeader: 'bw_text_center',
        accessor: 'business_name',
        formatter: (p) => (p?.business_id == -1 ? 'Tất cả' : p?.business_name),
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: ' bw_text_center',
        classNameBody: ' bw_text_center',
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
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'CRM_CUSTOMERTYPE_ADD',
        onClick: () => window._$g.rdr(`/customer-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'CRM_CUSTOMERTYPE_EDIT',
        onClick: (p) => {
          window._$g.rdr(`/customer-type/edit/${p?.customer_type_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'CRM_CUSTOMERTYPE_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/customer-type/detail/${p?.customer_type_id}`);
        },
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'CRM_CUSTOMERTYPE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteCustomer([_?.customer_type_id]);
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
              await deleteCustomer(e.map((o) => o.customer_type_id));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default CustomerTypeTable;
