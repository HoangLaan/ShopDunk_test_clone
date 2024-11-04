import BWAccordion from 'components/shared/BWAccordion';
import DataTable from 'components/shared/DataTable';
import usePagination from 'hooks/usePagination';
import { getListOrders } from 'pages/Orders/helpers/call-api';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatPrice } from 'utils';

function CustomerOrder() {
  const { facebookUser } = useSelector((state) => state.scfacebook);
  const userPhoneNumber = facebookUser?.info?.phone_number;

  const [orders, setOrders] = useState([]);

  const orderPagination = usePagination({ data: orders });

  useEffect(() => {
    const getOrders = async () => {
      const res = await getListOrders({ search: userPhoneNumber });
      setOrders(res?.items || []);
    };
    if (userPhoneNumber) {
      getOrders();
    }
  }, [userPhoneNumber]);

  const orderColumns = [
    {
      header: 'STT',
      formatter: (row, index) => row?.dataIndex + 1,
    },
    {
      header: 'Mã đơn hàng',
      accessor: 'order_no',
    },
    {
      header: 'Ngày mua',
      accessor: 'created_date',
    },
    {
      header: 'Trạng thái',
      accessor: 'payment_status_name',
    },
    {
      header: 'Tổng tiền mua',
      accessor: 'total_money',
    },
  ];

  const customSumRow = [
    {
      index: 1,
      value: 'Tổng',
      colSpan: 4,
    },
    {
      index: 5,
      formatter: (items) => formatPrice(items?.reduce((acc, item) => acc + item.total_money ?? 0, 0) || 0, false, ','),
    },
  ];

  return (
    <BWAccordion title={`Đơn hàng đã mua (${orderPagination.totalItems})`}>
      <DataTable
        hiddenActionRow
        noSelect={true}
        noActions={true}
        columns={orderColumns}
        key={orderPagination.page}
        data={orderPagination.rows}
        totalPages={orderPagination.totalPages}
        itemsPerPage={orderPagination.itemsPerPage}
        page={orderPagination.page}
        totalItems={orderPagination.totalItems}
        onChangePage={orderPagination.onChangePage}
        customSumRow={customSumRow}
      />
    </BWAccordion>
  );
}

export default CustomerOrder;
