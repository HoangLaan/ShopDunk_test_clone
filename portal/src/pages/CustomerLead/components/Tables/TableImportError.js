import React, { Fragment, useMemo } from 'react';
import classNames from 'classnames';

import DataTable from 'components/shared/DataTable/index';
import { useCustomerLeadContext } from 'pages/CustomerLead/utils/context';
import usePagination from 'hooks/usePagination';

const TableImportError = () => {
  const { importErrors } = useCustomerLeadContext();
  const { rows, itemsPerPage, page, onChangePage, totalPages, totalItems } = usePagination({ data: importErrors });

  const columns = useMemo(
    () => [
      {
        header: 'Lỗi',
        accessor: 'error_message',
      },
      {
        header: 'Tên khách hàng tiềm năng',
        accessor: 'full_name',
      },
      {
        header: 'Giới tính',
        formatter: p => p?.gender === 1 ? 'Nam' : 'Nữ',
      },
      {
        header: 'Ngày sinh',
        accessor: 'birthday',
      },
      {
        header: 'Số điện thoại',
        accessor: 'phone_number',
      },
      {
        header: 'Email',
        accessor: 'email',
      },
      {
        header: 'Kích hoạt',
        accessor: 'is_active',
        formatter: (p) => (
          <span
            className={classNames('bw_label_outline bw_label_outline_success text-center', {
              success: p?.is_active,
              danger: !p?.is_active,
            })}>
            {p?.is_active ? 'Kích hoạt' : 'Ẩn'}
          </span>
        ),
      },
    ],
    [],
  );

  const title = (
    <div className='bw_count_cus'>
      <img src='bw_image/icon/i__cus_home.svg' alt='2' />
      Tổng số lỗi: {totalItems}
    </div>
  );

  return (
    <Fragment>
      <DataTable
        noSelect={true}
        title={title}
        columns={columns}
        data={rows}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
      />
    </Fragment>
  );
};

export default TableImportError;
