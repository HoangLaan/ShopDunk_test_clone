import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';

import customerCouponService from 'services/customerCoupon.service';
import { CUSTOMER_COUPON_PERMISSION } from 'pages/CustomerCoupon/utils/constants';
import { callPhone } from 'pages/VoidIp/utils/helpers';
import { defaultPaging } from 'utils/helpers';
import CareActions from 'pages/PreOrder/CareActions/CareActions';
import dayjs from 'dayjs';
import ColumnCheckbox from 'components/shared/FormCommon/ColumnCheckbox';
import CareActionsV2 from 'components/shared/FormCommon/CareActionsV2';

const COLUMN_ID = 'coupon_auto_code_id';

const CustomerCouponTable = ({ params, onChangePage }) => {
  const [dataRows, setDataRows] = useState(defaultPaging);

  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isOpenModalSendMail, setIsOpenModalSendMail] = useState(false);
  const [isOpenModalSMS, setIsOpenModalSMS] = useState(false);
  const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    customerCouponService
      .getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);
  useEffect(loadData, [loadData]);

  const columns = useMemo(
    () => [
      {
        header: 'Mã giảm giá',
        classNameHeader: 'bw_text_center',
        accessor: 'coupon_code',
      },
      {
        header: 'Ngày sử dụng',
        classNameHeader: 'bw_text_center',
        formatter: (item) => item?.used_date ?? dayjs().format('DD/MM/YYYY'),
      },
      {
        header: 'Tên khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_name',
        formatter: (item) => {
          return item.account_id ? (
            <Tooltip title='Chi tiết khách hàng'>
              <Link
                style={{ textDecoration: 'underline' }}
                to={`/customer/detail/${item.account_id}`}>{`${item.member_code} - ${item.member_name}`}</Link>
            </Tooltip>
          ) : (
            item.customer_name
          );
        },
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        formatter: (item) => (
          <>
            {item.customer_phone}
            {item.customer_phone && (
              <span class='bw_label bw_label_success' onClick={() => callPhone(item.customer_phone)}>
                Gọi nhanh
              </span>
            )}
          </>
        ),
      },
      {
        header: 'Cửa hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'store_name',
      },
      {
        header: 'Địa chỉ',
        classNameHeader: 'bw_text_center',
        accessor: 'store_address',
      },
      {
        header: 'Email',
        classNameHeader: 'bw_text_center',
        accessor: 'customer_email',
      },
      {
        header: 'Đã gửi SMS',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => <ColumnCheckbox checked={item?.is_sent_sms} />,
      },
      {
        header: 'Đã gửi Email',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => <ColumnCheckbox checked={item?.is_sent_email} />,
      },
      {
        header: 'Trạng thái sử dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_used ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Đã sử dụng</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Chưa sử dụng</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: CUSTOMER_COUPON_PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/customer-coupon/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'blue',
        permission: CUSTOMER_COUPON_PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/customer-coupon/detail/${p?.[COLUMN_ID]}`),
      },
    ];
  }, []);

  return (
    <Fragment>
      <CareActionsV2
        selectedCustomer={selectedCustomer}
        isOpenModalSendMail={isOpenModalSendMail}
        setIsOpenModalSendMail={setIsOpenModalSendMail}
        isOpenModalSMS={isOpenModalSMS}
        setIsOpenModalSMS={setIsOpenModalSMS}
        isOpenModalZalo={isOpenModalZalo}
        setIsOpenModalZalo={setIsOpenModalZalo}
        showExport={false}
      />
      <DataTable
        fieldCheck={COLUMN_ID}
        loading={dataRows.loading}
        columns={columns}
        data={dataRows.items}
        actions={actions}
        totalPages={dataRows.totalPages}
        itemsPerPage={dataRows.itemsPerPage}
        page={dataRows.page}
        totalItems={dataRows.totalItems}
        onChangePage={onChangePage}
        hiddenDeleteClick={true}
      />
    </Fragment>
  );
};

export default CustomerCouponTable;
