import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';
import { showConfirmModal } from 'actions/global';

import {
  deleteRequestPurchase,
  getListRequestPurchase,
  printRequestPurchase,
  getListCountIsOrdered,
  updateReview,
} from 'services/request-purchase-order.service';
import {
  APPROVE_STATUS,
  ORDER_STATUS,
  PERMISSION,
  STATUS_ORDER_OPTIONS,
} from 'pages/RequestPurchaseOrder/helpers/constants';
import { cdnPath } from 'utils/index';
import BWLoader from 'components/shared/BWLoader/index';
import { defaultPaging, openInNewTab, showToast } from 'utils/helpers';
import ReviewStatus from 'components/shared/ReviewStatus';
import ModalReview from '../Modals/ModalReview';
import { useAuth } from 'context/AuthProvider';

const COLUMN_ID = 'request_purchase_id';

const TableRequestPurchase = ({ onChangePage, onChangeParams, params, setParams }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [dataRows, setDataRows] = useState(defaultPaging);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [tabActive, setTabActive] = useState(STATUS_ORDER_OPTIONS[0].value);

  const [selectedRows, setSelectedRows] = useState([]);
  const selectedRowsToDO = (selectedRows || [])
    .filter((x) => x?.is_reviewed == APPROVE_STATUS.REVIEWED && x?.is_ordered == ORDER_STATUS.NOTYETORDER)
    ?.map((x) => ({
      id: Number(x?.request_purchase_id),
      value: Number(x?.request_purchase_id),
      code: x?.request_purchase_code,
      supplier_name: x.supplier_name,
    }));
  const isShowDOAction = Boolean(selectedRowsToDO?.length);
  const [listCountIsOrdered, setListCountIsOrdered] = useState([]);
  const [isShowModalReview, setIsShowModalReview] = useState(false);

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    getListRequestPurchase(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);

  useEffect(() => {
    getListCountIsOrdered().then((res) => setListCountIsOrdered(res));
  }, []);

  useEffect(loadData, [loadData]);

  const handlePrint = (purchase_requisition_id) => {
    setLoadingPrint(true);

    printRequestPurchase(purchase_requisition_id)
      .then((response) => openInNewTab(cdnPath(response.path)))
      .finally(() => {
        setLoadingPrint(false);
      });
  };

  const columns = useMemo(
    () => [
      {
        header: 'Ngày tạo',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'request_purchase_date',
      },
      {
        header: 'Mã đơn đặt hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'request_purchase_code',
      },
      {
        header: 'Chi nhánh',
        classNameHeader: 'bw_text_center',
        accessor: 'business_name',
      },
      {
        header: 'Nhà cung cấp',
        classNameHeader: 'bw_text_center',
        accessor: 'supplier_name',
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        formatter: (p) => {
          return <ReviewStatus reviewList={p.user_review_list} />;
        },
      },
      {
        header: 'Trạng thái đặt hàng',
        classNameHeader: 'bw_text_center',
        classNameBody: 'bw_text_center',
        accessor: 'is_ordered',
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'user_full_name',
      },
      {
        header: 'Kích hoạt',
        accessor: 'is_active',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (
          <span
            className={classNames('bw_label_outline text-center', {
              bw_label_outline_success: p?.is_active,
              bw_label_outline_danger: !p?.is_active,
            })}>
            {p?.is_active ? 'Kích hoạt' : 'Ẩn'}
          </span>
        ),
      },
    ],
    [],
  );

  const { user } = useAuth();

  const [purchaseOrderId, setPurchaseOrderId] = useState();
  const pending = 2;

  const actions = useMemo(() => {
    return [
      {
        className: 'bw_btn bw_btn_success bw_blue',
        icon: 'fi fa fa-check-square',
        color: 'blue',
        content: 'Duyệt',
        permission: PERMISSION.REVIEW,
        hidden: (p) =>
          p.is_reviewed !== pending ||
          !p.user_review_list?.find((u) => u.user_name === user.user_name) ||
          p?.isUserReviewed,
        onClick: (p) => {
          setPurchaseOrderId(p.request_purchase_id);
          setIsShowModalReview(true);
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-plus',
        type: 'success',
        content: `Lập đơn mua hàng(${selectedRowsToDO?.length || 0} phiếu)`,
        outline: true,
        hidden: !isShowDOAction,
        permission: PERMISSION.ADD,
        onClick: () => {
          if ([...new Set(selectedRowsToDO.map((_) => _.supplier_name))].length > 1) {
            showToast.warning('Đơn mua hàng chỉ được chọn từ một nhà cung cấp !');
          } else {
            history.push('/purchase-orders/add', { po_list: selectedRowsToDO, redirect_from: 'PO' });
          }
        },
      },
      {
        globalAction: true,
        icon: 'fi fi-rr-shopping-cart-add',
        type: 'success',
        content: 'Lập đơn đặt hàng',
        permission: PERMISSION.ADD,
        onClick: () => window._$g.rdr(`/request-purchase-order/add`),
      },
      {
        icon: 'fi fi-rr-print',
        hidden: (_) => false,
        color: 'black',
        permission: PERMISSION.PRINT,
        onClick: (p) => handlePrint(p?.request_purchase_id),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: PERMISSION.EDIT,
        hidden: (p) => p?.is_reviewed === 1,
        onClick: (p) => window._$g.rdr(`/request-purchase-order/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'green',
        permission: PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/request-purchase-order/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PERMISSION.DEL,
        hidden: (p) => p.is_reviewed !== pending,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteRequestPurchase([p?.[COLUMN_ID]]);
                loadData();
              },
            ),
          ),
      },
      {
        icon: ICON_COMMON.bought,
        color: 'green',
        hidden: (p) =>
          p?.is_ordered_num === 1 || p.is_reviewed !== 1 || p?.user_review_list?.some((_) => _.is_reviewed !== 1),
        permission: PERMISSION.VIEW,
        onClick: (p) => {
          history.push('/purchase-orders/add', {
            po_list: [
              {
                id: Number(p?.request_purchase_id),
                value: Number(p?.request_purchase_id),
                code: p?.request_purchase_code,
              },
            ],
            redirect_from: 'PO',
          });
        },
      },
    ];
  }, [isShowDOAction, selectedRowsToDO]);

  const getTotalIsOrdered = useCallback(
    (is_ordered) => {
      // Tất cả
      if (is_ordered === 2) {
        return listCountIsOrdered.reduce((acc, cur) => (acc += cur.total), 0);
      }
      return listCountIsOrdered.find((st) => st.is_ordered === is_ordered)?.total ?? 0;
    },
    [listCountIsOrdered],
  );

  const title = (
    <ul className='bw_tabs'>
      {STATUS_ORDER_OPTIONS.map((o) => {
        return (
          <li
            onClick={() => {
              setTabActive(o.value);
              onChangeParams({ is_ordered: o?.value });
            }}
            className={tabActive === o.value ? 'bw_active' : ''}>
            <a className='bw_link'>
              {o?.label} ({getTotalIsOrdered(o.value)})
            </a>
          </li>
        );
      })}
    </ul>
  );

  const onSubmitReview = async (data) => {
    try {
      await updateReview({ ...data, request_purchase_id: purchaseOrderId });
      loadData();
      showToast.success('Duyệt thành công');
    } catch (error) {
      showToast.error(error.message ?? 'Duyệt thất bại');
    }
    setIsShowModalReview(false);
  };

  return (
    <Fragment>
      <DataTable
        fieldCheck={COLUMN_ID}
        loading={dataRows.loading}
        title={title}
        columns={columns}
        data={dataRows.items}
        actions={actions}
        totalPages={dataRows.totalPages}
        itemsPerPage={dataRows.itemsPerPage}
        page={dataRows.page}
        totalItems={dataRows.totalItems}
        onChangePage={onChangePage}
        handleBulkAction={async (e) => {
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await deleteRequestPurchase(e?.map((o) => o?.[COLUMN_ID]));
                document.querySelector('#data-table-select')?.click();
                loadData();
              },
            ),
          );
        }}
        onChangeSelect={setSelectedRows}
      />
      {loadingPrint && <BWLoader isPage={false} />}
      {isShowModalReview && <ModalReview onSubmit={onSubmitReview} onClose={() => setIsShowModalReview(false)} />}
    </Fragment>
  );
};

export default TableRequestPurchase;
