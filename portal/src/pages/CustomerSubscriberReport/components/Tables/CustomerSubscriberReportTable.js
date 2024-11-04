import DataTable from 'components/shared/DataTable/index';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import i__cus_home from 'assets/bw_image/icon/i__cus_home.svg';
import CareActionsV2 from 'components/shared/FormCommon/CareActionsV2';
import ColumnCheckbox from 'components/shared/FormCommon/ColumnCheckbox';
import ModalSelectAll from 'pages/Customer/components/modals/ModalSelectAll';
import customerSubscriberReportService from 'services/customerSubscriberReport.service';
import { createDownloadFile, defaultPaging, showToast } from 'utils/helpers';
import StatusColumn from '../StatusColumn/StatusColumn';

const CustomerSubscriberReportTable = ({ params, onChangePage }) => {
  const [dataRows, setDataRows] = useState(defaultPaging);

  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isOpenModalSendMail, setIsOpenModalSendMail] = useState(false);
  const [isOpenModalSMS, setIsOpenModalSMS] = useState(false);
  const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);
  const [openModalSelectAll, setOpenModalSelectAll] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  const [tableKey, setTableKey] = useState(0);

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    customerSubscriberReportService
      .getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);
  useEffect(loadData, [loadData]);

  const columns = useMemo(
    () => [
      {
        classNameHeader: 'bw_text_center',
        header: 'Tên Khách hàng',
        accessor: 'customer_name',
      },
      {
        classNameHeader: 'bw_text_center',
        header: 'Email',
        accessor: 'email',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        accessor: 'phone_number',
      },
      {
        header: 'Giới tính',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => (item.gender === 1 ? 'Nam' : 'Nữ'),
      },
      {
        header: 'Mã giảm giá',
        classNameHeader: 'bw_text_center',
        accessor: 'coupon_code',
      },
      {
        header: 'Trạng thái sử dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) => <ColumnCheckbox checked={item?.is_used_coupon} />,
      },
      {
        header: 'Ngày sử dụng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'used_coupon_date',
      },
      {
        header: 'Sản phẩm quan tâm',
        accessor: 'product_display_name',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <StatusColumn status={p?.is_active} />,
      },
    ],
    [],
  );

  const handleExportExcel = useCallback(() => {
    customerSubscriberReportService
      .exportExcel(params)
      .then((res) => createDownloadFile(res?.data, 'customer.xlsx'))
      .catch((error) => {
        showToast.error('Không có dữ liệu để xuất file excel.');
      });
  }, [params]);

  return (
    <Fragment>
      <div style={{ marginBottom: -55, marginTop: 20, display: 'flex', alignItems: 'center' }}>
        <img src={i__cus_home} alt='total items' />
        Tổng số khách hàng đăng ký: {dataRows.totalItems}
      </div>
      <CareActionsV2
        params={params}
        setLoadedData={setLoadedData}
        setTableKey={setTableKey}
        isOpenModel={openModalSelectAll}
        setOpenModalSelectAll={setOpenModalSelectAll}
        getListPromise={customerSubscriberReportService.getList}
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
        loading={dataRows.loading}
        columns={columns}
        data={dataRows.items}
        totalPages={dataRows.totalPages}
        itemsPerPage={dataRows.itemsPerPage}
        page={dataRows.page}
        totalItems={dataRows.totalItems}
        onChangePage={onChangePage}
        hiddenDeleteClick={true}
        defaultDataSelect={selectedCustomer}
        onChangeSelect={setSelectedCustomer}
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

export default CustomerSubscriberReportTable;
