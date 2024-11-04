import DataTable from 'components/shared/DataTable/index';
import CheckAccess from 'navigation/CheckAccess';
import React, { useMemo } from 'react';

const TableBusUser = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleActionRow,
  handleBulkAction,
}) => {
  const columns = useMemo(
    () => [
      {
        header: 'Tên nhân viên',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (p) => (
          <b className='bw_sticky bw_name_sticky'>
            {p?.user_name} - {' ' + p?.full_name}
          </b>
        ),
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_name',
        formatter: (item, index) => {
          return (
            <CheckAccess permission={'MD_STORE_VIEW'}>
              <p style={{ cursor: 'pointer' }} onClick={() => window._$g.rdr(`/store/detail/${item.store_id}`)}>
                {item.store_name}
              </p>
            </CheckAccess>
          );
        },
      },
      {
        header: 'Cụm',
        classNameHeader: 'bw_text_center',
        accessor: 'cluster_name',
      },
      {
        header: 'Chức vụ',
        classNameHeader: 'bw_text_center',
        accessor: 'position_name',
      },
      {
        header: 'Công ty',
        classNameHeader: 'bw_text_center',
        accessor: 'company_name',
      },
      {
        header: 'Phòng ban',
        classNameHeader: 'bw_text_center',
        accessor: 'department_name',
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
        content: 'Phân nhân viên cửa hàng',
        onClick: (p) => handleActionRow(null, 'add'),
        permission: 'SYS_BUSINESS_USER_ADD',
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        onClick: (p) => handleActionRow(p, 'delete'),
        permission: 'SYS_BUSINESS_USER_DELETE',
      },
    ];
  }, []);

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
      handleBulkAction={handleBulkAction}
    />
  );
};

export default TableBusUser;
