import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import { deleteExpendType } from 'services/expend-type.service';
import { PERMISSION_EXPEND_TYPE } from 'pages/ExpendType/utils/constants';
import { getExpendTypeList } from 'services/expend-type.service';

const ExpendTypeTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  loading,
  params,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Mã loại chi',
        accessor: 'expend_type_code',
        classNameHeader: 'bw_text_center',
        expanded: true,
      },
      {
        header: 'Tên loại chi',
        // accessor: 'expend_type_name',
        classNameHeader: 'bw_text_center',
        formatter: (value) =>
          value?.expend_type_name?.length > 50
            ? value?.expend_type_name?.substring(0, 50) + '...'
            : value?.expend_type_name,
      },
      {
        header: ' Loại chi cha',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (item) => item.parent_name,
      },
      // {
      //   header: 'Mô tả',
      //   classNameHeader: 'bw_text_center',
      //   formatter: (value) =>
      //     value.description?.length > 20 ? value.description?.substring(0, 20) + '...' : value.description,
      // },
      {
        header: 'Chi nhánh',
        classNameHeader: 'bw_text_center',
        formatter: (value) =>
          value.business_name?.length > 50 ? value.business_name?.substring(0, 50) + '...' : value.business_name,
      },
      {
        header: 'Công ty áp dụng',
        // accessor: 'company_name',
        classNameHeader: 'bw_text_center',
        formatter: (value) =>
          value?.company_name?.length > 50 ? value?.company_name?.substring(0, 50) + '...' : value?.company_name,
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
        permission: PERMISSION_EXPEND_TYPE.ADD,
        onClick: () => window._$g.rdr(`/expend-type/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: PERMISSION_EXPEND_TYPE.EDIT,
        onClick: (p) => window._$g.rdr(`/expend-type/edit/${p?.expend_type_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PERMISSION_EXPEND_TYPE.VIEW,
        onClick: (p) => window._$g.rdr(`/expend-type/view/${p?.expend_type_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: PERMISSION_EXPEND_TYPE.DEL,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteExpendType([_?.expend_type_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  return (
    <DataTable
      parentField='expend_type_id'
      getChildren={async (query) => {
        return getExpendTypeList({ ...params, ...query, itemsPerPage: 100 });
      }}
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
              await deleteExpendType(e?.map((o) => o?.expend_type_id));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default ExpendTypeTable;
