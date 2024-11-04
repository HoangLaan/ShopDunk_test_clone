import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';
import { createDownloadFile, showToast } from 'utils/helpers';

import { PERMISSION } from 'pages/CustomerLead/utils/constants';
import CustomerLeadService from 'services/customer-lead.service';
import ModalImport from '../Modals/ModalImport';
import { useCustomerLeadContext } from 'pages/CustomerLead/utils/context';
import CareActions from '../CareActions/CareActions';
import ModalSendMail from 'pages/Customer/components/modals/ModalSendMail';
import ModalSendSMS from 'pages/Customer/components/modals/ModalSendSMS';
import ModalZalo from 'pages/CustomerCare/components/Modals/ModalZalo';
import TooltipHanlde from 'components/shared/TooltipWrapper';
import ModalSelectAll from 'pages/Customer/components/modals/ModalSelectAll';
import i__callGen from 'assets/bw_image/i__callGen.svg';
import { callPhone } from 'pages/VoidIp/utils/helpers';
import { useAuth } from 'context/AuthProvider';

const COLUMN_ID = 'data_leads_id';
const style = {
  display: 'flex',
  width: 'max-content',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
}
let isStopLoadedData = false;

const TableCustomerLead = ({ params, onChange }) => {
  const { user} = useAuth();
  const dispatch = useDispatch();
  const { openModalImport, onOpenModalImport, setRefresh } = useCustomerLeadContext();
  const [openModalMail, setOpenModalMail] = useState(false);
  const [openModalSMS, setOpenModalSMS] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);
  const [openModalSelectAll, setOpenModalSelectAll] = useState(false);
  const [loadedData, setLoadedData] = useState([]);
  isStopLoadedData = !openModalSelectAll;
  const [tableKey, setTableKey] = useState(0);

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
    CustomerLeadService.getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(() => {
    loadData();
    setRefresh(loadData);
  }, [loadData]);

  const exportExcel = useCallback(() => {
    if (dataRows.totalItems <= 0) {
      showToast.warning('Hiện tại không có dữ liệu để xuất excel');
      return;
    }
    CustomerLeadService.exportExcel(params)
      .then((response) => createDownloadFile(response?.data, 'danh-sach-khach-hang-tiem-nang.xlsx'))
      .catch(() => {});
  }, [params, dataRows.totalItems]);

  const importExcel = () => {
    onOpenModalImport(true);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Mã khách hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <b
            className='bw_sticky bw_name_sticky'
            onClick={() => window._$g.rdr(`/customer-lead/edit/${p?.[COLUMN_ID]}`)}
            style={{ cursor: 'pointer' }}>
            {p?.data_leads_code ?? 'Chưa cập nhật'}
          </b>
        ),
      },
      {
        header: 'Tên khách hàng tiềm năng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <p onClick={() => window._$g.rdr(`/customer-lead/edit/${p?.[COLUMN_ID]}`)} style={{ cursor: 'pointer' }}>
            {p?.full_name}
          </p>
        ),
      },
      {
        header: 'Giới tính',
        classNameHeader: 'bw_text_center',
        // formatter: (p) => <p>{p.gender !== 'Không xác định' ? p?.gender === 1 ? 'Nam' : 'Nữ' : 'N/A'}</p>,
        formatter: (p) => <p>{p.gender !== 'Không xác định' ? p?.gender : 'N/A'}</p>,
      },
      {
        header: 'Ngày sinh',
        classNameHeader: 'bw_text_center',
        accessor: 'birthday',
      },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        accessor: 'phone_number',
        formatter: (p) => p.phone_number && <div style={style}>
          <p>{p?.phone_number} </p>
          {(user.isAdministrator) || (!user.isAdministrator && user.voip_ext) ?
            <img onClick={() => callPhone(p?.phone_number)} src={i__callGen} style={{width: '30px', cursor: 'pointer'}} alt='' />
            : ''
          }
        </div>
      },
      {
        header: 'Trạng thái chuyển đổi',
        classNameHeader: 'bw_text_center',
        accessor: 'status_transfer',
      },
      {
        header: 'Nguồn khách hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'source_name',
      },
      {
        header: 'Địa chỉ',
        classNameHeader: 'bw_text_center',
        accessor: 'address',
        formatter: (p) => <TooltipHanlde>{p?.address}</TooltipHanlde>,
      },
      {
        header: 'Trạng thái CSKH',
        classNameHeader: 'bw_text_center',
        accessor: 'workflow_name',
      },
      {
        header: 'Trạng thái',
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

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out mr-2',
        type: 'outline',
        className: 'bw_btn_outline_success',
        content: 'Xuất excel',
        permission: PERMISSION.IMPORT,
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-in mr-2',
        type: 'outline',
        className: 'bw_btn_outline_success',
        content: 'Nhập excel',
        permission: PERMISSION.EXPORT,
        onClick: () => importExcel(),
      },
      {
        globalAction: true,
        icon: 'fa fa-street-view',
        type: 'success',
        outline: true,
        content: 'Chọn tất cả',
        onClick: async () => {
          try {
            setOpenModalSelectAll(true);
            const result = [];
            const updateResult = (newArray = []) => {
              for (let i = 0; i < newArray.length; i++) {
                const indexMemberId = result.findIndex((x) => x?.data_leads_id === newArray[i]?.data_leads_id);
                if (indexMemberId === -1) {
                  result.push(newArray[i]);
                }
              }
              setLoadedData(result);
              setTableKey((prev) => ++prev);
            };
            const firstRes = await CustomerLeadService.getList({ is_active: 1, page: 1, itemsPerPage: 250 });
            updateResult(firstRes.items);
            for (let page = 2; page <= firstRes.totalPages; page++) {
              if (isStopLoadedData) {
                continue;
              }
              const pageRes = await CustomerLeadService.getList({ is_active: 1, page, itemsPerPage: 250 });
              updateResult(pageRes?.items || []);
            }
          } catch (error) {
            showToast.error('Lấy danh sách khách hàng xảy ra lỗi !');
          }
        },
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/customer-lead/add`),
      },
    ];
  }, [exportExcel]);

  const actionsTable = useMemo(() => {
    return [
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
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await CustomerLeadService.delete([p?.[COLUMN_ID]]);
                loadData();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <Fragment>
      <CareActions
        setOpenModalMail={setOpenModalMail}
        setOpenModalSMS={setOpenModalSMS}
        selectedCustomer={selectedCustomer}
        setIsOpenModalZalo={setIsOpenModalZalo}
        params={params}
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
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await CustomerLeadService.delete(e?.map((o) => o?.[COLUMN_ID]));
                document.getElementById('data-table-select')?.click();
                loadData();
              },
            ),
          );
        }}
      />
      {openModalMail && (
        <ModalSendMail
          selectedCustomer={(selectedCustomer || []).map((x) => ({ ...x, member_id: x?.data_leads_id }))}
          onClose={() => {
            setOpenModalMail(false);
          }}
        />
      )}
      {openModalSMS && <ModalSendSMS selectedCustomer={selectedCustomer} onClose={() => setOpenModalSMS(false)} />}
      {isOpenModalZalo && (
        <ModalZalo selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalZalo(false)} customer={{}} />
      )}

      {openModalImport && <ModalImport />}
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
            isStopLoadedData = true;
          }}
        />
      )}
    </Fragment>
  );
};

export default TableCustomerLead;
