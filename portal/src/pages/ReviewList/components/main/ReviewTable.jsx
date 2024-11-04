/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useDispatch } from 'react-redux';
import { Modal, Button } from 'antd';
import { Dropdown } from 'antd';

import { showConfirmModal } from 'actions/global';
import { showToast } from 'utils/helpers';

import DataTable from 'components/shared/DataTable/index';
import CheckAccess from 'navigation/CheckAccess';

import BWButton from 'components/shared/BWButton/index';
import { updateChangeStatus } from 'pages/ReviewList/helpers/call-api';

dayjs.extend(customParseFormat);

const COLUMN_ID = 'APPROVALSTATUSID';

const ReviewTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  loading,
  onReloadOrders,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [ReviewId, setReviewId] = useState('');

  const handleOpenDialog = (id) => {
    setReviewId(id);
    setIsConfirmModalVisible(true);
  };
  const handleConfirm = useCallback(async () => {
    try {
      await updateChangeStatus(ReviewId, {
        is_approved: 1,
      });
      showToast.success('Đồng ý duyệt thành công !');
    } catch (error) {
      console.error('Error updating :', error);
      showToast.error('Đồng ý duyệt thất bại !');
    } finally {
      setIsConfirmModalVisible(false);
      onReloadOrders();
    }
  }, [ReviewId, onReloadOrders]);

  const handleCancel = useCallback(async () => {
    try {
      await updateChangeStatus(ReviewId, {
        is_approved: 0,
      });
      showToast.success('Từ chối duyệt thành công !');
    } catch (error) {
      showToast.error('Từ chối duyệt thất bại!');
      console.error('Error updating :', error);
    } finally {
      setIsConfirmModalVisible(false);
      onReloadOrders();
    }
  }, [ReviewId, onReloadOrders]);
  const columns = useMemo(
    () => [
      {
        header: 'Tên khách hàng',
        accessor: 'FULLNAME',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số điện thoại',
        accessor: 'PHONENUMBER',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Dịch vụ sử dụng',
        accessor: 'CARESERVICENAME',
        classNameHeader: 'bw_text_center',
      },

      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        // accessor: 'APPROVALSTATUS',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          switch (p.APPROVALSTATUS) {
            case 'Đã duyệt':
              return (
                <span
                  className='bw_label_outline text-center'
                  style={{ color: '#333', borderColor: '#6CFF39', backgroundColor: '#6CFF39', width: '120px' }}>
                  Đã Duyệt
                </span>
              );
            case 'Không duyệt':
              return (
                <span
                  className='bw_label_outline text-center'
                  style={{ color: '#fff', borderColor: '#D60000', backgroundColor: '#D60000', width: '120px' }}>
                  Không duyệt
                </span>
              );
            case 'Chờ duyệt':
              return (
                <span
                  className='bw_label_outline bw_label_outline_danger text-center'
                  style={{ color: '#333', borderColor: '#FCFF74', backgroundColor: '#FCFF74', width: '120px' }}>
                  Chờ duyệt
                </span>
              );

            default:
              return <span className='bw_label_outline text-center'>Không xác định</span>;
          }
        },
      },

      {
        header: 'Rating',
        accessor: 'RATING',
        classNameHeader: 'bw_text_center',
      },

      {
        header: 'Ngày đánh giá',
        accessor: 'CREATEDDATE',
        classNameHeader: 'expected_start_time_form',
      },
      {
        header: 'Mã đặt hẹn',
        accessor: 'APPOINTMENTSCHEDULENO',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người xét duyệt',
        accessor: 'APPROVALUSER',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Ngày xét duyệt',
        accessor: 'APPROVALDATE',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const handleBulkAction = (items, action) => {
    let _mapOject = items.map((_key) => _key.CUSTOMERCOMMENTID).join('|');
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(_mapOject),
        ),
      );
    }
  };

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-check',
        color: 'red',
        outline: true,
        permission: 'SL_COMMENTCARE_CHECK',
        // hidden: (p) => p?.APPROVALSTATUSID === 2,
        hidden: (p) => p?.APPROVALSTATUSID === 2 || p?.APPROVALSTATUSID === 3,
        onClick: (p) => handleOpenDialog(p?.CUSTOMERCOMMENTID),
      },

      {
        title: 'Xem',
        icon: 'fi fi-rr-eye',
        color: 'blue',
        outline: true,
        permission: 'SL_COMMENTCARE_VIEW',
        hidden: (p) => p?.APPROVALSTATUSID === 1,

        onClick: (p) => window._$g.rdr(`/review-list/detail/${p?.CUSTOMERCOMMENTID}`),
      },
    ];
  }, []);

  return (
    <React.Fragment>
      <div className='bw_col_6 bw_flex bw_justify_content_right bw_btn_group btn-mail'>
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
        loading={loading}
        handleBulkAction={handleBulkAction}
        onChangeSelect={setSelectedCustomer}
      />

      <Modal
        title='
        Duyệt đánh giá'
        class='ttt-popup'
        visible={isConfirmModalVisible} // Replace this line
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        footer={[
          <Button key='cancel' onClick={handleCancel}>
            Từ chối
          </Button>,
          <Button key='confirm' type='primary' onClick={handleConfirm}>
            Xác nhận
          </Button>,
        ]}>
        Bạn có đồng ý duyệt đánh giá này không?
      </Modal>
    </React.Fragment>
  );
};

export default ReviewTable;
