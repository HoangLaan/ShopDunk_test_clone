import React from 'react';

const BorrowRequestType = React.lazy(() => import('pages/BorrowRequestType/page/BorrowRequestType'));
const BorrowRequestTypeAdd = React.lazy(() => import('pages/BorrowRequestType/page/BorrowRequestTypeAdd'));
const BorrowRequestTypeEdit = React.lazy(() => import('pages/BorrowRequestType/page/BorrowRequestTypeEdit'));
const BorrowRequestTypeDetail = React.lazy(() => import('pages/BorrowRequestType/page/BorrowRequestTypeDetail'));

const BorrowRequestTypeRoutes = [
  {
    path: '/borrow-request-type',
    exact: true,
    name: 'Danh sách hình thức mượn hàng',
    function: 'SL_BORROWTYPE_VIEW',
    component: BorrowRequestType,
  },
  {
    path: '/borrow-request-type/add',
    exact: true,
    name: 'Thêm mới hình thức mượn hàng',
    function: 'SL_BORROWTYPE_ADD',
    component: BorrowRequestTypeAdd,
  },
  {
    path: '/borrow-request-type/edit/:id',
    exact: true,
    name: 'Chỉnh sửa hình thức mượn hàng',
    function: 'SL_BORROWTYPE_EDIT',
    component: BorrowRequestTypeEdit,
  },
  {
    path: '/borrow-request-type/detail/:id',
    exact: true,
    name: 'Chi tiết hình thức mượn hàng',
    function: 'SL_BORROWTYPE_VIEW',
    component: BorrowRequestTypeDetail,
  },
];
export default BorrowRequestTypeRoutes;
