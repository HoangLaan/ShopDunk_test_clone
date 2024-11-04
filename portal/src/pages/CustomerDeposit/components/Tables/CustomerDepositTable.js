import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';

import customerDepositService from 'services/customerDeposit.service';
import StatusColumn from '../StatusColumn/StatusColumn';
import { formatPrice } from 'utils';
import CareActionsV2 from 'components/shared/FormCommon/CareActionsV2';
import { createDownloadFile, getRandomSubarray, showToast } from 'utils/helpers';
import ICON_COMMON from 'utils/icons.common';
import FormItem from 'components/shared/BWFormControl/FormItem';
import ModalSelectAll from 'pages/Customer/components/modals/ModalSelectAll';
import { callPhone } from 'pages/VoidIp/utils/helpers';
import ColumnCheckbox from 'components/shared/FormCommon/ColumnCheckbox';
import { useFieldArray } from 'react-hook-form';

const TABS = [
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

const CustomerDepositTable = ({ meta, params, onChangePage, onChange }) => {
  const [dataRows, setDataRows] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
  });

  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isOpenModalSendMail, setIsOpenModalSendMail] = useState(false);
  const [isOpenModalSMS, setIsOpenModalSMS] = useState(false);
  const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);
  const [tabActive, setTabActive] = useState(TABS[0].value);
  const [randNumber, setRandNumber] = useState(0);
  const [openModalSelectAll, setOpenModalSelectAll] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  const [tableKey, setTableKey] = useState(0);

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    customerDepositService
      .getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);
  useEffect(loadData, [loadData]);

  const columns = [
    {
      header: 'Khách hàng đặt cọc',
      classNameHeader: 'bw_text_center',
      accessor: 'customer_name',
    },
    {
      header: 'Mã đơn hàng',
      classNameHeader: 'bw_text_center',
      accessor: 'order_no',
    },
    {
      header: 'Mã đặt cọc',
      classNameHeader: 'bw_text_center',
      accessor: 'pre_order_no',
    },
    {
      header: 'Số tiền đặt cọc',
      classNameHeader: 'bw_text_center',
      accessor: 'transfer_amount',
      formatter: (p) => formatPrice(p?.transfer_amount) + ' VNĐ',
    },
    {
      header: 'Ngày đặt cọc',
      classNameHeader: 'bw_text_center',
      accessor: 'pre_created_date_text',
    },
    {
      header: 'Thời gian thanh toán cuối cùng',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      accessor: 'last_payment_time',
    },
    {
      header: 'Tên sản phẩm',
      classNameHeader: 'bw_text_center',
      accessor: 'product_name',
    },
    {
      header: 'Số điện thoại',
      classNameHeader: 'bw_text_center',
      formatter: (item) => (
        <>
          {item.phone_number}
          {item.phone_number && (
            <span class='bw_label bw_label_success' onClick={() => callPhone(item.phone_number)}>
              Gọi nhanh
            </span>
          )}
        </>
      ),
    },
    {
      header: 'Trạng thái CSKH',
      classNameHeader: 'bw_text_center',
      classNameBody: 'bw_text_center',
      formatter: (item) => (
        <label className='bw_checkbox' style={{ marginRight: 0 }}>
          <input
            type='checkbox'
            checked={item?.is_call}
            onClick={async (e) => {
              e?.preventDefault();
              const row = dataRows.items.find((o) => o?.preorder_id === item?.preorder_id);
              row.is_call = e.target.checked;
              setDataRows((prev) => ({ ...prev, items: [...dataRows.items] }));
              setTableKey((prev) => ++prev);
              await customerDepositService.updateCall({ pre_order_id: item?.preorder_id, is_call: e.target.checked });
            }}
          />
          <span />
        </label>
      ),
    },
    {
      header: 'Email',
      classNameHeader: 'bw_text_center',
      accessor: 'email',
    },
    {
      header: 'Hình thức',
      classNameHeader: 'bw_text_center',
      formatter: (p) => {
        if (p?.payment_type === 1) {
          return 'Đặt cọc online';
        }
        if (p?.payment_type === 2) {
          return 'Đặt cọc tại cửa hàng';
        }
      },
    },
    {
      header: 'Cửa hàng',
      classNameHeader: 'bw_text_center',
      accessor: 'store_code',
    },
    {
      header: 'Địa chỉ nhận hàng',
      classNameHeader: 'bw_text_center',
      accessor: 'address',
    },
    {
      header: 'Trạng thái',
      formatter: (p) => <StatusColumn status={p?.is_active} />,
    },
  ];

  const handleExportExcel = useCallback(() => {
    customerDepositService
      .exportExcel(params)
      .then((res) => createDownloadFile(res?.data, 'customer.xlsx'))
      .catch((error) => {
        showToast.error('Không có dữ liệu để xuất file excel.');
      });
  }, [params]);

  return (
    <Fragment>
      <div className='bw_col_2' style={{ marginBottom: -65, marginTop: 20, minHeight: 110 }}>
        <FormItem label='Chọn ngẫu nhiên' style='gray'>
          <span style={{ display: 'flex' }}>
            <input name='random_number' placeholder='Nhập số lượng' onChange={(e) => setRandNumber(e.target.value)} />
            <span
              onClick={() => {
                const radCus = getRandomSubarray(dataRows.items, randNumber);
                setSelectedCustomer(radCus);
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
        keyId='member_id'
        getListPromise={customerDepositService.getList}
        selectedCustomer={selectedCustomer}
        isOpenModalSendMail={isOpenModalSendMail}
        setIsOpenModalSendMail={setIsOpenModalSendMail}
        isOpenModalSMS={isOpenModalSMS}
        setIsOpenModalSMS={setIsOpenModalSMS}
        isOpenModalZalo={isOpenModalZalo}
        setIsOpenModalZalo={setIsOpenModalZalo}
        exportExcel={handleExportExcel}
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
                    onChange({ task_status: o?.value });
                  }}
                  className={tabActive === o.value ? 'bw_active' : ''}>
                  <a className='bw_link'>
                    {o?.label} ({dataRows?.meta?.[o.countKey] || 0})
                  </a>
                </li>
              );
            })}
          </ul>
        }
        loading={dataRows.loading}
        columns={columns}
        data={dataRows.items}
        totalPages={dataRows.totalPages}
        itemsPerPage={dataRows.itemsPerPage}
        page={dataRows.page}
        totalItems={dataRows.totalItems}
        onChangePage={onChangePage}
        defaultDataSelect={selectedCustomer}
        onChangeSelect={setSelectedCustomer}
        hiddenDeleteClick={true}
      />

      {openModalSelectAll && (
        <ModalSelectAll
          loadedData={loadedData}
          totalItems={dataRows.totalItems}
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
};

export default CustomerDepositTable;
