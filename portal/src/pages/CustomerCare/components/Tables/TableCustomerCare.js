import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dropdown } from 'antd';
import { useHistory } from 'react-router-dom';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';

import { CUSTOMER_CARE_PERMISSION, CUSTOMER_PERMISSION, TASK_STATUS } from 'pages/CustomerCare/utils/constants';
import CustomerCareService from 'services/customer-care.service';
import CheckAccess from 'navigation/CheckAccess';
import BWButton from 'components/shared/BWButton/index';
import BlankButton from '../BlankButton/BlankButton';
import { showToast } from 'utils/helpers';
import ModalSendMail from 'pages/Customer/components/modals/ModalSendMail';
import ModalSendSMS from 'pages/Customer/components/modals/ModalSendSMS';
import { deleteCustomer } from 'services/customer.service';
import CustomerLeadService from 'services/customer-lead.service';
import ToggleButton from 'components/shared/ToggleButton/ToggleButton';
import { callPhone } from 'pages/VoidIp/utils/helpers';
import ModalZalo from '../Modals/ModalZalo';
import TooltipHanlde from 'components/shared/TooltipWrapper';
import { useAuth } from 'context/AuthProvider';

const COLUMN_ID = 'customer_code';

const TableCustomerCare = ({ params, onChange }) => {
  const dispatch = useDispatch();
  const history = useHistory();

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
  const { isUserShift } = useAuth();

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    CustomerCareService.getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);
  useEffect(loadData, [loadData]);

  const onChangePage = (page) => onChange({ page });
  const onChangeStatus = (task_status) => onChange({ task_status });

  const exportExcel = () => {
    CustomerCareService.exportExcel(params)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response?.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'customer-care.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(() => {});
  };

  const columns = useMemo(
    () => [
      {
        header: 'Mã khách hàng',
        accessor: 'customer_code',
      },
      {
        header: 'Tên khách hàng',
        accessor: 'full_name',
      },
      {
        header: 'Giới tính',
        accessor: 'gender_text',
      },
      {
        header: 'Ngày sinh',
        accessor: 'birthday',
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
        header: 'Địa chỉ',
        accessor: 'address_full',
        formatter: (p) => <TooltipHanlde>{p?.address_full}</TooltipHanlde>,
      },
      {
        header: 'Loại khách hàng',
        accessor: 'customer_type_name',
      },
      {
        header: 'Nguồn',
        accessor: 'source_name',
      },
      {
        header: 'Số ngày chưa chăm sóc',
        accessor: 'no_care_days',
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out',
        type: 'success',
        outline: true,
        content: 'Xuất excel',
        permission: CUSTOMER_PERMISSION.EXPORT,
        onClick: () => exportExcel(),
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        outline: true,
        content: 'Thêm mới',
        permission: CUSTOMER_PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/customer/add?tab_active=information`),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        title: 'Sửa',
        permission: CUSTOMER_PERMISSION.EDIT,
        onClick: (p) => {
          if (p?.is_customer_leads) {
            window._$g.rdr(`/customer-lead/edit/${p?.customer_id}?tab_active=information`);
          } else {
            window._$g.rdr(`/customer/edit/${p?.customer_id}?tab_active=information`);
          }
        },
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        title: 'Chi tiết',
        permission: CUSTOMER_PERMISSION.VIEW,
        onClick: (p) => {
          if (p?.is_customer_leads) {
            window._$g.rdr(`/customer-lead/detail/${p?.data_leads_id}?tab_active=information`);
          } else {
            window._$g.rdr(`/customer/detail/${p?.member_id}?tab_active=information`);
          }
        },
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        title: 'Xóa',
        permission: CUSTOMER_PERMISSION.DEL,
        onClick: (p) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                if (p?.is_customer_leads) {
                  await CustomerLeadService.delete([p?.data_leads_id]);
                } else {
                  await deleteCustomer(p?.member_id);
                }
                loadData();
              },
            ),
          );
        },
      },
    ];
  }, [params]);

  const items = [
    {
      key: '1',
      label: <BlankButton icon='fa fa-tasks' title='Tạo công việc' />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để tạo công việc');
        } else {
          history.push('/task/add', { selectedCustomer });
        }
      },
    },
    {
      key: '2',
      label: <BlankButton icon='fa fa-share' title='Gửi Email' />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để gửi mail');
        } else {
          setIsOpenModalSendMail(true);
        }
      },
    },
    {
      key: '3',
      label: <BlankButton icon='fa fa-rss' title='Gửi SMS' />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để gửi SMS');
        } else {
          setIsOpenModalSMS(true);
        }
      },
    },
    {
      key: '4',
      label: <BlankButton icon='fa fa-comments' title='Gửi Zalo' />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để gửi Zalo');
        } else {
          setIsOpenModalZalo(true);
        }
      },
    },
  ];

  return (
    <div className='bw_table_customer_care'>
      <div className='bw_row bw_row_actions_custom'>
        <div className='bw_col_6'>
          <ToggleButton
            color='#2f80ed'
            isActive={params?.task_status === TASK_STATUS.ASSIGNED}
            onClick={() => onChangeStatus(TASK_STATUS.ASSIGNED)}
            style={{ marginRight: 10 }}>
            Đã phân công
          </ToggleButton>
          <ToggleButton
            color='#ec2d41'
            isActive={params?.task_status === TASK_STATUS.NOT_ASSIGNED}
            onClick={() => onChangeStatus(TASK_STATUS.NOT_ASSIGNED)}
            style={{ marginRight: 10 }}>
            Chưa phân công
          </ToggleButton>
          <ToggleButton
            color='#f2994a'
            isActive={params?.task_status === TASK_STATUS.IN_PROCESS}
            onClick={() => onChangeStatus(TASK_STATUS.IN_PROCESS)}>
            Đang chăm sóc
          </ToggleButton>
        </div>
        <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group'>
          <CheckAccess permission={CUSTOMER_CARE_PERMISSION.ACTIONS}>
            <Dropdown menu={{ items }} placement='top' arrow={{ pointAtCenter: true }}>
              <button type='button' className='bw_btn bw_btn_success' onClick={() => {}}>
                <span className='fa fa-cogs'></span> Thao tác
                <i className='bw_icon_action fa fa-angle-down bw_mr_1'></i>
              </button>
            </Dropdown>
          </CheckAccess>
          {actions
            ?.filter((p) => p.globalAction && !p.hidden)
            .map((props, i) => (
              <CheckAccess permission={props?.permission}>
                <BWButton
                  style={{
                    marginLeft: '3px',
                  }}
                  {...props}
                />
              </CheckAccess>
            ))}
        </div>
      </div>
      <DataTable
        fieldCheck={COLUMN_ID}
        actions={actions.slice(2)}
        loading={dataRows.loading}
        columns={columns}
        data={dataRows.items}
        totalPages={dataRows.totalPages}
        itemsPerPage={dataRows.itemsPerPage}
        page={dataRows.page}
        totalItems={dataRows.totalItems}
        onChangePage={onChangePage}
        onChangeSelect={setSelectedCustomer}
        handleBulkAction={async (e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await CustomerCareService.delete(e?.map((o) => o?.[COLUMN_ID]));
                document.getElementById('data-table-select')?.click();
                loadData();
              },
            ),
          );
        }}
      />
      {isOpenModalSendMail && (
        <ModalSendMail onClose={() => setIsOpenModalSendMail(false)} selectedCustomer={selectedCustomer} />
      )}
      {isOpenModalSMS && <ModalSendSMS selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalSMS(false)} />}
      {isOpenModalZalo && (
        <ModalZalo selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalZalo(false)} customer={{}} />
      )}
    </div>
  );
};

export default TableCustomerCare;
