import DataTable from 'components/shared/DataTable/index';
import React, { useMemo } from 'react';

const Table = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Ngày đề xuất',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày hiệu lực',
        accessor: 'effective_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Loại đề xuất',
        accessor: 'proposal_type_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người đề xuất',
        accessor: 'created_user',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Phòng ban - Vị trí - Chức danh - Cấp bật mới được bổ nhiệm',
        accessor: 'content',
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
        content: 'Thêm Đề xuất',
        permission: 'HR_PROPOSAL_ADD',
        onClick: () => window._$g.rdr(`/proposal/add`),
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
      noSelect
      hiddenDeleteClick
    />
  );
};

export default Table;
