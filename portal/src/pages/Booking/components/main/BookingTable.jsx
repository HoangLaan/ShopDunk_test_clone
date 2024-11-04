/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from 'react-redux';
import { Modal, Button } from 'antd';
import { Dropdown } from 'antd';
import moment from 'moment';
import useVerifyAccess from 'hooks/useVerifyAccess';
import { showConfirmModal } from 'actions/global';
import { msgError } from 'pages/Booking/helpers/msgError';
import { useAuth } from 'context/AuthProvider';
import { showToast } from 'utils/helpers';

import DataTable from 'components/shared/DataTable/index';
import BWLoader from 'components/shared/BWLoader/index';
import CheckAccess from 'navigation/CheckAccess';
import { AppointmentStatus } from 'pages/Booking/helpers/constans';

import ModalSendMail from 'pages/Customer/components/modals/ModalSendMail';
import ModalSendSMS from 'pages/Customer/components/modals/ModalSendSMS';
import BWButton from 'components/shared/BWButton/index';
import BlankButton from '../BlankButton/BlankButton';

dayjs.extend(customParseFormat);

const COLUMN_ID = 'booking_id';

const BookingTable = ({
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
  approvaluser,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isOpenModalSendMail, setIsOpenModalSendMail] = useState(false);
  const [isOpenModalSMS, setIsOpenModalSMS] = useState(false);
  const [appointment_status, setAppointmentStatus] = useState(0);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { verifyPermission } = useVerifyAccess();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingTable, setLoadingTable] = useState();
  const [tabActive, setTabActive] = useState('1');
  const firstApprovalUser = approvaluser && approvaluser.split(',')[0].trim();


  const handleAppointmentActionClick = useCallback(() => {
    setIsConfirmModalVisible(true);
    console.log('clickedđ');
  }, [appointment_status]);

  const isAdmin = user?.user_name === 'administrator';



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



  const handleConfirmAppointment = useCallback(async () => {
    if (appointment_status) {
      try {
        //setAppointmentStatus(appointment_status || 2);
        await update(AppointmentStatus, 4);
        // Close the confirmation modal
        setIsConfirmModalVisible(false);
        loading();
      } catch (error) {
        console.error('Error updating AppointmentStatus:', error);
        console.log('fdsf');
      }
    }
  }, [appointment_status]);

  const columns = useMemo(
    () => [
      {
        header: 'Trung tâm',
        accessor: 'store_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Mã đặt lịch',
        accessor: 'booking_no',
        classNameHeader: 'bw_text_center',
        // formatter: (p) => <span>{`AS${p?.booking_id.toString().padStart(6, '0')}`}</span>,
      },
      {
        header: 'Tên dịch vụ',
        accessor: 'care_service_name',
        classNameHeader: 'bw_text_center',
      },
      // {
      //   header: 'Trạng thái',
      //   accessor: 'appointment_status',
      //   classNameHeader: 'bw_text_center',
      // },

      {
        header: 'Trạng thái',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          switch (p.appointment_status) {
            case AppointmentStatus.WAIT_CONFIRMATION:
              return (
                <span
                  className='bw_label_outline text-center'
                  style={{ color: '#333', borderColor: '#FCFF74', backgroundColor: '#FCFF74', width: '120px' }}>
                  Chờ xác nhận
                </span>
              );
            case AppointmentStatus.CONFIRMATION:
              return (
                <span
                  className='bw_label_outline text-center'
                  style={{ color: '#fff', borderColor: '#a4a0ea', backgroundColor: '#a4a0ea', width: '120px' }}>
                  Xác nhận
                </span>
              );
            case AppointmentStatus.CALLED:
              return (
                <span className='bw_label_outline text-center' style={{ color: '#333', borderColor: '#F186FF', backgroundColor: '#F186FF', width: '120px' }}>
                  Đã gọi
                </span>
              );
            case AppointmentStatus.PROCESSING:
              return (
                <span
                  className='bw_label_outline bw_label_outline_danger text-center'
                  style={{ color: '#fff', borderColor: '#2E83E9', backgroundColor: '#2E83E9', width: '120px' }}>
                  Đang thực hiện
                </span>
              );
            case AppointmentStatus.COMPLETE:
              return <span className='bw_label_outline bw_label_outline_danger text-center' style={{ color: '#333', borderColor: '#3CE700', backgroundColor: '#3CE700', width: '120px' }}>Hoàn thành</span>;
            case AppointmentStatus.CANCEL:
              return (
                <span
                  className='bw_label_outline bw_label_outline_warning text-center'
                  style={{ color: '#fff', borderColor: '#D60000', backgroundColor: '#D60000', width: '120px' }}>
                  Đã hủy
                </span>
              );
            case AppointmentStatus.NO_REPLY:
              return (
                <span
                  className='bw_label_outline bw_label_outline_warning text-center'
                  style={{ color: '#fff', borderColor: '#D60000', backgroundColor: '#D60000', width: '120px' }}>
                  Không phản hồi
                </span>
              );
            case AppointmentStatus.PAUSE:
              return (
                <span
                  className='bw_label_outline text-center'
                  style={{ color: '#333', borderColor: '#C6C6C6', backgroundColor: '#C6C6C6', width: '120px' }}>
                  Tạm ngưng
                </span>
              );
            default:
              return <span className='bw_label_outline text-center'>Không xác định</span>;
          }
        },
      },

      {
        header: 'Tên khách hàng',
        accessor: 'customer_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số điện thoại',
        accessor: 'customer_phone',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Email',
        accessor: 'customer_email',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày dự kiến',
        accessor: 'expected_start_time_to',
        classNameHeader: 'expected_start_time_form',

        formatter: (item) => {
          const startTime = moment.utc(item.expected_start_time_form).format('HH:mm');
          const endTime = moment.utc(item.expected_start_time_to).format('HH:mm');
          const date = moment.utc(item.expected_date).format('DD/MM/YYYY');
          return (
            <span>
              {startTime}-{endTime}-{date}
            </span>
          );
        },
      },
      {
        header: 'Imei/ Serial',
        accessor: 'imei',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người duyệt',
        accessor: 'approvaluser',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        //formatter: (p) => <b>{p?.created_date}</b>,
        classNameHeader: 'expected_start_time_form',
        formatter: (item) => {
          return <span>{moment.utc(item.created_date).format('HH:mm DD/MM/YYYY')}</span>;
        },

        // formatter: (p) => <span>{dayjs(p?.created_date).format('HH:00 A DD/MM/YYYY')}</span>,
      },




    ],
    [handleDelete, dispatch],
  );

  const handleBulkAction = (items, action) => {
    let _mapOject = items.map((_key) => _key.booking_id).join('|');
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
        icon: 'fi fi-rr-check',
        color: 'red',
        permission: 'ST_BOOKING_REVIEW',
        //disabled: (p) => !p?.is_can_review,
        hidden: (p) => p?.appointment_status === 2,
        //hidden: (p) => !p?.is_can_review,
        onClick: (p) => window._$g.rdr(`/Booking/edit/${p?.booking_id}`),
        //onClick: handleAppointmentActionClick,
      },

      {
        title: 'Sửa',
        icon: 'fi fi-rr-edit',
        color: 'blue',
        outline: true,
        permission: 'ST_BOOKING_EDIT',
        //hidden: (p) => !Boolean(p?.is_can_edit),
        onClick: (p) => window._$g.rdr(`/Booking/edit/${p?.booking_id}`),
      },
      {
        title: 'Xem',
        icon: 'fi fi-rr-eye',
        color: 'blue',
        outline: true,
        permission: 'ST_BOOKING_VIEW',
        onClick: (p) => window._$g.rdr(`/Booking/edit/${p?.booking_id}`),
        //onClick: (p) => window._$g.rdr(`/Booking/detail/${p?.booking_id}`),
      },
      {
        title: 'Xóa',
        icon: 'fi fi-rr-trash',
        color: 'red',
        outline: true,
        permission: 'ST_BOOKING_DEL',
        //hidden: (p) => !Boolean(p?.is_can_edit),
        onClick: (p) =>
          dispatch(
            showConfirmModal(msgError['model_error'], async () => {
              handleDelete(p?.booking_id);
            }),
          ),
      },
    ];
  }, [handleDelete, handleAppointmentActionClick, dispatch]);

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
    // {
    //   key: '3',
    //   label: <BlankButton icon='fa fa-rss' title='Gửi SMS' />,
    //   onClick: () => {
    //     if (selectedCustomer?.length <= 0) {
    //       showToast.warning('Vui lòng chọn khách hàng để gửi SMS');
    //     } else {
    //       setIsOpenModalSMS(true);
    //     }
    //   },
    // },
  ];

  return (
    <React.Fragment>
      <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group btn-mail'>
        <CheckAccess>
          <Dropdown menu={{ items }} placement='top' arrow={{ pointAtCenter: true }}>
            <button type='button' className='bw_btn bw_btn_success' onClick={() => { }}>
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

export default BookingTable;
