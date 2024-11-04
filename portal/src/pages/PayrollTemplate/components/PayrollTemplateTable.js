import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import { deletePayrollTemplate } from 'services/payroll-template.service';
import { splitString } from 'utils';

const PayrollTemplateTable = ({
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
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, index) => index + 1,
      },
      {
        header: 'Tên mẫu bảng lương',
        accessor: 'template_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        formatter: (d) => splitString(d.description, 80),
      },
      {
        header: 'Người tạo',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
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
        permission: 'SA_PAYROLLTEMPLATE_ADD',
        onClick: () => window._$g.rdr(`/payroll-template/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SA_PAYROLLTEMPLATE_EDIT',
        onClick: (p) => window._$g.rdr(`/payroll-template/edit/${p?.template_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SA_PAYROLLTEMPLATE_VIEW',
        onClick: (p) => window._$g.rdr(`/payroll-template/detail/${p?.template_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'SA_PAYROLLTEMPLATE_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deletePayrollTemplate([parseInt(_?.template_id)]);
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
              await deletePayrollTemplate(e?.map((val) => parseInt(val?.template_id)));
              onRefresh();
            },
          ),
        );
      }}
    />
  );
};

export default PayrollTemplateTable;
