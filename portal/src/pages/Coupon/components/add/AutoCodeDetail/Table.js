import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import DataTable from 'components/shared/DataTable/index';
import styled from 'styled-components';
import { exportExcelAutoGenCoupon } from 'services/coupon.service';

const LableCUS = styled.span`
        display: inline-block;
        padding: 3px 7px;
        line-height: normal !important;
        font-size: 13px;
        background: var(--whiteColor);
        color: ${(props) => props.color};
        border: 1px solid ${(props) => props.color};
        border-radius: 3px;
  `

  const LabelOpt = styled.li`
    margin-left: 5px;
    display: flex;
    align-items: center;
    padding: 5px 7px !important;
    line-height: normal !important;
    font-size: 13px;
    background: var(--whiteColor);
    color: ${(props) => (`var(--${props.color}Color)`)};
    border: 1px solid ${(props) => (`var(--${props.color}Color)`)};
    border-radius: 3px;
`;
const AutoGenTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  meta,
  totalItems,
  onChangePage,
  onRefresh,
  exportExcel
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
    //   {
    //     header: 'STT',
    //     classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
    //     classNameBody: 'bw_sticky bw_name_sticky bw_text_center',
    //     formatter: (_, index) => <span className='bw_text_wrap'>{index + 1}</span>,
    //   },
      {
        header: 'Mã khuyến mãi',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (_) => <span className='bw_text_wrap'>{_.coupon_code}</span>,
      },
      {
        header: 'Thời gian áp dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span className='bw_text_wrap'>{`${p?.start_date} - ${p?.end_date  || 'Vô thời hạn'}`}</span>,
      },
      {
        header: 'Trạng thái sử dụng',
        accessor: 'is_used',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => p?.is_used  ? <LableCUS  color={'red'}>Đã sử dụng</LableCUS> : <LableCUS  color={'green'}>Chưa sử dụng</LableCUS> ,
      },
      {
        header: 'Tên khách hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.customer_name}</span>,
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.customer_phone}</span>,
      },
      {
        header: 'Email',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.customer_email}</span>,
      },
      {
        header: 'Trạng thái gửi mail',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.is_sent_email ? 'Thành công' : 'Thất bại'}</span>,
      },
      {
        header: 'Ngày sử dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.used_dates}</span>,
      },
      {
        header: 'Mã đơn hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <span>{p?.order_code}</span>,
      },
    ],
    [],
  );

  const actions = useMemo(
    () => [
      {
        globalAction: true,
        type: 'success',
        permission: 'SM_COUPON_EXCEL' ,
        content: 'Xuất excel',
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        type: 'success',
        permission: 'SM_COUPON_SEND_EMAIL',
        content: 'Gửi email',
        onClick: () => {
          
        },
      },
      {
        globalAction: true,
        color: 'red',
        type: 'default',
        permission: 'SM_COUPON_SEND_EMAIL',
        content: 'Gửi lại email',
        onClick: () => {
          
        },
      },
    ],
    [],
  );

  const title = (
    <ul className='bw_tabs'>
      <LabelOpt color={'black'}>
        Tất cả: {totalItems}
      </LabelOpt>
      <LabelOpt color={'red'}>
        Đã sử dụng: {totalItems - meta?.non_used}
      </LabelOpt>
      <LabelOpt color={'green'}>
        Chưa sử dụng: {meta?.non_used}
      </LabelOpt>
    </ul>
  );

  return (
    <DataTable
      title={title}
      loading={loading}
      columns={columns}
      actions={actions}
      data={data}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      page={page}
      totalItems={totalItems}
      onChangePage={onChangePage}
      hiddenDeleteClick={true}
    />
  );
};

export default AutoGenTable;
