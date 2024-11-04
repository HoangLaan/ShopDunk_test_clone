import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { getListHistoryCustomerRepair } from 'services/customer.service';
import { useParams } from 'react-router-dom';
import DataTable from 'components/shared/DataTable/index';
import { formatPrice } from 'utils/index';
import moneyIcon from 'assets/bw_image//icon/i__money.svg';

const WarrantyRepairHistory = () => {
  const { account_id } = useParams();
  const [params, setParams] = useState({
    is_active: 1,
    page: 1,
    itemsPerPage: 25,
  });
  const [customerRepairHistory, setCustomerRepairHistory] = useState({
    items: [],
    itemsPerPage: 25,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  });

  const loadCustomerTypeHistory = useCallback(() => {
    if (account_id)
      getListHistoryCustomerRepair(account_id, params).then((value) => {
        setCustomerRepairHistory(value);
      });
  }, [account_id, params]);
  useEffect(loadCustomerTypeHistory, [loadCustomerTypeHistory]);

  const columns = useMemo(
    () => [
      {
        header: 'Ngày tiếp nhận',
        formatter: (p) => <div className={p?.over_due ? 'bw_red' : ''}>{p?.day_reception}</div>,
      },
      {
        header: 'Người tiếp nhận',
        formatter: (p) => <div className={p?.over_due ? 'bw_red' : ''}>{p?.cool_dinator_name}</div>,
      },
      {
        header: 'Hình thức bảo hành',
        formatter: (p) => <div className={p?.over_due ? 'bw_red' : ''}>{p?.request_type_name}</div>,
      },
      {
        header: 'Mã phiếu',
        accessor: 'request_id',
        formatter: (p) => <div className={p?.over_due ? 'bw_red' : ''}>{p?.request_id}</div>,
      },
      {
        header: 'Trạng thái bảo hành/sửa chữa',
        accessor: 'process_step_name',
        formatter: (p) => <div className={p?.over_due ? 'bw_red' : ''}>{p?.date_returned}</div>,
      },
      {
        header: 'Kỹ thuật viên',
        formatter: (p) => <div className={p?.over_due ? 'bw_red' : ''}>{p?.repair_user_name}</div>,
      },
      {
        header: 'Ngày hẹn trả',
        formatter: (p) => <div className={p?.over_due ? 'bw_red' : ''}>{p?.date_returned}</div>,
      },
      {
        header: 'Tổng chi phí',
        formatter: (p) => <b className={p?.over_due ? 'bw_red' : ''}>{formatPrice(p?.total_money, 'đ', '.')}</b>,
      },
      {
        header: 'Quá hạn trả',
        formatter: (p) => (p?.over_due ? <div className='bw_red'>{p?.over_due} ngày</div> : 'Không'),
      },
    ],
    [],
  );

  const totalPaid = useMemo(
    () =>
      (customerRepairHistory?.items ?? []).reduce(
        (a, b) => !b.is_over_due && parseInt(a) + parseInt(b.total_money),
        [0],
      ),
    [customerRepairHistory],
  );
  const totalNotPaid = useMemo(
    () =>
      (customerRepairHistory?.items ?? []).reduce(
        (a, b) => b.is_over_due && parseInt(a) + parseInt(b.total_money),
        [0],
      ),
    [customerRepairHistory],
  );

  return (
    <div
      style={{
        marginTop: '15px',
      }}
      className='bw_tab_items bw_active'
      id='bw_insurance'>
      <div className='bw_row'>
        <div className='bw_col_12 bw_flex bw_align_items_center'>
          <div className='bw_count_cus'>
            <img src={moneyIcon} alt='2' />
            Tổng bảo hành/sửa chữa: {customerRepairHistory?.length}
          </div>
          <p className='bw_ms'>
            Đã thanh toán: <b>{formatPrice(totalPaid ?? 0)}đ</b>
          </p>
          <p className='bw_ms'>
            Chưa thanh toán: <b className='bw_red'>{formatPrice(totalNotPaid)}đ</b>
          </p>
        </div>
      </div>
      <div className='bw_box_card bw_mt_2'>
        <DataTable
          noSelect
          columns={columns}
          data={customerRepairHistory?.items ?? []}
          totalPages={customerRepairHistory?.totalPages}
          itemsPerPage={customerRepairHistory?.itemsPerPage}
          page={customerRepairHistory?.page}
          totalItems={customerRepairHistory?.totalItems}
          onChangePage={(page) => {
            setParams({
              ...params,
              page,
            });
          }}
        />
      </div>
    </div>
  );
};

export default WarrantyRepairHistory;
