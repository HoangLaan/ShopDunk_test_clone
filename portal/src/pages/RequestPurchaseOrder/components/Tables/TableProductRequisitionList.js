import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import { searchPurchaseRequisition } from 'services/request-purchase-order.service';

const COLUMN_ID = 'purchase_requisition_code';

const TableProductRequisitionList = ({ params, onChangePage }) => {
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
    searchPurchaseRequisition(params)
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
        header: 'Mã phiếu yêu cầu nhập hàng',
        formatter: (p) => <b className='bw_sticky bw_name_sticky'>{p?.[COLUMN_ID] ?? 'Chưa cập nhật'}</b>,
      },
      {
        header: 'Chi nhánh yêu cầu',
        accessor: 'business_request_name',
      },
      {
        header: 'Cửa hàng yêu cầu',
        accessor: 'store_request_name',
      },
      {
        header: 'Số lượng',
        accessor: 'quantity',
      },
      {
        header: 'ĐVT',
        accessor: 'unit_name',
      },
      {
        header: 'Ngày yêu cầu',
        accessor: 'purchase_requisition_date',
      },
    ];
  }, [params.page, params.itemsPerPage]);

  return (
    <DataTable
      fieldCheck={COLUMN_ID}
      loading={dataRows.loading}
      columns={columns}
      data={dataRows.items}
      totalPages={dataRows.totalPages}
      itemsPerPage={dataRows.itemsPerPage}
      page={dataRows.page}
      totalItems={dataRows.totalItems}
      onChangePage={onChangePage}
      noSelect={true}
    />
  );
};

export default TableProductRequisitionList;
