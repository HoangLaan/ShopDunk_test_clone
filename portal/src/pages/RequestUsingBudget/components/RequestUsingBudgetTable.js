import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { deleteRequestUsingBudget } from 'services/request-using-budget.service';
import { StyledTable } from '../utils/style';
import ActionTablePage from './ActionTablePage';
import { PERMISSION, VOTE_STATUS } from '../utils/constants';

const RequestUsingBudgetTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  onChange,
  total,
  exportExcel,
  importExcel,
  printPdf,
}) => {
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_text_center ',
        classNameBody: 'bw_sticky bw_text_center',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Mã phiếu',
        accessor: 'request_using_budget_code',
        classNameHeader: 'bw_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_text_center',
      },
      {
        header: 'Người đề nghị',
        accessor: 'full_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Phòng ban đề nghị',
        accessor: 'department_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tổng tiền đề nghị',
        accessor: 'total_requset_budget',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Công ty áp dụng',
        accessor: 'company_name',
        classNameHeader: 'bw_text_center',
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
        formatter: (item) => VOTE_STATUS.find((x) => x.value === item.is_review)?.label,
      },
      {
        header: 'Kích hoạt',
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
        icon: 'fi fi-rr-check',
        color: 'blue',
        permission: PERMISSION.REVIEW,
        hidden: (p) => p?.is_show_review === 0,
        onClick: (p) => window._$g.rdr(`/request-using-budget/review/${p?.request_using_budget_id}`),
      },
      {
        icon: 'fa fa-files-o',
        color: 'ogrance',
        permission: PERMISSION.COPY,
        onClick: (p) => window._$g.rdr(`/request-using-budget/copy/${p?.request_using_budget_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/request-using-budget/detail/${p?.request_using_budget_id}`),
      },
      {
        icon: 'fi fi-rr-print',
        permission: PERMISSION.PRINT,
        onClick: (p) => printPdf?.(p?.request_using_budget_id),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: PERMISSION.EDIT,
        hidden: (p) => p?.is_review === 0 || p?.is_review === 1,
        onClick: (p) => window._$g.rdr(`/request-using-budget/edit/${p?.request_using_budget_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: PERMISSION.DEL,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteRequestUsingBudget([_?.request_using_budget_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  const btn_filter = useMemo(
    () => [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/request-using-budget/add`),
      },
      {
        globalAction: true,
        icon: 'fa fa-download',
        type: 'outline',
        content: 'Nhập excel',
        permission: PERMISSION.IMPORT,
        onClick: () => importExcel?.(),
      },
      {
        globalAction: true,
        icon: 'fa fa-upload',
        type: 'outline',
        content: 'Xuất excel',
        permission: PERMISSION.EXPORT,
        onClick: () => exportExcel?.(),
      },
      {
        type: 'warning',
        content: `Chưa duyệt (${
          (total?.total_item || 0) - (total?.total_browsed || 0) - (total?.total_not_browse || 0)
        })`,
        onClick: () => onChange({ is_review: 2 }),
      },
      {
        type: 'success',
        content: `Đã duyệt (${total?.total_browsed || 0})`,
        onClick: () => onChange({ is_review: 1 }),
      },
      {
        type: 'red',
        content: `Không duyệt (${total?.total_not_browse || 0})`,
        onClick: () => onChange({ is_review: 0 }),
      },
      {
        type: 'outline',
        content: `Tất cả (${total?.total_item || 0})`,
        onClick: () => onChange({ is_review: null }),
      },
    ],
    [onChange, total],
  );
  return (
    <StyledTable>
      <ActionTablePage actions={btn_filter}></ActionTablePage>
      <DataTable
        loading={loading}
        columns={columns}
        data={data}
        actions={actions.filter((x) => !x.globalAction)}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        noSelect
        onChangePage={onChangePage}
        // handleBulkAction={(e) => {
        //   dispatch(
        //     showConfirmModal(
        //       ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
        //       async () => {
        //         await deleteSuggestUsingBudget(e?.map((val) => parseInt(val?.request_using_budget_id)));
        //         onRefresh();
        //       },
        //     ),
        //   );
        // }}
      />
    </StyledTable>
  );
};

export default RequestUsingBudgetTable;
