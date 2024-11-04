import React from 'react';
import { PURCHASE_REQUISITION_TYPE_PERMISSION } from 'pages/PurchaseRequisitionType/utils/constants';

const PurchaseRequisitionType = React.lazy(() => import('pages/PurchaseRequisitionType/pages/PurchaseRequisitionType'));
const PurchaseRequisitionTypeAdd = React.lazy(() =>
  import('pages/PurchaseRequisitionType/pages/PurchaseRequisitionTypeAdd'),
);

const purchaseRequisitionTypeRoute = [
  {
    path: '/purchase-requisition-type',
    exact: true,
    name: 'Danh sách loại yêu cầu mua hàng',
    function: PURCHASE_REQUISITION_TYPE_PERMISSION.VIEW,
    component: PurchaseRequisitionType,
  },
  {
    path: '/purchase-requisition-type/add',
    exact: true,
    name: 'Thêm mới loại yêu cầu mua hàng',
    function: PURCHASE_REQUISITION_TYPE_PERMISSION.ADD,
    component: PurchaseRequisitionTypeAdd,
  },
  {
    path: '/purchase-requisition-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa loại yêu cầu mua hàng',
    function: PURCHASE_REQUISITION_TYPE_PERMISSION.EDIT,
    component: PurchaseRequisitionTypeAdd,
  },
  {
    path: '/purchase-requisition-type/detail/:id',
    exact: true,
    name: 'Chi tiết loại yêu cầu mua hàng',
    function: PURCHASE_REQUISITION_TYPE_PERMISSION.VIEW,
    component: PurchaseRequisitionTypeAdd,
  },
];

export default purchaseRequisitionTypeRoute;
