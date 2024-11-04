import React from 'react';

const PurchaseRequisitionAddPage = React.lazy(() => import('pages/PurchaseRequisition/PurchaseRequisitionAddPage'));
const PurchaseRequisitionPage = React.lazy(() => import('pages/PurchaseRequisition/PurchaseRequisitionPage'));

const purchaseRequisitionRoute = [
  {
    path: '/purchase-requisition',
    exact: true,
    name: 'Danh sách yêu cầu nhập hàng',
    function: 'PO_PURCHASEREQUISITION_VIEW',
    component: PurchaseRequisitionPage,
  },
  {
    path: '/purchase-requisition/add',
    exact: true,
    name: 'Thêm mới yêu cầu nhập hàng',
    function: 'PO_PURCHASEREQUISITION_ADD',
    component: PurchaseRequisitionAddPage,
  },
  {
    path: '/purchase-requisition/edit/:purchase_requisition_id',
    exact: true,
    name: 'Chỉnh sửa yêu cầu nhập hàng',
    function: 'PO_PURCHASEREQUISITION_EDIT',
    component: PurchaseRequisitionAddPage,
  },
  {
    path: '/purchase-requisition/view/:purchase_requisition_id',
    exact: true,
    name: 'Chi tiết yêu cầu nhập hàng',
    function: 'PO_PURCHASEREQUISITION_VIEW',
    component: PurchaseRequisitionAddPage,
  },
];

export default purchaseRequisitionRoute;
