import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import TooltipHanlde from 'components/shared/TooltipWrapper';
import DataTable from 'components/shared/DataTable/index';
import { showConfirmModal } from 'actions/global';
import { msgError } from 'pages/OutputType/helpers/msgError';
import styled from 'styled-components';

dayjs.extend(customParseFormat);

const DescriptionWrapper = styled.div`
  display: -webkit-box;
  white-space: normal;
  max-width: 400px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BudgetTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  loading,
  exportExcel,
  importExcel,
  getChildren,
}) => {
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
        header: 'Phân loại',
        classNameHeader: 'bw_text_center',
        accessor: 'budget_type_code',
      },
      {
        header: 'Mã ngân sách',
        classNameHeader: 'bw_text_center',
        accessor: 'budget_code',
        expanded: true,
      },
      {
        header: 'Tên ngân sách viết tắt',
        classNameHeader: 'bw_text_center',
        accessor: 'short_name',
      },
      {
        header: 'Tên ngân sách đầy đủ',
        classNameHeader: 'bw_text_center',
        accessor: 'budget_name',
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        accessor: 'description',
        formatter: (p) => <TooltipHanlde>{p?.description}</TooltipHanlde>,
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
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
        permission: 'FI_BUDGET_EXPORT',
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-in',
        type: 'success',
        outline: true,
        content: 'Import',
        permission: 'FI_BUDGET_IMPORT',
        onClick: () => importExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-add',
        type: 'success',
        content: 'Thêm mới',
        permission: 'FI_BUDGET_ADD',
        onClick: () => window._$g.rdr(`/budget/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        title: 'Sửa',
        permission: 'FI_BUDGET_EDIT',
        onClick: (p) => window._$g.rdr(`/budget/edit/${p?.budget_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        title: 'Chi tiết',
        permission: 'FI_BUDGET_VIEW',
        onClick: (p) => window._$g.rdr(`/budget/detail/${p?.budget_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permission: 'FI_BUDGET_DEL',
        onClick: (budget) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete([budget?.budget_id]);
            }),
          ),
      },
    ];
  }, [dispatch, handleDelete]);

  const handleBulkAction = (items, action) => {
    let list_id = items.map((budget) => budget.budget_id);
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
      parentField='budget_id'
    />
  );
};

export default BudgetTable;
