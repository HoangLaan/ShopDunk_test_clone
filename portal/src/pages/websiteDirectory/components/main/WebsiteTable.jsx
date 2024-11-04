/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from 'react-redux';
import { Modal, Button } from 'antd';
import { Dropdown } from 'antd';

import useVerifyAccess from 'hooks/useVerifyAccess';
import { showConfirmModal } from 'actions/global';
import { exportPreOrder, read as getDetailOrder } from 'pages/websiteDirectory/helpers/call-api';
import { cdnPath } from 'utils/index';
import { exportPDF } from 'pages/websiteDirectory/helpers/call-api';
import { useAuth } from 'context/AuthProvider';
import { viewInvoice } from 'services/misa-invoice.service';
import { showToast } from 'utils/helpers';

import DataTable from 'components/shared/DataTable/index';
import BWLoader from 'components/shared/BWLoader/index';
import CheckAccess from 'navigation/CheckAccess';
import { AppointmentStatus } from 'pages/websiteDirectory/helpers/constans';
import { msgError } from 'pages/websiteDirectory/helpers/msgError';

import ModalSendMail from 'pages/Customer/components/modals/ModalSendMail';
import ModalSendSMS from 'pages/Customer/components/modals/ModalSendSMS';
import BWButton from 'components/shared/BWButton/index';
import BlankButton from '../BlankButton/BlankButton';
//import ModalZalo from '../Modals/ModalZalo';

dayjs.extend(customParseFormat);

const COLUMN_ID = 'website_category_id';

const WebsiteDirectoryTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  loading,
  handleChecked,
  update,
  onChangeParams,
  approvaluser = {},
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isOpenModalSendMail, setIsOpenModalSendMail] = useState(false);
  const [isOpenModalSMS, setIsOpenModalSMS] = useState(false);
  //const [isOpenModalZalo, setIsOpenModalZalo] = useState(false);
  //const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointment_status, setAppointmentStatus] = useState(0);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { verifyPermission } = useVerifyAccess();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingTable, setLoadingTable] = useState();
  const [tabActive, setTabActive] = useState('1');

  const handleAppointmentActionClick = useCallback(() => {
    setIsConfirmModalVisible(true);
    console.log('clickedđ');
  }, []);

  const isAdmin = user?.user_name === 'administrator';

  const handleExportPDF = (order_id) => {
    setLoadingPdf(true);

    exportPDF(order_id)
      .then((response) => {
        let varUrl = response.path;
        const url = cdnPath(varUrl);
        const pdflink = document.createElement('a');
        pdflink.target = '_blank';
        pdflink.href = url;
        document.body.appendChild(pdflink);
        pdflink.click();
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };

  useEffect(() => {
    const mailBtns = document.querySelectorAll('.btn-mail');

    // Ẩn các phần tử .btn-mail
    mailBtns.forEach((btn) => {
      btn.style.display = 'none';
    });

    const handleAppend = () => {
      const sendBtnGroup = document.querySelector('.btn_group-send');

      // Kiểm tra xem sendBtnGroup có tồn tại không trước khi thêm vào
      if (sendBtnGroup) {
        mailBtns.forEach((btn) => {
          btn.style.display = '';
          sendBtnGroup.prepend(btn);
        });
      } else {
        console.log('Phần tử .btn_group-send không tồn tại');
      }
    };
    const timeout = setTimeout(() => {
      handleAppend();
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleExportInvoice = async (order_id) => {
    try {
      let orderDetail = await getDetailOrder(order_id);
      if (orderDetail) {
        if (!orderDetail?.transaction_id) {
          showToast.warning('Tính năng tạm ẩn !');
          // orderDetail = calculateProductDiscount(orderDetail);
          // await exportInvoice(orderDetail, setLoadingTable);
        } else {
          const viewLink = await viewInvoice(orderDetail?.transaction_id);
          if (viewLink) {
            window.open(viewLink, '_blank');
          }
        }
      }
    } catch (error) {
      showToast.error('Xuất hóa đơn xảy ra lỗi !');
    }
  };

  const handleConfirmAppointment = useCallback(async () => {
    if (appointment_status) {
      try {
        // Replace this with your actual API call to update the AppointmentStatus to 2 (CALLED)

        //setAppointmentStatus(appointment_status || 2);
        await update(AppointmentStatus, 4);
        //console.log(AppointmentStatus)

        // Close the confirmation modal
        setIsConfirmModalVisible(false);

        // Trigger any additional actions or refresh the data if needed
        // For example, you can reload the orders list
        loading();
      } catch (error) {
        console.error('Error updating AppointmentStatus:', error);
        console.log('fdsf');
      }
    }
  }, [appointment_status, loading, update]);

  const columns = useMemo(
    () => [
      {
        header: 'Mã danh mục',
        accessor: 'website_category_code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Tên danh mục',
        accessor: 'website_category_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Website',
        accessor: 'website_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trang tĩnh',
        accessor: 'static_content_name',
        classNameHeader: 'bw_text_center',
      },

      {
        header: 'Ngành hàng',
        accessor: 'product_category_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        // accessor: 'APPROVALSTATUS',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          switch (p.is_active) {
            case 1:
              return (
                <span
                  className='bw_label_outline text-center'
                  style={{ color: '#333', borderColor: '#6CFF39', backgroundColor: '#6CFF39', width: '120px' }}>
                  Hiển thị
                </span>
              );
            case 0:
              return (
                <span
                  className='bw_label_outline text-center'
                  style={{ color: '#fff', borderColor: '#D60000', backgroundColor: '#D60000', width: '120px' }}>
                  Ẩn
                </span>
              );

            default:
              return <span className='bw_label_outline text-center'>Không xác định</span>;
          }
        },
      },

      {
        header: 'Thứ tự hiển thị',
        accessor: 'order_index',
        classNameHeader: 'bw_text_center',
      },

      {
        header: 'Hiển thị top menu',
        // accessor: 'is_top_menu',
        classNameHeader: 'expected_start_time_form',
        formatter: (p) => {
          switch (p.is_top_menu) {
            case true:
              return <span className='text-center'>Có</span>;
            case false:
              return <span className='text-center'>Không</span>;

            default:
              return <span className='bw_label_outline text-center'>Không xác định</span>;
          }
        },
      },
      {
        header: 'Hiển thị footer menu',
        // accessor: 'is_footer',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          switch (p.is_footer) {
            case true:
              return <span className='text-center'>Có</span>;
            case false:
              return <span className='text-center'>Không</span>;

            default:
              return <span>Không xác định</span>;
          }
        },
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'expected_start_time_form',
        formatter: (p) => <span>{dayjs(p?.created_date).format('DD/MM/YYYY HH:00 ')}</span>,
      },
    ],
    [],
  );

  const handleBulkAction = (items, action) => {
    let _mapOject = items.map((_key) => _key.website_category_id).join('|');
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(_mapOject),
        ),
      );
    }
  };

  const hiddenRowSelect = (row) =>
    !row?.is_can_edit || (!verifyPermission(row?.order_type_delete_function) && !isAdmin);

  const actions = useMemo(() => {
    return [
      {
        title: 'Sửa',
        icon: 'fi fi-rr-edit',
        color: 'blue',
        outline: true,
        permission: 'CMS_WEBSITECATEGORY_EDIT',
        //hidden: (p) => !Boolean(p?.is_can_edit),
        onClick: (p) => window._$g.rdr(`/menu-website/edit/${p?.website_category_id}`),
      },
      {
        title: 'Xem',
        icon: 'fi fi-rr-eye',
        color: 'blue',
        outline: true,
        permission: 'CMS_WEBSITECATEGORY_VIEW',
        // disabled: (p) => p?.APPROVALSTATUSID === 2,
        // hidden: (p) => p?.APPROVALSTATUSID === 2,

        onClick: (p) => window._$g.rdr(`/menu-website/detail/${p?.website_category_id}`),
      },
      {
        title: 'Xóa',
        icon: 'fi fi-rr-trash',
        color: 'red',
        outline: true,
        permission: 'CMS_WEBSITECATEGORY_DELETE',
        //hidden: (p) => !Boolean(p?.is_can_edit),
        onClick: (p) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete(p?.website_category_id);
            }),
          ),
      },
    ];
  }, []);

  const items = [
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
  ];

  return (
    <React.Fragment>
      <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group btn-mail'>
        <CheckAccess>
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
      <DataTable
        fieldCheck={COLUMN_ID}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        currentPage={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        loading={loading || loadingTable}
        handleBulkAction={handleBulkAction}
        //hiddenRowSelect={hiddenRowSelect}
        //onChangeSelect={handleChecked}
        onChangeSelect={setSelectedCustomer}
      />

      {isOpenModalSendMail && (
        <ModalSendMail onClose={() => setIsOpenModalSendMail(false)} selectedCustomer={selectedCustomer} />
      )}
      {isOpenModalSMS && <ModalSendSMS selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalSMS(false)} />}
      {/* {isOpenModalZalo && (
        <ModalZalo selectedCustomer={selectedCustomer} onClose={() => setIsOpenModalZalo(false)} customer={{}} />
      )} */}

      {/* Confirmation Modal */}
      <Modal
        title='Xác nhận đặt lịch'
        class='ttt-popup'
        visible={isConfirmModalVisible} // Replace this line
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        footer={[
          <Button key='cancel' onClick={() => setIsConfirmModalVisible(false)}>
            Hủy bỏ
          </Button>,
          <Button key='confirm' type='primary' onClick={handleConfirmAppointment}>
            Xác nhận
          </Button>,
        ]}>
        Bạn có chắc chắn muốn xác nhận đặt lịch này?
      </Modal>

      {loadingPdf && <BWLoader isPage={false} />}
    </React.Fragment>
  );
};

export default WebsiteDirectoryTable;
