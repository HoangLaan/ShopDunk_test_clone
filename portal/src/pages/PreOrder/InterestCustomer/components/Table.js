import React, { Fragment, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

import FormItem from 'components/shared/BWFormControl/FormItem';
import DataTable from 'components/shared/DataTable';
import CareActionsV2 from 'components/shared/FormCommon/CareActionsV2';
import { useAuth } from 'context/AuthProvider';
import { callPhone } from 'pages/VoidIp/utils/helpers';
import { getRandomSubarray } from 'utils/helpers';
import ICON_COMMON from 'utils/icons.common';
import ModalSelectAll from 'pages/Customer/components/modals/ModalSelectAll';
import { getInterestCus } from 'services/pre-order.service';

export const TABS = [
  {
    label: 'Tất cả',
    value: null,
    countKey: 'all',
  },
  {
    label: 'Đã phân công',
    value: 'ASSIGNED',
    countKey: 'count_assigned',
  },
  {
    label: 'Hoàn thành',
    value: 'COMPLETED',
    countKey: 'count_completed',
  },
  {
    label: 'Chưa phân công',
    value: 'NOT_ASSIGNED',
    countKey: 'count_not_assigned',
  },
  {
    label: 'Đang chăm sóc',
    value: 'IN_PROCESS',
    countKey: 'count_in_process',
  },
];

function Table({
  meta,
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onChangeParams,
  exportExcel,
}) {
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [isOpenModalSendMail, setIsOpenModalSendMail] = useState(false);
  const [isOpenModalSMS, setIsOpenModalSMS] = useState(false);
  const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);
  const [tabActive, setTabActive] = useState(TABS[0].value);
  const { isUserShift } = useAuth();
  const [openModalSelectAll, setOpenModalSelectAll] = useState(false);
  const [loadedData, setLoadedData] = useState([]);

  const columns = useMemo(
    () => [
      {
        header: 'Mã khách hàng',
        classNameHeader: 'bw_text_center',
        formatter: (item) =>
          item?.task_detail_id ? (
            <Tooltip title='Chi tiết CSKH'>
              <Link style={{ textDecoration: 'underline' }} to={`/task/detail/${item.task_detail_id}`}>
                {item.customer_code}
              </Link>
            </Tooltip>
          ) : (
            item.customer_code
          ),
      },
      {
        header: 'Tên khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'full_name',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        formatter: (item) => (
          <>
            {item.phone_number}
            {item.phone_number && isUserShift && (
              <span class='bw_label bw_label_success' onClick={() => callPhone(item.phone_number)}>
                Gọi nhanh
              </span>
            )}
          </>
        ),
      },
      {
        header: 'Thời gian quan tâm',
        accessor: 'date_interest',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Email',
        classNameHeader: 'bw_text_center',
        accessor: 'email',
      },
    ],
    [],
  );

  const [randNumber, setRandNumber] = useState(0);

  return (
    <Fragment>
      <div className='bw_col_2' style={{ marginBottom: -65, marginTop: 20 }}>
        <FormItem label='Chọn ngẫu nhiên' style='gray'>
          <span style={{ display: 'flex' }}>
            <input name='random_number' placeholder='Nhập số lượng' onChange={(e) => setRandNumber(e.target.value)} />
            <span
              onClick={() => {
                setSelectedCustomer(getRandomSubarray(data, randNumber));
                setTableKey((prev) => prev + 1);
              }}
              className='bw_btn bw_btn_success'
              style={{ height: 30, width: 30 }}>
              <i className={ICON_COMMON.save} style={{ marginTop: 5 }}></i>
            </span>
          </span>
        </FormItem>
      </div>
      <CareActionsV2
        setLoadedData={setLoadedData}
        setTableKey={setTableKey}
        isOpenModel={openModalSelectAll}
        setOpenModalSelectAll={setOpenModalSelectAll}
        getListPromise={getInterestCus}
        selectedCustomer={selectedCustomer}
        isOpenModalSendMail={isOpenModalSendMail}
        setIsOpenModalSendMail={setIsOpenModalSendMail}
        isOpenModalSMS={isOpenModalSMS}
        setIsOpenModalSMS={setIsOpenModalSMS}
        isOpenModalZalo={isOpenModalZalo}
        setIsOpenModalZalo={setIsOpenModalZalo}
        exportExcel={exportExcel}
      />
      <DataTable
        key={tableKey}
        title={
          <ul className='bw_tabs'>
            {TABS.map((o) => {
              return (
                <li
                  onClick={() => {
                    setTabActive(o.value);
                    onChangeParams({ task_status: o?.value });
                  }}
                  className={tabActive === o.value ? 'bw_active' : ''}>
                  <a className='bw_link'>
                    {o?.label} ({meta[o.countKey] || 0})
                  </a>
                </li>
              );
            })}
          </ul>
        }
        loading={loading}
        columns={columns}
        data={data}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        defaultDataSelect={selectedCustomer}
        onChangeSelect={setSelectedCustomer}
        hiddenDeleteClick={true}
      />
      {openModalSelectAll && (
        <ModalSelectAll
          loadedData={loadedData}
          totalItems={totalItems}
          onClose={() => {
            setOpenModalSelectAll(false);
            setLoadedData([]);
          }}
          onConfirm={() => {
            setSelectedCustomer(loadedData);
            setLoadedData([]);
            setTableKey((prev) => ++prev);
            setOpenModalSelectAll(false);
          }}
        />
      )}
    </Fragment>
  );
}

export default Table;
