import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showToast } from 'utils/helpers';
import ModalReview from '../Modal/ModalReview';
import { deleteBorrowRequest } from "services/borrow-request.service";


const COLUMN_ID = 'borrow_request_id';

const BorrowRequestTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const dispatch = useDispatch();
  const [showModalReview, setShowModalReview] = useState(false);
  const [itemReviewLevel, setItemReviewLevel] = useState(null);

  const columns = useMemo(
    () => [
      {
        header: 'Số phiếu mượn',
        accessor: 'borrow_request_code',
      },
      {
        header: 'Ngày mượn',
        accessor: 'borrow_date',
      },
      {
        header: 'Ngày hẹn trả',
        accessor: 'borrow_date_return',
      },
      {
        header: 'Kho mượn',
        accessor: 'borrow_stocks_name',
      },
      {
        header: 'Kho xuất',
        accessor: 'export_stocks_name',
      },
      {
        header: 'Người mượn',
        accessor: 'borrow_user_name',
      },
      {
        header: 'Ngày trả thực tế',
        accessor: 'borrow_date_receive',
      },
      {
        header: 'Ghi chú',
        accessor: 'note',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
      },
      {
        header: 'Người duyệt',
        accessor: 'created_date',
        formatter: (p) => (
          <ul className='bw_confirm_level'>
            {p.review_list.map((o) => {
              return (  
              <li>
                <p>
                  {o.review_users_name}
                </p>
              </li>)
            })}
          </ul>
        ),
      },
      {
        header: 'Trạng thái duyệt',
        accessor: 'created_date',
      },
      {
        header: 'Trạng thái mượn',
        accessor: 'created_date',
      },
    ],
    [],
  );

  const handleReview = (item) => {
    setItemReviewLevel(item);
    setShowModalReview(true);
  };

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fi-rr-check',
        color: 'red',
        permission: 'SL_BORROWREQUEST_VIEW',
        hidden: (_) => {
          return _?.is_can_review * 1 === 1 && _?.is_review * 1 !== 1 ? false : true;
        },
        onClick: (p) => {
          if (p?.is_can_review * 1 === 1 && p?.is_review * 1 !== 1) {
            handleReview(p?.[COLUMN_ID]);
          }
        },
      },
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: 'SL_BORROWREQUEST_ADD',
        onClick: () => window._$g.rdr('/borrow-request/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: 'SL_BORROWREQUEST_EDIT',
        onClick: (p) => window._$g.rdr(`/borrow-request/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: 'SL_BORROWREQUEST_VIEW',
        onClick: (p) => window._$g.rdr(`/borrow-request/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: 'SL_BORROWREQUEST_DEL',
        onClick: (p) =>
        dispatch(
          showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
            handleDelete([p?.[COLUMN_ID]]),
          ),
        ),
      },
    ];
  }, []);

  const handleDelete = async (arr) => {
    try {
      await deleteBorrowRequest({ list_id: arr });
      showToast.success('Xóa đề xuất mượn hàng thành công');
      onRefresh();
    } catch (error) {
      showToast.error(error.message);
    } finally {
    }
  };

  const handleBulkAction = (items, action) => {
    let arrDel = items?.map((item) => item?.[COLUMN_ID]);
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
        fieldCheck={COLUMN_ID}
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
