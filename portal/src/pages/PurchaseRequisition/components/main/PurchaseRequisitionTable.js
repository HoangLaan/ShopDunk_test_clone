import React, { Fragment, useMemo, useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import DataTable from 'components/shared/DataTable/index';
import { showConfirmModal } from 'actions/global';
import { deletePurchaseRequisition, getListCountPrStatus, updateReview } from 'services/purchase-requisition.service';
import { printPR } from 'pages/PurchaseRequisition/utils/utils';
import {
  PR_STATUS,
  PURCHASE_REQUISITION_PERMISSION,
  REVIEW_STATUS,
  REVIEW_TYPES,
} from 'pages/PurchaseRequisition/utils/constants';
import ICON_COMMON from 'utils/icons.common';
import ModalReview from './ModalReview';
import { useAuth } from 'context/AuthProvider';
import { showToast } from 'utils/helpers';
import ReviewStatus from 'components/shared/ReviewStatus';
import { getListPurchaseRequisition } from 'services/purchase-requisition.service';

const PurchaseRequisitionTable = ({
  data,
  totalPages,
  itemsPerPage,
  page,
  totalItems,
  onChangePage,
  onChangeParams,
  onRefresh,
  loading,
  params,
}) => {
  const [listCountPrStatus, setListCountPrStatus] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [modalReview, setModalReview] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const selectedRowsToPO = (selectedRows || [])
    .filter((x) => x?.is_reviewed === 1 && x?.pr_status_id === PR_STATUS.PENDING)
    ?.map((x) => ({
      id: Number(x?.purchase_requisition_id),
      value: Number(x?.purchase_requisition_id),
    }));
  const isShowPOAction = Boolean(selectedRowsToPO?.length);

  const { user } = useAuth();

  const columns = useMemo(
    () => [
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
      {
        header: 'Mã yêu cầu',
        accessor: 'purchase_requisition_code',
        classNameHeader: 'bw_sticky bw_name_sticky bw_text_center',
        classNameBody: 'bw_sticky bw_name_sticky',
      },
      {
        header: 'Chi nhánh yêu cầu',
        accessor: 'business_request_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Cửa hàng yêu cầu',
        accessor: 'store_request_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Phòng ban yêu cầu',
        accessor: 'department_request_name',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Người yêu cầu',
        accessor: 'requisition_user',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái duyệt',
        formatter: (d) => {
          return (
            <ReviewStatus
              reviewList={d?.review_level_user_list.map((item) => ({ ...item, is_reviewed: item.is_review }))}
            />
          );
        },
      },
      {
        header: 'Kích hoạt',
        formatter: (p) =>
          p?.is_active ? (
            <span className='bw_label_outline bw_label_outline_success text-center'>Kích hoạt</span>
          ) : (
            <span className='bw_label_outline bw_label_outline_danger text-center'>Ẩn</span>
          ),
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
      },
    ],
    [],
  );

  const [tabActive, setTabActive] = useState(REVIEW_TYPES[0].value);

  const pending = 2;

  const hiddenReview = (row) => {
    if (
      row.is_reviewed === pending &&
      // user.isAdministrator ||
      row?.user_review_list?.includes(user.user_name)
    )
      return false;
    return true;
  };

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: `Lập đơn đặt hàng (${selectedRowsToPO?.length || 0} phiếu)`,
        outline: true,
        hidden: !isShowPOAction,
        permission: PURCHASE_REQUISITION_PERMISSION.ADD,
        onClick: () => {
          const pr_ids_selected = selectedRowsToPO.map((item) => (item.id ?? item).toString());
          const pr_list = [];
          for (const item of data) {
            if (pr_ids_selected.includes(item.purchase_requisition_id)) {
              pr_list.push({
                value: parseInt(item.purchase_requisition_id),
                label: item.purchase_requisition_code,
                business_request_id: item.business_request_id,
              });
              // Nếu đã push đủ số lượng thì ko cần loop nữa
              if (pr_list.length === pr_ids_selected.length) break;
            }
          }
          history.push('/request-purchase-order/add', { pr_list });
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: 'Lập yêu cầu nhập hàng',
        permission: PURCHASE_REQUISITION_PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/purchase-requisition/add`),
      },
      {
        icon: 'fa fa-check-square',
        color: 'blue',
        permission: PURCHASE_REQUISITION_PERMISSION.REVIEW,
        hidden: hiddenReview,
        onClick: (p) => setModalReview(p),
      },
      {
        icon: ICON_COMMON.print,
        color: 'black',
        permission: PURCHASE_REQUISITION_PERMISSION.PRINT,
        onClick: (p) => printPR(p?.purchase_requisition_id),
      },
      {
        icon: 'fi fi-rr-edit',
        color: 'blue',
        permission: PURCHASE_REQUISITION_PERMISSION.EDIT,
        hidden: (row) => row?.is_reviewed !== pending,
        onClick: (p) => window._$g.rdr(`/purchase-requisition/edit/${p?.purchase_requisition_id}`),
      },
      {
        icon: 'fi fi-rr-eye',
        color: 'green',
        permission: PURCHASE_REQUISITION_PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/purchase-requisition/view/${p?.purchase_requisition_id}`),
      },
      {
        icon: 'fi fi-rr-trash',
        color: 'red',
        permission: PURCHASE_REQUISITION_PERMISSION.DEL,
        hidden: (row) => row?.is_reviewed !== pending,
        onClick: (_, d) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deletePurchaseRequisition([_?.purchase_requisition_id]);
                onRefresh();
              },
            ),
          ),
      },
    ];
  }, [dispatch, onRefresh, user, isShowPOAction, selectedRowsToPO]);

  const onSubmitReview = async (payload) => {
    try {
      await updateReview({
        purchase_requisition_id: modalReview?.purchase_requisition_id,
        ...payload,
      });
      setModalReview(null);
      onRefresh();
      showToast.success('Cập nhật duyệt thành công');
    } catch (error) {
      showToast.error(error.message);
    }
  };

  useEffect(() => {
    getListCountPrStatus().then((res) => {
      setListCountPrStatus(res);
    });
  }, []);

  return (
    <Fragment>
      <DataTable
        title={
          <ul className='bw_tabs'>
            {REVIEW_TYPES.map((o) => {
              return (
                <li
                  onClick={() => {
                    setTabActive(o.value);
                    onChangeParams({
                      review_status: o?.value,
                      pr_status_id: null,
                    });
                  }}
                  className={tabActive === o.value ? 'bw_active' : ''}>
                  <a className='bw_link'>
                    {o?.label} (
                    {o.value === REVIEW_STATUS.ALL
                      ? listCountPrStatus.total
                      : o.value === REVIEW_STATUS.ACCEPT
                      ? listCountPrStatus.review_success
                      : o.value === REVIEW_STATUS.REJECT
                      ? listCountPrStatus.review_fail
                      : listCountPrStatus.review_pending}
                    )
                  </a>
                </li>
              );
            })}
            <li
              onClick={() => {
                setTabActive(4);
                onChangeParams({
                  pr_status_id: 4,
                  review_status: null,
                });
              }}
              className={tabActive === 4 ? 'bw_active' : ''}>
              <a className='bw_link'>
                {'Hủy'} ({listCountPrStatus.status_cancel})
              </a>
            </li>
          </ul>
        }
        loading={loading}
        columns={columns}
        data={data}
        actions={actions}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        page={page}
        totalItems={totalItems}
        onChangePage={onChangePage}
        onChangeSelect={setSelectedRows}
        handleBulkAction={(e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deletePurchaseRequisition(e?.map((o) => o?.purchase_requisition_id));
                onRefresh();
              },
            ),
          );
        }}
      />
      {modalReview && (
        <ModalReview onSubmit={onSubmitReview} onClose={() => setModalReview(null)} modalReview={modalReview} />
      )}
    </Fragment>
  );
};

export default PurchaseRequisitionTable;
