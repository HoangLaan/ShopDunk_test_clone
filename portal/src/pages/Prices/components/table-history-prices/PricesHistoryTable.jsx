import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import DataTable from 'components/shared/DataTable/index';
import { formatPrice } from 'utils/index';

dayjs.extend(customParseFormat);

const PricesHistoryTable = ({ data, totalPages, itemsPerPage, page, totalItems, onChangePage, loading }) => {
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p, idx) => <span>{idx + 1}</span>,
      },
      {
        header: 'Thời gian điều chỉnh',
        accessor: 'changes_date',

        formatter: (p, idx) => <span>{p?.changes_date}</span>,
      },
      {
        header: 'Hình thức xuất',
        formatter: (p) => <b>{p?.output_type_name}</b>,
      },
      {
        header: 'Khu vực',
        formatter: (p) => <span>{p?.area_name}</span>,
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.business_name}</span>,
      },

      {
        header: 'Ngày áp dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.apply_date}</span>,
      },
      {
        header: 'Người điều chỉnh',
        formatter: (p) => <span>{p?.full_name}</span>,
      },
      {
        header: 'Giá bán cũ',
        formatter: (p) => <span>{formatPrice(p?.history_price, true, ',')}</span>,
      },
      {
        header: 'Giá điều chỉnh',
        formatter: (p) => <span>{formatPrice(p?.price_vat, true, ',')}</span>,
      },
      {
        header: 'Người duyệt',
        formatter: (p) => <span>{p?.review_user_fullname}</span>,
      },
    ],
    [],
  );

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        data={data}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        loading={loading}
        hiddenDeleteClick={true}
        noSelect={true}
      />
    </React.Fragment>
  );
};

export default PricesHistoryTable;
