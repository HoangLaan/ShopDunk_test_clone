import React, { Fragment, useMemo } from 'react';

import DataTable from 'components/shared/DataTable/index';
import { useBankUserContext } from 'pages/BankUser/utils/context';
import usePagination from 'hooks/usePagination';

const TableImportError = () => {
  const { importErrors } = useBankUserContext();
  const { rows, itemsPerPage, page, onChangePage, totalPages, totalItems } = usePagination({ data: importErrors });

  const columns = useMemo(
    () => [
      {
        header: 'Lỗi',
        accessor: 'error_message',
      },
      {
        header: 'Số tài khoản',
        accessor: 'bank_number',
      },
      {
        header: 'Chủ tài khoản',
        accessor: 'bank_username',
      },
      {
        header: 'Mã ngân hàng',
        accessor: 'bank_id',
      },
      {
        header: 'Chi nhánh',
        accessor: 'bank_branch',
      },
      {
        header: 'Địa chỉ',
        accessor: 'branch_address',
      },
    ],
    [],
  );

  return (
    <Fragment>
      <DataTable
        noSelect={true}
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
