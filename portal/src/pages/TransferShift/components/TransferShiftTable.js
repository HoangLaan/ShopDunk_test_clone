import DataTable from 'components/shared/DataTable/index';
import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showConfirmModal } from 'actions/global';
import { REVIEWSTATUS, TRANSFER_STAUTS } from '../utils/constants';
import ModalReview from './Modal/ModalReview';
import { deleteTransferShift, getDetailReview } from 'services/transfer-shift.service';
import { isNull } from 'lodash';

const TransferShiftTable = ({ loading, data, totalPages, itemsPerPage, page, totalItems, onChangePage, onRefresh }) => {
  const [openModal, setOpenModal] = useState(false);
  const [reviewInformation, setReviewInformation] = useState({});
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'STT',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
        formatter: (item, index) => index + 1,
      },
      {
        header: 'Nhân viên',
        accessor: 'full_name',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Ngày chuyển',
        classNameHeader: 'bw_text_center',
        accessor: '',
        formatter: (item) => item.date_from + ' - ' + item.date_to,
      },
      {
        header: 'Ca hiện tại',
        accessor: 'current_shift_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Ca chuyển',
        accessor: 'new_shift_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Loại yêu cầu chuyển ca',
        accessor: 'transfer_shift_type_name',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Người duyệt',
        accessor: '',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (item) =>
          item.list_user?.length > 0 ? (
            <ul>
              {item.list_user.map((x) => (
                <li>
                  {`${x.user_name} - ${x.full_name}`} ({REVIEWSTATUS.find((y) => y.value === x.is_review).label})
                </li>
              ))}
            </ul>
          ) : (
            'Tự động duyệt'
          ),
      },
      {
        header: 'Ngày tạo',
        accessor: 'create_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => TRANSFER_STAUTS.find((x) => x.value === p.is_review)?.label,
      },
    ],
    [],
  );

  const openReview = (item) => {
    getDetailReview({
      transfer_shift_id: item.transfer_shift_id,
    })
      .then(setReviewInformation)
      .finally(() => {
        setOpenModal(true);
      });
  };

  const onClose = (status) => {
    if (status) onRefresh();
    setOpenModal(false);
  };

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'HR_TRANSFERSHIFT_ADD',
        onClick: () => window._$g.rdr(`/transfer-shift/add`),
      },
      {
        icon: 'fa fa-check-square',
        color: 'blue',
        permission: 'HR_TRANSFERSHIFT_REVIEW',
        hidden: (item) => !item.is_show_review,
        onClick: (p) => openReview(p),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'HR_TRANSFERSHIFT_EDIT',
        hidden: (item) => !isNull(item.is_review),
        onClick: (p) => window._$g.rdr(`/transfer-shift/edit/${p?.transfer_shift_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'HR_TRANSFERSHIFT_VIEW',
        onClick: (p) => window._$g.rdr(`/transfer-shift/detail/${p?.transfer_shift_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: 'HR_TRANSFERSHIFT_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteTransferShift([_?.transfer_shift_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <Fragment>
      <DataTable
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        handleBulkAction={(e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteTransferShift(e?.map((val) => parseInt(val?.transfer_shift_id)));
                onRefresh();
              },
            ),
          );
        }}
      />
      <ModalReview open={openModal} onClose={onClose} item={reviewInformation} />
    </Fragment>
  );
};

export default TransferShiftTable;
