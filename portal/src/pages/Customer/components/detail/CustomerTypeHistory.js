import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getListHistoryCustomerType } from 'services/customer.service';
import DataTable from 'components/shared/DataTable/index';
import BWAccordion from 'components/shared/BWAccordion/index';

const CustomerTypeHistory = () => {
  const { account_id } = useParams();
  const [customerTypeHistory, setCustomerTypeHistory] = useState([]);

  const loadCustomerTypeHistory = useCallback(() => {
    if (account_id) {
      getListHistoryCustomerType(account_id).then((value) => setCustomerTypeHistory(value?.dataHistoryList));
    }
  }, [account_id]);
  useEffect(loadCustomerTypeHistory, [loadCustomerTypeHistory]);

  const columns = useMemo(
    () => [
      {
        header: 'Ngày cập nhật',
        accessor: 'start_date',
      },
      {
        header: 'Hạng cũ',
        formatter: (p) => <p>{p?.customer_type_name_from ?? 'Chưa có'}</p>,
      },
      {
        header: 'Hạng mới',
        formatter: (p) => <p>{p?.customer_type_name_to}</p>,
      },
      {
        header: 'Trạng thái',
        accessor: 'status',
        formatter: (p) =>
          Boolean(p?.status_customer_type) ? (
            <span className='bw_badge bw_badge_success'>Thăng hạng</span>
          ) : (
            <span className='bw_badge bw_badge_danger'>Giảm hạng</span>
          ),
      },
      {
        header: 'Ghi chú',
        accessor: 'description',
      },
    ],
    [],
  );

  return (
    <BWAccordion title='Lịch sử chuyển đổi loại khách hàng'>
      <DataTable noSelect columns={columns} data={customerTypeHistory} noPaging />
    </BWAccordion>
  );
};

export default CustomerTypeHistory;
