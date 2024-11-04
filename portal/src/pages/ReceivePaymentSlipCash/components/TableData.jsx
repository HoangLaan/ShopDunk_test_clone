import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import DataTable from 'components/shared/DataTable/index';
import { showConfirmModal } from 'actions/global';
import { formatMoney } from 'utils/index';
import { REVIEW_STATUS, reviewStatusOption } from '../utils/constants';
import { bookkeeping, updateReview } from 'services/receive-slip.service';
import { showToast } from 'utils/helpers';
import CustomeActions from './common/CustomActions';
import TooltipHanlde from 'components/shared/TooltipWrapper';
import { useAuth } from 'context/AuthProvider';
import ModalReview from './common/ModalReview';

const ReceiveSlipTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  handleDelete,
  loading,
  exportExcel,
  importExcel,
  handleExportPDF,
  loadData,
  reload,
}) => {
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isShowModalReview, setIsShowModalReview] = useState(false);
  const [reviewItem, setReviewItem] = useState();
  const { user } = useAuth();

  const columns = useMemo(
    () => [
      {
        header: 'STT',
        accessor: '_',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p, i) => <div>{i + 1}</div>,
      },
      {
        header: 'Ngày hạch toán',
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Số chứng từ',
        accessor: 'code',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Diễn giải',
        accessor: 'descriptions',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <TooltipHanlde>{p?.descriptions}</TooltipHanlde>,
      },
      {
        header: 'Thu (VND)',
        accessor: 'total_money',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <div className='bw_text_right'>{p.type === 1 ? `${formatMoney(p.total_money, true)}` : ''}</div>
        ),
      },
      {
        header: 'Chi (VND)',
        accessor: 'total_money',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <div className='bw_text_right'>{p.type === 2 ? `${formatMoney(p.total_money, true)}` : ''} </div>
        ),
      },
      {
        header: 'Tồn (VND)',
        accessor: 'total_money',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          if (p.is_book_keeping === 1 && p.review_status === 1) {
            const money = p.type === 2 ? p.previous_money - p.total_money : p.previous_money + p.total_money;
            return (
              <div style={money < 0 ? { color: 'red' } : {}} className='bw_text_right'>
                {money > 0 ? formatMoney(money, true) : `(${formatMoney(money, true)})`}
              </div>
            );
          } else {
            return '';
          }
        },
      },
      {
        header: 'Đối tượng',
        accessor: 'receiver_name',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <TooltipHanlde>{p?.receiver_name}</TooltipHanlde>,
      },
      {
        header: 'Lý do thu/chi',
        formatter: (item) => <div>{item.receive_type_name || item.expend_type_name}</div>,
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Loại chứng từ',
        formatter: (item) => <div>{item.type == 1 ? 'Phiếu thu' : 'Phiếu chi'}</div>,
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái duyệt',
        formatter: (item) => (
          <div>
            {item.review_status === 1 ? (
              <span className='bw_label_outline bw_label_outline_success text-center'>{'Đã duyệt'}</span>
            ) : item.review_status === 0 ? (
              <span className='bw_label_outline bw_label_outline_danger text-center'>{'Không duyệt'}</span>
            ) : item.review_status === 2 ? (
              <span className='bw_label_outline bw_label_outline_warning text-center'>{'Chưa duyệt'}</span>
            ) : (
              <span className='bw_label_outline bw_label_outline_primary text-center'>{'Đang duyệt'}</span>
            )}
          </div>
        ),
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái ghi sổ',
        formatter: (item) => (
          <div>
            {item.is_book_keeping === 1 ? (
              <span className='bw_label_outline bw_label_outline_success text-center'>{'Đã ghi sổ'}</span>
            ) : (
              <span className='bw_label_outline bw_label_outline_danger text-center'>{'Chưa ghi sổ'}</span>
            )}
          </div>
        ),
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Cửa hàng',
        accessor: 'store_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Miền',
        accessor: 'business_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Công ty',
        accessor: 'company_name',
        classNameHeader: 'bw_text_center',
      },
    ],
    [],
  );

  const globalActions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-edit',
        type: 'danger',
        content: 'Ghi sổ',
        permission: 'SL_RECEIVE_PAYMENT_CASH_BOOKKEEPING',
        onClick: () => {
          if (selectedItems.length > 0) {
            const listId = selectedItems.map((_) => _.id);
            bookkeeping(listId)
              .then(() => {
                // unselection
                const unSelectElement = document.getElementById('data-table-select');
                unSelectElement && unSelectElement.click();
                reload();
                showToast.success('Ghi sổ thành công !');
              })
              .catch((err) => {
                showToast.error(err?.message || 'Ghi sổ thất bại !');
              });
          } else {
            showToast.warning('Vui lòng chọn phiếu thu, chi !');
          }
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-in',
        type: 'warning',
        content: 'Nhập excel',
        permission: 'SL_RECEIVE_PAYMENT_CASH_IMPORT',
        onClick: () => importExcel(),
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-inbox-out mr-2',
        type: 'primary',
        content: 'Xuất excel',
        permission: 'SL_RECEIVE_PAYMENT_CASH_EXPORT',
        onClick: () => exportExcel(),
      },
    ];
  }, [selectedItems, importExcel, exportExcel]);

  const actions = useMemo(() => {
    return [
      {
        icon: 'fi fa fa-check-square',
        color: 'blue',
        title: 'Duyệt',
        permission: 'SL_RECEIVE_PAYMENT_CASH_REVIEW',
        hidden: (p) => {
          return (
            p.is_reviewed !== REVIEW_STATUS.WAIT ||
            !p.review_level_user_list?.find((u) => u.user_name === user.user_name)
          );
        },
        onClick: (p) => {
          setReviewItem(p);
          setIsShowModalReview(true);
        },
      },
      {
        icon: 'fi fi-rr-copy',
        color: 'green',
        title: 'Copy',
        permission: 'SL_RECEIVE_PAYMENT_CASH_COPY',
        onClick: (p) => window._$g.rdr(`/receive-payment-slip-cash/copy/${p?.id}`),
      },
      {
        icon: 'fi fi-rr-print',
        color: 'black',
        title: 'In',
        permission: 'SL_RECEIVE_PAYMENT_CASH_PRINT',
        onClick: (p) => {
          handleExportPDF(p?.id);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'blue',
        title: 'Chi tiết',
        permission: 'SL_RECEIVE_PAYMENT_CASH_VIEW',
        onClick: (p) => window._$g.rdr(`/receive-payment-slip-cash/detail/${p?.id}`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        title: 'Sửa',
        hidden: (p) =>
          (p.review_status === REVIEW_STATUS.APPROVE || p.review_status === REVIEW_STATUS.REJECT) &&
          p.is_book_keeping === 1,
        permission: 'SL_RECEIVE_PAYMENT_CASH_EDIT',
        onClick: (p) => window._$g.rdr(`/receive-payment-slip-cash/edit/${p?.id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        title: 'Xóa',
        permission: 'SL_RECEIVE_PAYMENT_CASH_DEL',
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await handleDelete([_?.id]);
              },
            ),
          ),
      },
    ];
  }, []);

  const handleBulkAction = (items, action) => {
    if (action === 'delete') {
      let list_id = items.map((item) => item.id);
      dispatch(
        showConfirmModal(['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'], () =>
          handleDelete(list_id),
        ),
      );
    }
  };

  return (
    <div>
      <CustomeActions actions={globalActions} permission={'SL_RECEIVE_PAYMENT_CASH_ADD'} />
      <DataTable
        loading={loading}
        data={data}
        columns={columns}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        onChangeSelect={setSelectedItems}
        handleBulkAction={handleBulkAction}
      />
      {isShowModalReview && (
        <ModalReview
          setIsShowModalReview={setIsShowModalReview}
          reviewItem={reviewItem}
          setReviewItem={setReviewItem}
          loadData={loadData}
        />
      )}
    </div>
  );
};

export default ReceiveSlipTable;
