import React, { useMemo, useState } from 'react';
import DataTable from 'components/shared/DataTable/index';
import { callPhone } from 'pages/VoidIp/utils/helpers';
import BlankButton from 'pages/CustomerCare/components/BlankButton/BlankButton';
import CheckAccess from 'navigation/CheckAccess';
import ModalSendMail from 'pages/Customer/components/modals/ModalSendMail';
import ModalSendSMS from 'pages/Customer/components/modals/ModalSendSMS';
import { Dropdown } from 'antd';
import { showToast } from 'utils/helpers';
import { useHistory } from 'react-router-dom';
import { CUSTOMER_CARE_PERMISSION } from 'pages/CustomerCare/utils/constants';

const ReportHisBuyIPTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  title
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isOpenModalSendMail, setIsOpenModalSendMail] = useState(false);
  const [isOpenModalSMS, setIsOpenModalSMS] = useState(false);
  const history = useHistory();

  const columns = useMemo(
    () => [
      // {
      //   header: 'Mã khách hàng',
      //   accessor: 'customer_code',
      // },
      {
        header: 'Tên khách hàng',
        accessor: 'full_name',
      },
      // {
      //   header: 'Giới tính',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      //   formatter: (value) => (value ? '' : value.gender === 1 ? 'Nam' : 'Nữ'),
      // },
      // {
      //   header: 'Ngày sinh',
      //   classNameHeader: 'bw_text_center',
      //   classNameBody: 'bw_text_center',
      //   accessor: 'birthday',
      // },
      {
        header: 'Số điện thoại',
        classNameHeader: 'bw_text_center',
        formatter: (item) => (
          <div className='bw_text_center'>
            {item.phone_number}
            {item.phone_number && (
              <span class='bw_label bw_label_success' onClick={() => callPhone(item.phone_number)}>
                Gọi nhanh
              </span>
            )}
          </div>
        ),
      },
      {
        header: 'Email',
        classNameHeader: 'bw_text_center',
        accessor: 'email',
      },
      {
        header: 'Sản phẩm mua',
        classNameHeader: 'bw_text_center',
        accessor: 'product_dislay_name',
      },
      {
        header: 'Trạng thái thanh toán',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          const classNameType = {
            1: {
              value: 'bw_btn_primary',
              label: 'Đã thanh toán hết'
            },
            2: {
              value: 'bw_btn_warning',
              label: 'Đã thanh toán 1 phần'
            },
            0: {
              value: 'bw_btn_danger',
              label: 'Chưa thanh toán'
            }
          }
          return <div className='bw_text_center'>
            <button className={classNameType[p?.payment_status_type]?.value}>{classNameType[p?.payment_status_type]?.label}
            </button>
          </div>
        },
      },
    ],
    [],
  );

  const items = [
    {
      key: 'CRM_TASK',
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
      key: 'EMAIL_MARKETING',
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
      key: 'SMS_MARKETING',
      label: <BlankButton icon='fa fa-rss' title='Gửi SMS' />,
      onClick: () => {
        if (selectedCustomer?.length <= 0) {
          showToast.warning('Vui lòng chọn khách hàng để gửi SMS');
        } else {
          setIsOpenModalSMS(true);
        }
      },
    },
  ];

  return (
    <div className='bw_table_customer_care'>
      <div className='bw_row' style={{ marginTop: 20 }}>
        <div className='bw_col_12 bw_flex bw_justify_content_right bw_btn_group'>
          <CheckAccess permission={CUSTOMER_CARE_PERMISSION.ACTIONS}>
            <Dropdown menu={{ items }} placement='top' arrow={{ pointAtCenter: true }}>
              <button type='button' className='bw_btn bw_btn_success' onClick={() => { }}>
                <span className='fa fa-cogs'></span> Thao tác
                <i className='bw_icon_action fa fa-angle-down bw_mr_1'></i>
              </button>
            </Dropdown>
          </CheckAccess>
        </div>
      </div>
      <DataTable
        fieldCheck='pre_order_id'
        actions={[{
          icon: 'fi fi-rr-eye',
          type: 'success',
          hidden: (p) => !p?.order_id,
          onClick: (p) => {
            history.push(`/orders/detail/${p?.order_id}`)
          },
        }, {
          icon: 'fi fi-rr-arrow-alt-square-up',
          type: 'success',
          onClick: (p) => {
            window.open(`https://test-preorder.shopdunk.com/preorder-iphone-14/order-status/${p?.pre_order_id}`)
          },
        }]}
        title={title}
        loading={loading}
        columns={columns}
        data={data}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        onChangeSelect={setSelectedCustomer}
      />
      {isOpenModalSendMail && (
        <ModalSendMail
          onClose={() => setIsOpenModalSendMail(false)}
          selectedCustomer={selectedCustomer}
        />
      )}
      {isOpenModalSMS && <ModalSendSMS selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalSMS(false)} />}
    </div>
  );
};

export default ReportHisBuyIPTable;
