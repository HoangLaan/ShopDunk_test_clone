import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

import DataTable from 'components/shared/DataTable/index';
import { showConfirmModal } from 'actions/global';
import { msgError } from 'pages/OutputType/helpers/msgError';

dayjs.extend(customParseFormat);

const ItemTable = ({
  data,
  totalPages,
  getChildren,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  loading,
  exportExcel,
  importExcel,
}) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'Mã khoản mục',
        classNameHeader: 'bw_text_center',
        accessor: 'item_code',
        expanded: true,
      },
      {
        header: 'Tên khoản mục',
        classNameHeader: 'bw_text_center',
        accessor: 'item_name',
      },
      {
        header: 'Công ty áp dụng',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Lập ngân sách',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'is_budget_creation',
        formatter: (item) => (item?.is_budget_creation ? 'Có' : 'Không'),
      },
      {
        header: 'Điều chỉnh ngân sách',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'is_budget_adjustment',
        formatter: (item) => (item?.is_budget_adjustment ? 'Có' : 'Không'),
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'is_active',
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
        icon: 'fi fi-rr-inbox-out mr-2',
        type: 'success',
        outline: true,
        content: 'Xuất excel',
        permission: 'CRM_ACCOUNT_EXPORT',
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-in',
        type: 'success',
        outline: true,
        content: 'Import',
        onClick: () => importExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'FI_ITEM_ADD',
        onClick: () => window._$g.rdr(`/item/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'FI_ITEM_EDIT',
        onClick: (p) => window._$g.rdr(`/item/edit/${p?.item_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'FI_ITEM_VIEW',
        onClick: (p) => window._$g.rdr(`/item/detail/${p?.item_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'FI_ITEM_DEL',
        onClick: (item) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete([item?.item_id]);
            }),
          ),
      },
    ];
  }, [dispatch, handleDelete]);

  const handleBulkAction = (items, action) => {
    let list_id = items.map((item) => item.item_id);
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(list_id),
        ),
      );
    }
  };

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
      loading={loading}
      handleBulkAction={handleBulkAction}
      getChildren={getChildren}
      parentField={'item_id'}
    />
  );
};

export default ItemTable;
