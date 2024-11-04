import React from 'react';

const PurchaseCostsPage = React.lazy(() => import('pages/PurchaseCosts/pages/ListPage'));
const PurchaseCostsAdd = React.lazy(() => import('pages/PurchaseCosts/pages/AddPage'));
const PurchaseCostsEdit = React.lazy(() => import('pages/PurchaseCosts/pages/EditPage'));
const PurchaseCostsDetail = React.lazy(() => import('pages/PurchaseCosts/pages/DetailPage'));;

const PurchaseCostRoutes = [
  {
    path: '/purchase-cost',
    exact: true,
    name: 'Danh sách chi phí mua hàng',
    function: 'SL_PURCHASECOSTS_VIEW',
    component: PurchaseCostsPage,
  },
  {
    path: '/purchase-cost/add',
    exact: true,
    name: 'Thêm mới chi phí mua hàng',
    function: 'SL_PURCHASECOSTS_ADD',
    component: PurchaseCostsAdd,
  },
  {
    path: '/purchase-cost/edit/:id',
    exact: true,
    name: 'Chỉnh sửa chi phí mua hàng',
    function: 'SL_PURCHASECOSTS_EDIT',
    component: PurchaseCostsEdit,
  },
  {
    path: '/purchase-cost/detail/:id',
    exact: true,
    name: 'Chi tiết chi phí mua hàng',
    function: 'SL_PURCHASECOSTS_DETAIL',
    component: PurchaseCostsDetail,
  },
];

export default PurchaseCostRoutes;
