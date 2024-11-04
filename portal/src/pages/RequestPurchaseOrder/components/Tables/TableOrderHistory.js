import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable';
import { getOrderHistory } from 'services/request-purchase-order.service';
import { formatPrice, formatVND } from 'utils';
import { formatQuantity } from 'utils/number';

const TableOrderHistory = ({ params, onChange }) => {
  const [dataRows, setDataRows] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
  });

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    getOrderHistory(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(loadData, [loadData]);

  const columns = useMemo(() => {
    const startPageIndex = (params.page - 1) * params.itemsPerPage + 1;

    return [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_check_sticky bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_, idx) => <b className='bw_sticky bw_name_sticky'>{idx + startPageIndex}</b>,
      },
      {
        header: 'Đơn hàng',
        accessor: 'order_no',
      },
      {
        header: 'Imei',
        accessor: 'imei_code',
      },
      {
        header: 'Cửa hàng',
        accessor: 'store_name',
      },
      {
        header: 'Chi nhánh',
        accessor: 'business_name',
      },
      {
        header: 'Ngày bán',
        accessor: 'order_date',
      },
      {
        header: 'Số lượng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (d) => formatQuantity(d.quantity),
      },
      {
        header: 'Giá bán (đ)',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (d) => formatQuantity(d.price),
      },
      {
        header: 'Thành tiền (đ)',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_right',
        formatter: (d) => formatQuantity(d.total_price),
      },
    ];
  }, [params.page, params.itemsPerPage]);

  return (
    <DataTable
      hiddenActionRow={true}
      hiddenDeleteClick={true}
      noSelect={true}
      loading={dataRows.loading}
      columns={columns}
      data={dataRows.items}
      totalPages={dataRows.totalPages}
      itemsPerPage={dataRows.itemsPerPage}
      page={dataRows.page}
      totalItems={dataRows.totalItems}
      onChangePage={(page) => onChange({ page })}
    />
  );
};

export default TableOrderHistory;
