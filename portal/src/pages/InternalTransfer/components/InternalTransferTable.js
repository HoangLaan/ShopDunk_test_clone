import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteInternalTransfer, getListCountReviewStatus } from 'services/internal-transfer.service';
import { PAYMENT_TYPE, REVIEW_STATUS, STATUS_RECEIVE_MONEY } from '../helpers/const';
import { formatQuantity } from 'utils/number';
import TooltipHanlde from 'components/shared/TooltipWrapper';
import ReviewStatus from 'components/shared/ReviewStatus';

const InternalTransferTable = ({
  loading,
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onRefresh,
  onChangeParams,
}) => {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        header: 'Số chứng từ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'internal_transfer_code',
      },
      {
        header: 'Ngày chứng từ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'created_date',
      },
      {
        header: 'Ngày hạch toán',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'accounting_date',
      },
      {
        header: 'Nội dung',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <TooltipHanlde maxString={50}>{p.internal_transfer_name}</TooltipHanlde>,
      },
      {
        header: 'Hình thức',
        classNameHeader: 'bw_text_center',
        accessor: 'internal_transfer_type_name',
      },
      {
        header: 'Hình thức chuyển',
        classNameHeader: 'bw_text_center',
        formatter: (p) => PAYMENT_TYPE.find((item) => item.value === p.payment_type).label,
      },
      {
        header: 'Tài khoản ghi nhận',
        classNameHeader: 'bw_text_center',
        accessor: 'account',
      },
      {
        header: 'Tài khoản chi',
        classNameHeader: 'bw_text_center',
        accessor: 'bank_account_transfer',
      },
      {
        header: 'Tài khoản thu',
        classNameHeader: 'bw_text_center',
        accessor: 'bank_account_receive',
      },
      {
        header: 'Thu',
        classNameHeader: 'bw_text_center',
        formatter: (p) => formatQuantity(p.total_receive_slip),
      },
      {
        header: 'Chi',
        classNameHeader: 'bw_text_center',
        formatter: (p) => formatQuantity(p.total_payment_slip),
      },
      {
        header: 'Đối tượng thu',
        classNameHeader: 'bw_text_center',
        accessor: 'store_receive',
      },
      {
        header: 'Đối tượng chi',
        classNameHeader: 'bw_text_center',
        accessor: 'store_transfer',
      },
      {
        header: 'Người thực hiện',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Thông tin duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          if (!p.review_levels) return;
          const mappingReview = (is_review) => {
            const reviewInstance = {
              0: 2,
              2: 1,
              3: 0,
            };
            return reviewInstance[is_review];
          };
          return (
            <>
              <ReviewStatus
                reviewList={p.review_levels.map(({ is_review, user_review }) => {
                  const [review_user, full_name] = user_review.split('-');
                  return { is_reviewed: mappingReview(is_review), review_user, full_name };
                })}
              />
            </>
          );
        },
      },
      {
        header: 'Trạng thái',
        accessor: 'is_active',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          const review_status = p.review_status;

          const instanceReview = REVIEW_STATUS.find((item) => item.value === review_status);
          if (!instanceReview) return;

          return (
            <>
              <span className={`bw_label_outline bw_label_outline_${instanceReview.color} text-center`}>
                {instanceReview.label}
              </span>
            </>
          );
        },
      },
      {
        header: 'Trạng thái nghiệp vụ',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          const review_status_business_value = [4, 5];
          const instanceReview = REVIEW_STATUS.filter((item) => review_status_business_value.includes(item.value)).find(
            (item) => item.value === p.review_status_business,
          );
          if (!instanceReview) return;

          return (
            <>
              <span className={`bw_label_outline bw_label_outline_${instanceReview.color} text-center`}>
                {instanceReview.label}
              </span>
            </>
          );
        },
      },

      {
        header: 'Trạng thái nhận tiền',
        accessor: 'status_receive_money',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          const instanceStatusReceiveMoney = STATUS_RECEIVE_MONEY.find((item) => item.value === p.status_receive_money);
          if (!instanceStatusReceiveMoney) return;

          return (
            <>
              <span className={`bw_label_outline bw_label_outline_${instanceStatusReceiveMoney.color} text-center`}>
                {instanceStatusReceiveMoney.label}
              </span>
            </>
          );
        },
      },
    ],
    [],
  );

  const [listCountReviewStatus, setListCountReviewStatus] = useState([]);
  const [tabActive, setTabActive] = useState(REVIEW_STATUS[0].value);
  useEffect(() => {
    getListCountReviewStatus().then((res) => setListCountReviewStatus(res));
  }, []);

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Thêm mới',
        permission: 'SL_INTERNALTRANSFER_ADD',
        onClick: () => window._$g.rdr(`/internal-transfer/add`),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: 'SL_INTERNALTRANSFER_EDIT',
        hidden: (p) => p.review_status !== 0,
        onClick: (p) => {
          window._$g.rdr(`/internal-transfer/edit/${p?.internal_transfer_id}`);
        },
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: 'SL_INTERNALTRANSFER_VIEW',
        onClick: (p) => window._$g.rdr(`/internal-transfer/detail/${p?.internal_transfer_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        hidden: (p) => p.review_status !== 0,
        permission: 'SL_INTERNALTRANSFER_DEL',
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteInternalTransfer(p?.internal_transfer_id);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh]);

  const getTotalReviewStatus = useCallback(
    (review_status) => {
      // Tất cả
      if (review_status === -1) {
        return listCountReviewStatus.reduce((acc, cur) => (acc += cur.total), 0);
      }
      // Nếu là đã duyệt thì cộng thêm cả Đang thực hiện và đã hoàn thành
      let totalConfirmed = 0;
      const isConfirmed = review_status === 2;
      if (isConfirmed) {
        const review_status_has_completed = [4, 5];
        totalConfirmed = listCountReviewStatus.reduce((acc, cur) => {
          if (review_status_has_completed.includes(cur.review_status)) {
            return (acc += cur.total);
          }
          return 0;
        }, 0);
      }
      return (
        (listCountReviewStatus.find((st) => st.review_status === review_status)?.total ?? 0) +
        (isConfirmed ? totalConfirmed : 0)
      );
    },
    [listCountReviewStatus],
  );

  const title = useMemo(
    () => (
      <ul className='bw_tabs'>
        {REVIEW_STATUS.map((o) => {
          return (
            <li
              onClick={() => {
                setTabActive(o.value);
                onChangeParams({ review_status: o?.value });
              }}
              className={tabActive === o.value ? 'bw_active' : ''}>
              <a className='bw_link'>
                {o?.label} ({getTotalReviewStatus(o.value)})
              </a>
            </li>
          );
        })}
      </ul>
    ),
    [tabActive, getTotalReviewStatus],
  );

  return (
    <DataTable
      title={title}
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
              await deleteInternalTransfer(e.map((o) => o.internal_transfer_id)?.join(',')).then(() => onRefresh());
            },
          ),
        );
      }}
    />
  );
};

export default InternalTransferTable;
