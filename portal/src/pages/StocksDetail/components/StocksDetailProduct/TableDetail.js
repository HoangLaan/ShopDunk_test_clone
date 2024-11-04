import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatPrice } from 'utils/index';
import styled from 'styled-components';
import { formatQuantity } from 'utils/number';
import CheckAccess from 'navigation/CheckAccess';

const DetailTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  onChangeParams,
}) => {
  const StyleImeiInventory = styled.div`
    color: ${(props) => (props.isOverTimeInventory === 1 ? 'red' : '')};
  `;
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        accessor: '',
        formatter: (p, index) => (
          <StyleImeiInventory isOverTimeInventory={p.is_over_time_inventory}>{index + 1}</StyleImeiInventory>
        ),
        classNameHeader: 'bw_sticky bw_check_sticky',
        classNameBody: 'bw_sticky bw_check_sticky',
      },
      {
        header: 'Ngày nhập',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <StyleImeiInventory isOverTimeInventory={p.is_over_time_inventory}>{p.created_date}</StyleImeiInventory>
        ),
      },
      {
        header: 'Phiếu nhập',
        accessor: 'stocks_request_code',
        // formatter: (p) => {
        //   let productImeiCode = p.product_imei_code;
        //   return (
        //     <a
        //       onClick={() => {
        //         setShowStocksInRequest({ isShow: true, productImeiCode });
        //       }}
        //       target='_blank'>
        //       Xem phiếu nhập
        //     </a>
        //   );
        // },
        formatter: (p) => {
          let stocks_in_request_code = p.stocks_in_request_code;
          return (
            <a href={`/stocks-in-request/detail/${p.stocks_in_request_id}`} target='_blank'>
              {stocks_in_request_code}
            </a>
          );
        },

        classNameHeader: 'bw_sticky bw_check_sticky',
        classNameBody: 'bw_sticky bw_check_sticky',
      },
      {
        header: 'Số lô',
        accessor: 'lot_number',
        classNameBody: 'bw_text_center',
        formatter: (p, index) => (
          <StyleImeiInventory isOverTimeInventory={p.is_over_time_inventory}>{p.lot_number != 'null' ?p.lot_number : 'N/A' }</StyleImeiInventory>
        ),
      },
      {
        header: 'Mã IMEI',
        accessor: 'product_imei_code',
        formatter: (p, index) => (
          <StyleImeiInventory isOverTimeInventory={p.is_over_time_inventory}>{p.product_imei_code}</StyleImeiInventory>
        ),
      },
      {
        header: 'Đơn vị tính',
        accessor: 'unit_name',
        classNameBody: 'bw_text_center',
        formatter: (p, index) => (
          <StyleImeiInventory isOverTimeInventory={p.is_over_time_inventory}>{p.unit_name}</StyleImeiInventory>
        ),
      },
      {
        header: 'Đơn giá nhập',
        accessor: 'cost_price_',
        classNameBody: 'bw_text_right',
        formatter: (p) => (
          <CheckAccess permission={'ST_PRICEIMEICODE_VIEW'}>
            <StyleImeiInventory isOverTimeInventory={p.is_over_time_inventory} className='bw_text_right'>
              {formatQuantity(p.cost_price)}
            </StyleImeiInventory>
          </CheckAccess>
        ),
      },
      // {
      //   header: 'Đơn giá xuất kho',
      //   accessor: 'cost_basic_imei_code_',
      //   classNameBody: 'bw_text_right',
      //   formatter: (p) => (
      //     <StyleImeiInventory isOverTimeInventory={p.is_over_time_inventory} className='bw_text_right'>
      //       {formatQuantity(p.cost_basic_imei_code)}
      //     </StyleImeiInventory>
      //   ),
      // },
      {
        header: 'Nhà cung cấp',
        accessor: 'supplier_name',
        //classNameBody: "bw_text_center",
      },
      {
        header: 'Số ngày tồn kho (Ngày)',
        accessor: 'time_inventory',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <StyleImeiInventory isOverTimeInventory={p.is_over_time_inventory}>{p.time_inventory}</StyleImeiInventory>
        ),
      },
      {
        header: 'Đơn hàng',
        accessor: 'order_no',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <StyleImeiInventory
            isOverTimeInventory={p.is_over_time_inventory}
            onClick={() => {
              if (p.order_id) {
                window.open('/orders/detail/' + p.order_id, '_blank', 'rel=noopener noreferrer');
              }
            }}
            style={{ cursor: 'pointer' }}>
            {p.order_no}
          </StyleImeiInventory>
        ),
      },
      {
        header: 'Ghi chú',
        accessor: 'note',
        formatter: (p) => (
          <StyleImeiInventory isOverTimeInventory={p.is_over_time_inventory}>{p.note}</StyleImeiInventory>
        ),
      },
      {
        header: 'Người nhập kho',
        accessor: 'full_name',
        classNameBody: 'bw_text_left',
        formatter: (p) => (
          <StyleImeiInventory isOverTimeInventory={p.is_over_time_inventory}>{p.full_name}</StyleImeiInventory>
        ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'ST_STOCKSDETAIL_VIEW',
        onClick: (p) => {
          window._$g.rdr(`/stocks-detail/history/${p?.product_imei_code}`);
        },
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <div className='bw_mt_2' style={{ marginBottom: '-30px' }}>
        <p>
          *Chú ý:{' '}
          <span
            onClick={() => {
              onChangeParams({ is_over_time_inventory: 1 });
            }}
            className='bw_badge bw_badge_danger'>
            Vượt thời gian lưu kho
          </span>
        </p>
      </div>
      <DataTable
        noSelect
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
      />
    </React.Fragment>
  );
};

export default DetailTable;
