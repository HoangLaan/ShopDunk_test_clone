import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { showConfirmModal } from 'actions/global';
import DataTable from 'components/shared/DataTable/index';
import ICON_COMMON from 'utils/icons.common';

import purchaseRequisitionTypeService from 'services/purchaseRequisitionType.service';
import { PURCHASE_REQUISITION_TYPE_PERMISSION } from 'pages/PurchaseRequisitionType/utils/constants';
import StatusColumn from '../StatusColumn/StatusColumn';

const COLUMN_ID = 'purchase_requisition_type_id';

const PurchaseRequisitionTypeTable = ({ params, onChangePage }) => {
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
    purchaseRequisitionTypeService
      .getList(params)
      .then(setDataRows)
      .finally(() => setDataRows((prev) => ({ ...prev, loading: false })));
  }, [params]);
  useEffect(loadData, [loadData]);

  const columns = useMemo(
    () => [
      {
        header: 'Loại yêu cầu mua hàng',
        classNameHeader: 'bw_text_center',
        formatter: (p) => <b>{p?.purchase_requisition_type_name}</b>,
      },
      {
        header: 'Mô tả',
        classNameHeader: 'bw_text_center',
        accessor: 'description',
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
        permission: PURCHASE_REQUISITION_TYPE_PERMISSION.ADD,
        onClick: () => window._$g.rdr('/purchase-requisition-type/add'),
      },
      {
        icon: ICON_COMMON.edit,
        color: 'blue',
        permission: PURCHASE_REQUISITION_TYPE_PERMISSION.EDIT,
        onClick: (p) => window._$g.rdr(`/purchase-requisition-type/edit/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.view,
        color: 'blue',
        permission: PURCHASE_REQUISITION_TYPE_PERMISSION.VIEW,
        onClick: (p) => window._$g.rdr(`/purchase-requisition-type/detail/${p?.[COLUMN_ID]}`),
      },
      {
        icon: ICON_COMMON.trash,
        color: 'red',
        permission: PURCHASE_REQUISITION_TYPE_PERMISSION.DEL,
        onClick: (p) =>
          dispatch(
            showConfirmModal(
              ['Bạn có thực sự muốn xóa?', 'Bạn sẽ mất dữ liệu này và các dữ liệu liên quan.'],
              async () => {
                await purchaseRequisitionTypeService.delete([p?.[COLUMN_ID]]);
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
              await purchaseRequisitionTypeService.delete(e?.map((o) => o?.[COLUMN_ID]));
              loadData();
            },
          ),
        );
      }}
    />
  );
};

export default PurchaseRequisitionTypeTable;
