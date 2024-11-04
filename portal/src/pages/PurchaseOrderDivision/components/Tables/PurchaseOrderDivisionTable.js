import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';

import purchaseOrderDivisionService from 'services/purchaseOrderDivision.service';
import { PURCHASE_ORDER_DIVISION_PERMISSION, reviewTypeOptions } from 'pages/PurchaseOrderDivision/utils/constants';
import StatusColumn from '../StatusColumn/StatusColumn';
import ReviewStatus from 'components/shared/ReviewStatus';

const COLUMN_ID = 'purchase_order_division_id';

const PurchaseOrderDivisionTable = ({ params, onChangePage }) => {
  const dispatch = useDispatch();

  const [dataRows, setDataRows] = useState({
    items: [],
    itemsPerPage: 0,
    page: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
  });

  const loadData = useCallback(() => {
    setDataRows((prev) => ({ ...prev, loading: true }));
    purchaseOrderDivisionService
      .getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);
  useEffect(loadData, [loadData]);

  const jsx_review = useCallback(({ type = '', avatar = null, full_name = '', review_user: user_name }) => {
    const findReview = reviewTypeOptions?.find((p) => +p?.value === +type);
    if (findReview) {
      const { label = '', className, icon, colorLabel } = findReview;
      return (
        <li className={className}>
          <img
            src={avatar ? `${process.env.REACT_APP_CDN}${avatar}` : '/bw_image/img_cate_default.png'}
            alt='review user avatar'
          />
          <span className={`fi ${icon}`}></span>
          <p>
            {`${user_name} - ${full_name}`}
            {' - '}
            <i className={colorLabel}>{label}</i>
          </p>
        </li>
      );
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        header: 'Tên phiếu chia hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.purchase_order_division_name}</b>,
      },
      {
        header: 'Mã đơn phiếu chia hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'purchase_order_division_code',
      },
      {
        header: 'Mã đơn mua hàng',
        classNameHeader: 'bw_text_center',
        accessor: 'purchase_order_code',
        formatter: (p) => {
          let list = (p?.purchase_order_code || '').split(',');
          return (
            <>
              {(list || []).map((item, index) => {
                return <p>{item}</p>;
              })}
            </>
          );
        },
      },
      {
        header: 'Người duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (p) => {
          const pending = 2;
          return  (
            <ReviewStatus
            reviewList={p.review_user_list.map(item => ({...item, is_reviewed: item.is_reviewed ?? pending}))}
            />
          )
        },
      },
      {
        header: 'Trạng thái duyệt',
        classNameHeader: 'bw_text_center',
        formatter: (p) => (p?.is_reviewed ? 'Đã duyệt' : 'Chưa duyệt'),
      },
      {
        header: 'Người tạo',
        classNameHeader: 'bw_text_center',
        accessor: 'created_user',
      },
      {
        header: 'Ngày tạo',
        accessor: 'created_date',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
      },
      {
        header: 'Trạng thái',
        classNameBody: 'bw_text_center',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <StatusColumn status={p?.is_active} />,
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    return [
      {
        globalAction: true,
        icon: ICON_COMMON.add,
        type: 'success',
        content: 'Thêm mới',
        permission: PURCHASE_ORDER_DIVISION_PERMISSION.ADD,
        onClick: () => window._$g.rdr('/purchase-order-division/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: PURCHASE_ORDER_DIVISION_PERMISSION.EDIT,
        hidden: (p) => p?.is_reviewed,
        onClick: (p) => window._$g.rdr(`/purchase-order-division/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'blue',
        permission: PURCHASE_ORDER_DIVISION_PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/purchase-order-division/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PURCHASE_ORDER_DIVISION_PERMISSION.DEL,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await purchaseOrderDivisionService.delete([p?.[COLUMN_ID]]);
                loadData();
              },
            ),
          ),
      },
    ];
  }, []);

  return (
    <DataTable
      fieldCheck={COLUMN_ID}
      loading={dataRows.loading}
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
              await purchaseOrderDivisionService.delete(e?.map((o) => o?.[COLUMN_ID]));
              loadData();
            },
          ),
        );
      }}
    />
  );
};

export default PurchaseOrderDivisionTable;
