import React from 'react';

const BorrowRequest = React.lazy(() => import('pages/BorrowRequest/pages/BorrowRequest'));
const BorrowRequestAdd = React.lazy(() => import('pages/BorrowRequest/pages/BorrowRequestAdd'));
const BorrowRequestEdit = React.lazy(() => import('pages/BorrowRequest/pages/BorrowRequestEdit'));
const BorrowRequestDetail = React.lazy(() => import('pages/BorrowRequest/pages/BorrowRequestDetail'));

const borrowRequestRoutes = [
  {
    path: '/borrow-request',
    exact: true,
    name: 'Danh sách đề xuất mượn hàng',
    function: 'SL_BORROWREQUEST_VIEW',
    component: BorrowRequest,
  },
  {
    path: '/borrow-request/add',
    exact: true,
    name: 'Thêm mới đề xuất mượn hàng',
    function: 'SL_BORROWREQUEST_ADD',
    component: BorrowRequestAdd,
  },
  {
    path: '/borrow-request/edit/:id',
    exact: true,
    name: 'Chỉnh sửa đề xuất mượn hàng',
    function: 'SL_BORROWREQUEST_EDIT',
    component: BorrowRequestEdit,
  },
  {
    path: '/borrow-request/detail/:id',
    exact: true,
    name: 'Chi tiết đề xuất mượn hàng',
    function: 'SL_BORROWREQUEST_VIEW',
    component: BorrowRequestDetail,
  },
];
export default borrowRequestRoutes;
