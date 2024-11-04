import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';
import { createDownloadFile, showToast } from 'utils/helpers';

import { PERMISSION } from 'pages/CustomerLead/utils/constants';
import InvoiceManagementService from 'services/invoice-management.service';
import { useCustomerLeadContext } from 'pages/CustomerLead/utils/context';
import CareActions from '../CareActions/CareActions';
import TooltipHanlde from 'components/shared/TooltipWrapper';
import ModalAddCompany from '../Modals/ModalAddCompany';

let isStopLoadedData = false;
const COLUMN_ID = 'order_invoice_id';

const TableCustomerLead = ({ params, onChange }) => {
  const dispatch = useDispatch();
  const { setRefresh, onOpenModalAddCompany } = useCustomerLeadContext();
  const [selectedCustomer, setSelectedCustomer] = useState([]);

  const [tableKey, setTableKey] = useState(0);
  const [isShowCompany, setIsShowCompany] = useState(false);

  const [dataRows, setDataRows] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
  });

  const onChangePage = (page) => onChange({ page });
  const onChangeStatus = (task_status) => onChange({ task_status });

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    InvoiceManagementService.getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(() => {
    loadData();
    setRefresh(loadData);
  }, [loadData]);

  // const exportExcel = useCallback(() => {
  //   if (dataRows.totalItems <= 0) {
  //     showToast.warning('Hiện tại không có dữ liệu để xuất excel');
  //     return;
  //   }
  //   CustomerLeadService.exportExcel(params)
  //     .then((response) => createDownloadFile(response?.data, 'danh-sach-khach-hang-tiem-nang.xlsx'))
  //     .catch(() => {});
  // }, [params, dataRows.totalItems]);

  const columns = useMemo(
    () => [
      {
        header: 'Ký hiệu',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <b
            className='bw_sticky bw_name_sticky'
            onClick={() => window._$g.rdr(`/customer-lead/edit/${p?.[COLUMN_ID]}`)}
            style={{ cursor: 'pointer' }}>
            {p?.order_invoice_serial}
          </b>
        ),
      },
      {
        header: 'Ngày hóa đơn',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <p onClick={() => window._$g.rdr(`/customer-lead/edit/${p?.[COLUMN_ID]}`)} style={{ cursor: 'pointer' }}>
            {p?.order_invoice_date}
          </p>
        ),
      },
      {
        header: 'Số hóa đơn',
        classNameHeader: 'bw_text_center',
        accessor: 'order_invoice_no',
      },
      {
        header: 'Mã cơ quan thuế',
        classNameHeader: 'bw_text_center',
        accessor: 'birthday',
      },
      {
        header: 'Khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'phone_number',
      },
      {
        header: 'Mã số thuế',
        classNameHeader: 'bw_text_center',
        accessor: 'address',
        formatter: (p) => <TooltipHanlde>{p?.address}</TooltipHanlde>,
      },
      {
        header: 'Tổng tiền',
        classNameHeader: 'bw_text_center',
        accessor: 'workflow_name',
      },
      {
        header: 'Trạng thái hóa đơn',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <span
            className={classNames('bw_label_outline bw_label_outline_success text-center', {
              success: p?.order_invoice_status,
              danger: !p?.order_invoice_status,
            })}>
            {p?.is_active ? 'Kích hoạt' : 'Ẩn'}
          </span>
        ),
      },
      {
        header: 'Mã tra cứu',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'order_invoice_transaction',
      },
      {
        header: 'Gửi email',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => (
          <span
            className={classNames('bw_label_outline bw_label_outline_success text-center', {
              success: p?.is_active,
              danger: !p?.is_active,
            })}>
            {p?.is_active ? 'Kích hoạt' : 'Ẩn'}
          </span>
        ),
      },
    ],
    [],
  );

  const actionsSelect = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out mr-2',
        type: 'outline',
        className: 'bw_btn_outline_success',
        content: 'Phát hành hóa đơn',
        permission: PERMISSION.IMPORT,
        // onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Gửi hóa đơn nháp',
        permission: PERMISSION.ADD,
        onClick: () => {
          setIsShowCompany(true);
        }
      },
    ];
  }, []);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out mr-2',
        type: 'outline',
        className: 'bw_btn_outline_success',
        content: 'Xuất excel',
        permission: PERMISSION.IMPORT,
        // onClick: () => exportExcel(),
      },
    ];
  }, []);

  const actionsTable = useMemo(() => {
    return [      
      {
        icon: ICON_COMMON.print,
        color: 'blue',
        title: 'In',
        permission: PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/customer-lead/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        title: 'Sửa',
        permission: PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/customer-lead/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        title: 'Chi tiết',
        permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/customer-lead/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        title: 'Xóa',
        permission: PERMISSION.DEL,
        // onClick: (p) =>
        //   dispatch(
        //     showConfirmModal(
        //       ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
        //       async () => {
        //         await CustomerLeadService.delete([p?.[COLUMN_ID]]);
        //         loadData();
        //       },
        //     ),
        //   ),
      },      
      {
        icon: ICON_COMMON.email,
        color: 'green',
        title: 'Gửi mail',
        permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/customer-lead/detail/${p?.[COLUMN_ID]}`),
      },
    ];
  }, []);

  return (
    <Fragment>
      <CareActions
        selectedCustomer={selectedCustomer}
        params={params}
        actionsSelect={actionsSelect}
        actions={actions}
        onChangeStatus={onChangeStatus}
        totalItems={dataRows.totalItems}
      />
      <DataTable
        fieldCheck={COLUMN_ID}
        loading={dataRows.loading}
        columns={columns}
        data={dataRows.items}
        key={tableKey}
        actions={actionsTable}
        totalPages={dataRows.totalPages}
        itemsPerPage={dataRows.itemsPerPage}
        page={dataRows.page}
        totalItems={dataRows.totalItems}
        onChangePage={onChangePage}
        defaultDataSelect={selectedCustomer}
        onChangeSelect={setSelectedCustomer}
        handleBulkAction={async (e) => {
          // dispatch(
          //   showConfirmModal(
          //     ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
          //     async () => {
          //       await CustomerLeadService.delete(e?.map((o) => o?.[COLUMN_ID]));
          //       document.getElementById('data-table-select')?.click();
          //       loadData();
          //     },
          //   ),
          // );
        }}
      />
      <ModalAddCompany />
    </Fragment>
  );
};

export default TableCustomerLead;
