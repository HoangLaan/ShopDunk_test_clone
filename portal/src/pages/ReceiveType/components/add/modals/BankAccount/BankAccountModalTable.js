import React, { useMemo } from 'react';

import DataTable from 'components/shared/DataTable/index';

const MAX_COLUMN_IN_PAGE = 10;

function BankAccountModalTable({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, selectChoose, setSelectChoose }) {
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        formatter: (_, index) => index + 1 + (MAX_COLUMN_IN_PAGE * (parseInt(page) - 1)),
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'STK',
        classNameHeader: 'bw_text_center',
        formatter: (d) => {
          return `${d.bank_number} - ${d.bank_account_name}`;
        },
      },
      {
        header: 'Ngân hàng',
        classNameHeader: 'bw_text_center',
        formatter: (d) => {
          return (
            <div className='bw_inf_pro'>
              <img
                alt=''
                src={/[/.](gif|jpg|jpeg|tiff|png)$/i.test(d?.bank_logo) ? d.bank_logo : 'bw_image/logo.png'}
              />
              {d?.bank_name}
            </div>
          );
        },
      },
      {
        header: 'Mô tả',
        accessor: 'description',
        classNameHeader: 'bw_text_center',
      },
    ],
    [page],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      onChangeSelect={(dataSelect) => {
        setSelectChoose(dataSelect)
      }}
      defaultDataSelect={selectChoose}
      hiddenDeleteClick
    />
  );
}

export default BankAccountModalTable;
