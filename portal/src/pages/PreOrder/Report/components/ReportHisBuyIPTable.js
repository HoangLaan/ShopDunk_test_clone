import React, { useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import { callPhone } from 'pages/VoidIp/utils/helpers';
import { reportType } from '../const';
import CareActionsV2 from 'components/shared/FormCommon/CareActionsV2';
import { useAuth } from 'context/AuthProvider';
import { getDatHisBuyIP } from 'services/pre-order.service';
import ModalSelectAll from 'pages/Customer/components/modals/ModalSelectAll';

const ReportHisBuyIPTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onChangeParams,
  exportExcel,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isOpenModalSendMail, setIsOpenModalSendMail] = useState(false);
  const [isOpenModalSMS, setIsOpenModalSMS] = useState(false);
  const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);
  const [openModalSelectAll, setOpenModalSelectAll] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const { isUserShift } = useAuth();

  const [tabActive, setTabActive] = useState('1');

  const columns = useMemo(
    () => [
      {
        header: 'Mã khách hàng',
        accessor: 'customer_code',
        formatter: (value) => (value?.customer_code ? value?.customer_code : 'Chưa cập nhật'),
      },
      {
        header: 'Tên khách hàng',
        accessor: 'full_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Giới tính',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (value) => (value.gender === 1 ? 'Nam' : value.gender === 0 ? 'Nữ' : '-'),
      },
      {
        header: 'Ngày sinh',
        accessor: 'birthday',
      },
      {
        header: 'Số điện thoại',
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
        header: 'Email',
        accessor: 'email',
      },
    ],
    [],
  );

  // add all tab
  const tabs = useMemo(() => {
    const allTab = {
      label: 'Tất cả',
      value: 1,
      is_all: 1,
    };

    return [allTab, ...reportType];
  }, []);

  return (
    <div className='bw_table_customer_care'>
      <div style={{ marginBottom: 30 }}>
        <CareActionsV2
          setLoadedData={setLoadedData}
          setTableKey={setTableKey}
          isOpenModel={openModalSelectAll}
          setOpenModalSelectAll={setOpenModalSelectAll}
          getListPromise={getDatHisBuyIP}
          selectedCustomer={selectedCustomer}
          isOpenModalSendMail={isOpenModalSendMail}
          setIsOpenModalSendMail={setIsOpenModalSendMail}
          isOpenModalSMS={isOpenModalSMS}
          setIsOpenModalSMS={setIsOpenModalSMS}
          isOpenModalZalo={isOpenModalZalo}
          setIsOpenModalZalo={setIsOpenModalZalo}
          exportExcel={exportExcel}
        />
      </div>
      <ul className='bw_tabs' style={{ marginBottom: -20 }}>
        {tabs?.map((o) => {
          return (
            <li
              onClick={
                tabActive == o.value
                  ? null
                  : () => {
                      setTabActive(o.value);
                      onChangeParams(o);
                    }
              }
              className={tabActive == o.value ? 'bw_active' : ''}>
              <a className='bw_link'>{o?.label}</a>
            </li>
          );
        })}
      </ul>
      <DataTable
        key={tableKey}
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
    </div>
  );
};

export default ReportHisBuyIPTable;
