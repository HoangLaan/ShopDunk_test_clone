import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { showConfirmModal } from 'actions/global';
import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import { deleteBorrowRequest } from 'services/borrow-request.service';
import { borrowStatus, borrowStatusOptions, reviewStatus } from 'pages/BorrowRequest/helper/constants';
import { useAuth } from 'context/AuthProvider';

import ModalReview from '../add/modals/ModalReview';
import DataTable from 'components/shared/DataTable/index';
import ReviewStatus from 'components/shared/ReviewStatus';

const formId = 'borrow_request_id';

const BorrowRequestTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const { user } = useAuth();

  const dispatch = useDispatch();
  const [showModalReview, setShowModalReview] = useState(false);
  const [itemReviewLevel, setItemReviewLevel] = useState(null);

  const checkOutOfDate = useCallback((row) => {
    if (+row?.borrow_status === borrowStatus.NOT_EXPORT) return false;

    const dateReturn = moment(row?.borrow_date_return, 'DD/MM/YYYY');
    const dateReceive = moment(row?.borrow_date_receive, 'DD/MM/YYYY');
    const dateNow = moment();
    return dateReturn.isBefore(dateReceive.isValid() ? dateReceive : dateNow);
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'Số phiếu mượn',
        accessor: 'borrow_request_code',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <div style={{ color: checkOutOfDate(p) ? '#EC2D41' : '#333' }}>{p?.borrow_request_code}</div>,
      },
      {
        header: 'Trạng thái',
        accessor: 'borrow_request_code',
        formatter: (p) => (
          <div style={{ color: checkOutOfDate(p) ? '#EC2D41' : '#333' }}>
            {borrowStatusOptions.find((item) => item.value === +p?.borrow_status)?.label}
          </div>
        ),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ngày mượn',
        accessor: 'borrow_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <div style={{ color: checkOutOfDate(p) ? '#EC2D41' : '#333' }}>{p?.borrow_date}</div>,
      },
      {
        header: 'Ngày hẹn trả',
        accessor: 'borrow_date_return',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <div style={{ color: checkOutOfDate(p) ? '#EC2D41' : '#333' }}>{p?.borrow_date_return}</div>,
      },
      {
        header: 'Ngày trả thực tế',
        accessor: 'borrow_date_receive',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <div style={{ color: checkOutOfDate(p) ? '#EC2D41' : '#333' }}>{p?.borrow_date_receive}</div>,
      },
      {
        header: 'Kho mượn',
        accessor: 'borrow_stocks_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <div style={{ color: checkOutOfDate(p) ? '#EC2D41' : '#333' }}>{p?.borrow_stocks_name}</div>,
      },
      {
        header: 'Kho xuất',
        accessor: 'export_stocks_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <div style={{ color: checkOutOfDate(p) ? '#EC2D41' : '#333' }}>{p?.export_stocks_name}</div>,
      },
      {
        header: 'Người mượn',
        accessor: 'borrow_user_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <div style={{ color: checkOutOfDate(p) ? '#EC2D41' : '#333' }}>{p?.borrow_user_name}</div>,
      },
      // {
      //   header: 'Ghi chú',
      //   accessor: 'note',
      // },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => <div style={{ color: checkOutOfDate(p) ? '#EC2D41' : '#333' }}>{p?.created_date}</div>,
      },
      {
        header: 'Người duyệt',
        accessor: 'created_date',
        formatter: (p) => (
          <ReviewStatus
            reviewList={p.review_list.map((item) => ({
              ...item,
              is_reviewed: item.is_review,
              full_name: item.review_users_name,
            }))}
          />
        ),
      },
      {
        header: 'Trạng thái duyệt',
        accessor: 'is_review',
        classNameHeader: 'bw_sticky bw_name_sticky_right bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky_right bw_text_center',
        formatter: (p) =>
          +p?.is_review === reviewStatus.ACCEPT ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Đã duyệt</span>
          ) : +p?.is_review === reviewStatus.REJECT ? (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Không duyệt</span>
          ) : +p?.is_review === reviewStatus.PENDING ? (
            <span className='bw_label_outline bw_label_outline_warning text-center'>Đang duyệt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline text-center '>Chưa duyệt</span>
          ),
      },
    ],
    [checkOutOfDate],
  );

  const handleReview = useCallback((item) => {
    setItemReviewLevel(item);
    setShowModalReview(true);
  }, []);

  const hiddenReview = useCallback(
    (row) => {
      if (
        (row.is_review === reviewStatus.PENDING || row.is_review === reviewStatus.NOT_REVIEW) &&
        // user.isAdministrator ||
        row?.review_list?.find(
          (item) => String(item.user_review) === String(user.user_name) && item.is_review === reviewStatus.PENDING,
        )
      )
        return false;
      return true;
    },
    [user.user_name],
  );

  const handleDelete = useCallback(
    (arr) => {
      deleteBorrowRequest({ list_id: arr })
        .then((res) => {
          showToast.success('Xóa đề xuất mượn hàng thành công');
          onRefresh();
        })
        .catch((err) => {
          showToast.error(err.message);
        });
    },
    [onRefresh],
  );

  const isCantEdit = useCallback((row) => +row?.is_review !== reviewStatus.NOT_REVIEW, []);

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-check',
        color: 'red',
        permission: 'SL_BORROWREQUEST_REVIEW',
        hidden: hiddenReview,
        onClick: (p) => {
          if (!hiddenReview(p)) {
            handleReview(p?.[formId]);
          }
        },
      },
      // {
      //   globalAction: true,
      //   icon: ICON_COMMON.add,
      //   type: 'success',
      //   content: 'Thêm mới',
      //   permission: 'SL_BORROWREQUEST_ADD',
      //   onClick: () => window._$g.rdr('/borrow-request/add'),
      // },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: 'SL_BORROWREQUEST_EDIT',
        disabled: isCantEdit,
        hidden: isCantEdit,
        onClick: (p) => window._$g.rdr(`/borrow-request/edit/${p?.[formId]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: 'SL_BORROWREQUEST_VIEW',
        onClick: (p) => window._$g.rdr(`/borrow-request/detail/${p?.[formId]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: 'SL_BORROWREQUEST_DEL',
        disabled: isCantEdit,
        hidden: isCantEdit,
        onClick: (p) =>
          dispatch(
            showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
              handleDelete([p?.[formId]]),
            ),
          ),
      },
    ];
  }, [hiddenReview, dispatch, handleReview, handleDelete, isCantEdit]);

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.[formId]);
    if (action === 'delete') {
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () => {
          handleDelete(arrDel);
        }),
      );
    }
  };

  return (
    <Fragment>
      <DataTable
        fieldCheck={formId}
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={handleBulkAction}
        hiddenRowSelect={(p) => p?.is_review !== reviewStatus.NOT_REVIEW}
      />
      {showModalReview && (
        <ModalReview
          disabled={true}
          itemReviewLevel={itemReviewLevel}
          setShowModalReview={setShowModalReview}
          onRefresh={onRefresh}
        />
      )}
    </Fragment>
  );
};

export default BorrowRequestTable;
